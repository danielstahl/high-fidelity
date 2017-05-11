package models

import java.util.Base64

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.headers.BasicHttpCredentials
import akka.http.scaladsl.model.{FormData, HttpMethods, HttpRequest, headers}
import akka.http.scaladsl.unmarshalling.Unmarshal
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}

import scala.concurrent.Future

case class UserAccountRequest(code: String, requester: ActorRef)

case class UserAccountResponse(accessToken: AccessToken, requester: ActorRef)

class UserAccountActor extends Actor with ActorLogging with UserJsonSupport {

  import akka.pattern.pipe
  import context.dispatcher

  private val clientId = "1b24de0b94324459b855aa136d301949"
  private val clientSecret = "010207693b134a4691b6dff1d53061e1"
  private val spotifyAccountsAuth = Base64.getEncoder.encodeToString(s"$clientId:$clientSecret".getBytes)

  final implicit val materializer: ActorMaterializer = ActorMaterializer(ActorMaterializerSettings(context.system))

  val http = Http(context.system)

  def receive = {
    case UserAccountRequest(code, requester) =>
      login(code)
        .map(accessToken => UserAccountResponse(accessToken, requester))
        .pipeTo(sender())
  }

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
}