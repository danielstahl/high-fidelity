package models.spotify

import java.util.Base64

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.headers.{BasicHttpCredentials, OAuth2BearerToken}
import akka.http.scaladsl.model._
import akka.http.scaladsl.unmarshalling.Unmarshal
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}
import spray.json.DefaultJsonProtocol

import scala.concurrent.Future
import scala.util.Failure
import scala.util.Success

case class ArtistDigest(spotifyUri: String, name: String, imageUrl: Option[String])

case class SpotifyLoginCallback(token: String, code: String, requestor: ActorRef)
case class SpotifyStatus(loggedIn: Boolean)

case class SearchArtists(token: String, query: String, requestor: ActorRef)
case class ArtistSearchResult(result: Seq[ArtistDigest])
case class SearchError(query: String, cause: String)

case class AccessToken(access_token: String, token_type: String, scope: Option[String], expires_in: Int, refresh_token: String)

trait SpotifyUserJsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val accessTokenFormat = jsonFormat5(AccessToken)
  implicit val searchErrorFormat = jsonFormat2(SearchError)
  implicit val artistDigestFormat = jsonFormat3(ArtistDigest)
  implicit val artistSearchResultFormat = jsonFormat1(ArtistSearchResult)
}

class SpotifyUserActor(userActor: ActorRef, var accessToken: Option[AccessToken]) extends Actor with ActorLogging with SpotifyUserJsonSupport with SpotifyModelJsonSupport {

  import context.dispatcher

  private val clientId = context.system.settings.config.getString("services.user-account.spotify-client-id")
  private val clientSecret = context.system.settings.config.getString("services.user-account.spotify-client-secret")
  private val spotifyAccountsAuth = Base64.getEncoder.encodeToString(s"$clientId:$clientSecret".getBytes)

  final implicit val materializer: ActorMaterializer = ActorMaterializer(ActorMaterializerSettings(context.system))

  val http = Http(context.system)

  def login(code: String): Future[AccessToken] = {
    val data = Map(
      "grant_type" -> "authorization_code",
      "code" -> code,
      "redirect_uri" -> "http://localhost:8080/spotify-login-callback")

    val request = HttpRequest(uri = "https://accounts.spotify.com/api/token",
      method = HttpMethods.POST,
      entity = FormData(data).toEntity,
      headers = List(headers.Authorization(BasicHttpCredentials(spotifyAccountsAuth))))

    http.singleRequest(request)
      .flatMap(httpResponse => Unmarshal(httpResponse).to[AccessToken])
  }

  def getLastImage(spotifyArtist: SpotifyArtist): Option[String] = {
    if(spotifyArtist.images.isEmpty) {
      Option.empty
    } else {
      Option(spotifyArtist.images.last.url)
    }
  }
  def spotifySearchResult2ArtistSearchResult(spotifySearchResult: SpotifySearchResult): ArtistSearchResult = {
    val searchResult = spotifySearchResult.artists.map(spotifyArtistResult =>
      spotifyArtistResult.items.map(spotifyArtist =>
        ArtistDigest(spotifyArtist.uri, spotifyArtist.name, getLastImage(spotifyArtist))))
      .getOrElse(Seq())
    ArtistSearchResult(searchResult)
  }

  def searchArtists(query: String): Future[ArtistSearchResult] = {
    val params = Seq(("foo", "bar"))

    val uri = Uri("https://api.spotify.com/v1/search")
        .withQuery(Uri.Query(("query", query), ("market", "SE"), ("type", "artist")))

    val request = HttpRequest(
      uri = uri,
      method = HttpMethods.GET,
      headers = List(headers.Authorization(OAuth2BearerToken(accessToken.get.access_token)))
    )

    val responseFuture: Future[HttpResponse] =
      http.singleRequest(request)


    val spotifySearchFuture =
      responseFuture.flatMap(response =>
        Unmarshal(response).to[SpotifySearchResult])

    spotifySearchFuture.map(spotifySearchResult => spotifySearchResult2ArtistSearchResult(spotifySearchResult))
  }

  def receive = {
    case SpotifyLoginCallback(token, code, requestor) =>
      login(code).map {
        accessToken =>
          this.accessToken = Option(accessToken)
          val spotifyStatus = SpotifyStatus(loggedIn = true)
          userActor ! spotifyStatus
          requestor ! spotifyStatus
      }
    case SearchArtists(token, query, requestor) =>
      val searchResultFuture = searchArtists(query)
      searchResultFuture.onComplete {
        case Success(searchResult) =>
          requestor ! searchResult
        case Failure(t) =>
          log.error(t, t.getMessage)
          requestor ! SearchError(query, t.getMessage)
      }

  }
}
