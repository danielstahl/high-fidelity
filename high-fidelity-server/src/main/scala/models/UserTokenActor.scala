package models

import akka.actor.{Actor, ActorRef}
import pdi.jwt.{Jwt, JwtAlgorithm}
import spray.json.{JsObject, JsString}


case class UserTokenRequest(requester: ActorRef, user: User)

case class UserTokenResponse(userToken: String, user: User, requestor: ActorRef)

class UserTokenActor extends Actor {

  val secret = "thesecret"

  def receive = {
    case UserTokenRequest(requester, user) => {
      val userToken = Jwt.encode(
        JsObject("user" -> JsString(user.privateUser.id)).compactPrint,
        secret,
        JwtAlgorithm.HS384)
      sender() ! UserTokenResponse(userToken, user, requester)
    }
  }
}
