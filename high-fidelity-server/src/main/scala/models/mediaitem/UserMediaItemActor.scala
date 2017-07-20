package models.mediaitem

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import com.google.firebase.database._
import models.user.User
import service.Firebase
import spray.json.DefaultJsonProtocol

import scala.collection.JavaConverters._

case class UserMediaItemsActorRequest(uid: String, requestor: ActorRef)

case class UserMediaItemsActorResponse(mediaItems: Map[String, MediaItem])

sealed trait DatabaseOperation
case object CHANGE extends DatabaseOperation
case object ADD extends DatabaseOperation
case object REMOVE extends DatabaseOperation

case class UpdateMediaItem(token: String, mediaItem: MediaItem, operation: DatabaseOperation, requestor: ActorRef)
case class RemoveMediaItem(token: String, slugs: String, requestor: ActorRef)
case class MediaItemEvent(mediaItem: MediaItem, operation: DatabaseOperation)
case class MediaItemUpdateSuccess(slugs: String, operation: String)
case class MediaItemUpdateError(slugs: String, operation: String, cause: String)
case class MediaItemRemoveSuccess(slugs: String)
case class MediaItemRemoveError(slugs: String, cause: String)

trait UserMediaItemJsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val mediaItemUpdateSuccessFormat = jsonFormat2(MediaItemUpdateSuccess)
  implicit val mediaItemUpdateErrorFormat = jsonFormat3(MediaItemUpdateError)
  implicit val mediaItemRemoveSuccessFormat = jsonFormat1(MediaItemRemoveSuccess)
  implicit val mediaItemRemoveErrorFormat = jsonFormat2(MediaItemRemoveError)
}


class UserMediaItemActor(uid: String, firebase: Firebase) extends Actor with ActorLogging {

  var userMediaItems: Map[String, MediaItem] = Map()

  var databaseReference: DatabaseReference = null

  val mediaItemsEventListener = new ChildEventListener {

    private def getMediaItem(snapshot: DataSnapshot): Option[MediaItem] = {
      Option(snapshot.getValue(classOf[MediaItemBean]))
        .map(record => record.toCase())
    }

    override def onChildAdded(snapshot: DataSnapshot, previousChildName: String) = {
      println(s"child added $snapshot")
      getMediaItem(snapshot)
          .foreach(record =>
            self ! MediaItemEvent(record, ADD))
    }

    override def onChildChanged(snapshot: DataSnapshot, previousChildName: String) = {
      println(s"child changed $snapshot")
      getMediaItem(snapshot)
        .foreach(record =>
          self ! MediaItemEvent(record, CHANGE))
    }

    override def onChildMoved(snapshot: DataSnapshot, previousChildName: String) = {}

    override def onChildRemoved(snapshot: DataSnapshot) = {
      println(s"child removed $snapshot")
      getMediaItem(snapshot)
        .foreach(record =>
          self ! MediaItemEvent(record, REMOVE))
    }

    override def onCancelled(error: DatabaseError) = {
      log.error(error.getMessage)
    }
  }

  override def preStart() = {
    databaseReference = firebase.getDatebaseReference(s"media-items/$uid")
    databaseReference.addChildEventListener(mediaItemsEventListener)
  }

  override def postStop() = {
    Option(databaseReference)
      .foreach(ref => ref.removeEventListener(mediaItemsEventListener))
  }

  def addMediaItem(mediaItem: MediaItem, requestor: ActorRef) = {
    databaseReference.child(mediaItem.slugs).setValue(mediaItem.toBean(),
      (error: DatabaseError, ref: DatabaseReference) => {
        Option(error) match {
          case Some(databaseError) => requestor ! MediaItemUpdateError(mediaItem.slugs, "ADD", databaseError.getMessage)
          case None => requestor ! MediaItemUpdateSuccess(mediaItem.slugs, "ADD")
        }
      })
  }

  def updatedMediaItem(mediaItem: MediaItem, requestor: ActorRef) = {
    val updates: Map[String, AnyRef] = Map(mediaItem.slugs -> mediaItem.toBean())
    databaseReference.updateChildren(updates.asJava,
      (error: DatabaseError, ref: DatabaseReference) => {
        Option(error) match {
          case Some(databaseError) => requestor ! MediaItemUpdateError(mediaItem.slugs, "CHANGE", databaseError.getMessage)
          case None => requestor ! MediaItemUpdateSuccess(mediaItem.slugs, "CHANGE")
        }
      })
  }

  def removeMediaItem(slugs: String, requestor: ActorRef) = {
    databaseReference.child(slugs).setValue(null,
      (error: DatabaseError, ref: DatabaseReference) => {
        Option(error) match {
          case Some(databaseError) => requestor ! MediaItemRemoveError(slugs, databaseError.getMessage)
          case None => requestor ! MediaItemRemoveSuccess(slugs)
        }
      })
  }

  def withUid(mediaItem: MediaItem): MediaItem = {
    MediaItem(uid = uid,
      slugs = mediaItem.slugs,
      name = mediaItem.name,
      types = mediaItem.types,
      uris = mediaItem.uris,
      tags = mediaItem.tags)
  }

  def receive = {
    case UserMediaItemsActorRequest(uid, requestor) =>
      requestor ! UserMediaItemsActorResponse(userMediaItems)
    case MediaItemEvent(mediaItem, ADD) =>
      userMediaItems += (mediaItem.slugs -> mediaItem)
    case MediaItemEvent(mediaItem, CHANGE) =>
      userMediaItems += (mediaItem.slugs -> mediaItem)
    case MediaItemEvent(mediaItem, REMOVE) =>
      userMediaItems -= mediaItem.slugs

    case UpdateMediaItem(_, mediaItem, ADD, requestor) =>
      addMediaItem(withUid(mediaItem), requestor)
    case UpdateMediaItem(_, mediaItem, CHANGE, requestor) =>
      updatedMediaItem(withUid(mediaItem), requestor)
    case RemoveMediaItem(_, slugs, requestor) =>
      removeMediaItem(slugs, requestor)

  }
}
