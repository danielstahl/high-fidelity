package models.mediaitem

import akka.actor.{Actor, ActorLogging, ActorRef}
import service.Firebase

case class UserMediaItemsActorRequest(uid: String, requester: ActorRef)

case class UserMediaItemsActorResponse(mediaItems: Map[String, MediaItem])

class UserMediaItemActor(firebase: Firebase) extends Actor with ActorLogging {
  def receive = {
    case UserMediaItemsActorRequest(uid, requester) =>
      requester ! UserMediaItemsActorResponse(Database.mediaItems(uid))
  }
}
