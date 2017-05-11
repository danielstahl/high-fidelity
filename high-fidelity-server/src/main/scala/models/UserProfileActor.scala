package models

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.{HttpMethods, HttpRequest, HttpResponse, headers}
import akka.http.scaladsl.model.headers.OAuth2BearerToken
import akka.http.scaladsl.unmarshalling.Unmarshal
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}

import scala.concurrent.Future


case class UserProfileRequest(accessToken: AccessToken, requestor: ActorRef)

case class UserProfileResponse(user: User, requester: ActorRef)

class UserProfileActor extends Actor with ActorLogging with UserJsonSupport {

  import akka.pattern.pipe
  import context.dispatcher

  final implicit val materializer: ActorMaterializer = ActorMaterializer(ActorMaterializerSettings(context.system))

  val http = Http(context.system)

  def receive = {
    case UserProfileRequest(accessToken, requester) =>
      currentUserProfile(accessToken)
        .map(user => UserProfileResponse(User(accessToken, user), requester))
        .pipeTo(sender())
  }

  def currentUserProfile(accessToken: AccessToken): Future[PrivateUser] = {
    val request = HttpRequest(
      uri = "https://api.spotify.com/v1/me",
      method = HttpMethods.GET,
      headers = List(headers.Authorization(OAuth2BearerToken(accessToken.access_token))))

    val profileFuture: Future[HttpResponse] =
      http.singleRequest(request)

    profileFuture.flatMap(response =>
      Unmarshal(response).to[PrivateUser])
  }
}
