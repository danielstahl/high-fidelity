package models.spotify

import java.util.Base64

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.headers.BasicHttpCredentials
import akka.http.scaladsl.model.{FormData, HttpMethods, HttpRequest, headers}
import akka.http.scaladsl.unmarshalling.Unmarshal
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}
import spray.json.DefaultJsonProtocol

import scala.concurrent.Future


case class SpotifyLoginCallback(token: String, code: String, requestor: ActorRef)
case class SpotifyStatus(loggedIn: Boolean)

case class AccessToken(access_token: String, token_type: String, scope: Option[String], expires_in: Int, refresh_token: String)

trait SpotifyUserJsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val accessTokenFormat = jsonFormat5(AccessToken)
}

class SpotifyUserActor(userActor: ActorRef, var accessToken: Option[AccessToken]) extends Actor with ActorLogging with SpotifyUserJsonSupport {

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

  def receive = {
    case SpotifyLoginCallback(token, code, requestor) =>
      login(code).map {
        accessToken =>
          this.accessToken = Option(accessToken)
          val spotifyStatus = SpotifyStatus(loggedIn = true)
          userActor ! spotifyStatus
          requestor ! spotifyStatus
      }
  }
}
