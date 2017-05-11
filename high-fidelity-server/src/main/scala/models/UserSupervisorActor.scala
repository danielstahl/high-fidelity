package models

import akka.actor.{Actor, Props}
import akka.http.scaladsl.Http
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}

case class AccessTokenRequest(userId: String)

class UserActor(user: User) extends Actor {

  def receive = {
    case accessTokenRequest: AccessTokenRequest =>
      sender() ! user.accessToken
  }
}

case class LoginRequest(code: String)

class UserSupervisorActor extends Actor {

  final implicit val materializer: ActorMaterializer = ActorMaterializer(ActorMaterializerSettings(context.system))

  val userLoginActor = context.actorOf(Props[UserAccountActor], "userLoginActor")
  val userProfileActor = context.actorOf(Props[UserProfileActor], "userProfileActor")

  val http = Http(context.system)

  def receive = {
    case LoginRequest(code) =>
      userLoginActor ! UserAccountRequest(code, sender())
    case UserAccountResponse(accessToken, requestor) =>
      userProfileActor ! UserProfileRequest(accessToken, requestor)
    case UserProfileResponse(user, requester) =>
      requester ! user
    }
}
