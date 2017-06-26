package models.user

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}
import com.google.firebase.auth.FirebaseToken
import models.mediaitem.{UserMediaItemActor, UserMediaItemsActorRequest}
import service.Firebase

case class UserRequest(uid: String, requester: ActorRef)

class UserActor(user: User, firebase: Firebase) extends Actor with ActorLogging {

  val userMediaItemActor = context.actorOf(Props[UserMediaItemActor](new UserMediaItemActor(firebase)), "userMediaItemActor")

  def receive = {
    case UserRequest(uid, requester) =>
      requester ! user
    case userMediaItemRequest: UserMediaItemsActorRequest =>
      userMediaItemActor ! userMediaItemRequest
  }
}

case class LoginRequest(token: String)
case class UserMediaItemsRequest(token: String)

class UserSupervisorActor(firebase: Firebase) extends Actor with ActorLogging {
  import context.dispatcher

  def firebaseTokenToUser(firebaseToken: FirebaseToken): User =
    User(uid = firebaseToken.getUid, email = firebaseToken.getEmail, loggedIn = true, spotify = false)

  def userActorFromToken(firebaseToken: FirebaseToken): UserActor =
    new UserActor(firebaseTokenToUser(firebaseToken), firebase)

  def makeUserActor(firebaseToken: FirebaseToken): ActorRef = {
    context.child(firebaseToken.getUid)
      .getOrElse(context.actorOf(Props[UserActor](userActorFromToken(firebaseToken)), firebaseToken.getUid))
  }

  def receive = {
    case LoginRequest(token) =>
      val requestor = sender()
      firebase.verifyIdToken(token)
        .foreach(firebaseToken => {
          val userActor = makeUserActor(firebaseToken)
          userActor ! UserRequest(firebaseToken.getUid, requestor)
        })
    case UserMediaItemsRequest(token) =>
      val requestor = sender()
      firebase.verifyIdToken(token)
          .foreach(firebaseToken => {
            val userActor = makeUserActor(firebaseToken)
            userActor ! UserMediaItemsActorRequest(firebaseToken.getUid, requestor)
          })
  }
}
