package models

import akka.actor.{Actor, Props}
import akka.http.scaladsl.Http
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}

case class AccessTokenRequest(userId: String)

class UserActor(user: User, userToken: String) extends Actor {

  def receive = {
    case accessTokenRequest: AccessTokenRequest =>
      sender() ! user.accessToken
  }
}

case class LoginRequest(code: String)

class UserSupervisorActor extends Actor {

  final implicit val materializer: ActorMaterializer = ActorMaterializer(ActorMaterializerSettings(context.system))

  val userAccountActor = context.actorOf(Props[UserAccountActor], "userLoginActor")
  val userProfileActor = context.actorOf(Props[UserProfileActor], "userProfileActor")
  val userTokenActor = context.actorOf(Props[UserTokenActor], "userTokenActor")

  val http = Http(context.system)

  def receive = {
    case LoginRequest(code) =>
      userAccountActor ! UserAccountRequest(code, sender())
    case UserAccountResponse(accessToken, requester) =>
      userProfileActor ! UserProfileRequest(accessToken, requester)
    case UserProfileResponse(user, requester) =>
      userTokenActor ! UserTokenRequest(requester, user)
    case UserTokenResponse(userToken, user, requester) =>
      context.actorOf(Props[UserActor](new UserActor(user, userToken)))
      requester ! userToken
    }
}
