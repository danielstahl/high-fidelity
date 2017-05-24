package models

import akka.actor.{Actor, ActorLogging}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

import scala.util.{Failure, Success, Try}

case class Tag(slug: String, name: String, category: String)

case class MediaItem(slugs: String, name: String, uris: Map[String, Seq[String]], tags: Map[String, Seq[String]]) {

  def hasTag(category: String, tag: String): Boolean = {
    getTag(category).contains(tag)
  }

  def getTag(category: String): Seq[String] = {
    tags.getOrElse(category, Seq.empty)
  }
}

case class TagTree(typeTree: Seq[String], currentItem: MediaItem, children: Seq[MediaItem])

trait MediaItemJsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val mediaItemFormat = jsonFormat4(MediaItem)
  implicit val tagTreeFormat = jsonFormat3(TagTree)
  implicit val tagFormat = jsonFormat3(Tag)
  implicit val failureResponseFormat =  jsonFormat1(FailureResponse)
}

object Database {

  val typeTrees = Map(
    "composer" -> Seq("genre", "era", "composer", "piece", "recording"),
    "artist" -> Seq("genre", "instrument", "artist", "album")
  )

  val tags = Seq(
    Tag("spotify-uri", "Spotify URI", "uri-type"),
    Tag("composer", "Composer", "type"),
    Tag("piece", "Piece", "type"),
    Tag("artist", "Artist", "artist"),
    Tag("album", "Album", "type"),
    Tag("recording", "Recording", "type"),
    Tag("classical", "Classical", "genre"),
    Tag("classical-era", "Classical Era", "era"),
    Tag("piano", "Piano", "instrument"),
    Tag("genre", "Genre", "type"),
    Tag("era", "Era", "type"),
    Tag("instrument", "Instrument", "type")
  )

  val mediaItems = Seq(
    MediaItem(
      "classical",
      "Classical music",
      Map(),
      Map("type" -> Seq("genre"))),
    MediaItem(
      "classical-era",
      "Classical Era",
      Map(),
      Map("type" -> Seq("era"),
          "genre" -> Seq("classical"))),
    MediaItem(
      "piano",
      "Piano",
      Map(),
      Map("type" -> Seq("instrument"))),
    MediaItem(
      "ludwig-van-beethoven",
      "Ludwig van Beethoven",
      Map("spotify-uri" -> Seq("spotify:artist:2wOqMjp9TyABvtHdOSOTUS")),
      Map(
        "type" -> Seq("composer"),
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"))),

    MediaItem(
      "ludwig-van-beethoven:bagatelles-op-119",
      "Bagatelles Op 119",
      Map(),
      Map(
        "type" -> Seq("piece"),
        "genre" -> Seq("classical"),
        "era" -> Seq("classical"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"))),

    MediaItem(
      "ludwig-van-beethoven:diabelli-variations-op-120",
      "Diabelli Variations Op 120",
      Map(),
      Map(
        "type" -> Seq("piece"),
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"))),

    MediaItem(
      "paul-lewis",
      "Paul Lewis",
      Map("spotify-uri" -> Seq("spotify:artist:4LYCuV8d6rylb6zjv2k03l")),
      Map(
        "type" -> Seq("artist"),
        "genre" -> Seq("classical"),
        "instrument" -> Seq("piano"))),

    MediaItem(
      "igor-levit",
      "Igor Levit",
      Map("spotify-uri" -> Seq("spotify:album:4293SPqEXe9mFXt5Wb1k6U")),
      Map(
        "type" -> Seq("artist"),
        "genre" -> Seq("classical"),
        "instrument" -> Seq("piano"))),

    MediaItem(
      "ludwig-van-beethoven:paul-lewis:diabelli-variations-op-120",
      "Beethoven: Diabelli Variations, Op. 120",
      Map("spotify-uri" -> Seq("spotify:album:0us4zAnvnsqwFpcjsAefAK")),
      Map(
        "type" -> Seq("recording"),
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"),
        "artist" -> Seq("paul-lewis"),
        "piece" -> Seq("ludwig-van-beethoven:diabelli-variations-op-120"))),

    MediaItem(
      "ludwig-van-beethoven:igor-levit:diabelli-variations-op-120",
      "Beethoven: Diabelli Variations, Op. 120",
      Map("spotify-uri" -> Seq("spotify:album:4293SPqEXe9mFXt5Wb1k6U")),
      Map(
        "type" -> Seq("recording"),
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"),
        "artist" -> Seq("igor-levit"),
        "piece" -> Seq("ludwig-van-beethoven:diabelli-variations-op-120"))),

    MediaItem(
      "ludwig-van-beethoven:alfred-brendel:bagatelles-op-119",
      "Bagatelles Op 119",
      Map("spotify-uri" -> Seq(
        "spotify:track:0CXtZJQxyMmBqltrLhWwUs",
        "spotify:track:4izRq5WJZow7KU18I10CSn",
        "spotify:track:4ITBfdOkDIHfAcreXSbeM6",
        "spotify:track:2VlvDwdXIHbrPjx8fPwDQd",
        "spotify:track:6Zg2n5TOj3PuxlK8v25VJy",
        "spotify:track:55K8fWuVm7LMBQHbXmuaTl",
        "spotify:track:7h32zMgeqkllaQuHoXHaWP",
        "spotify:track:6E6pohlDl3nxouka54ibWG",
        "spotify:track:1l1qRR6Sq9MW20g2C8OSDN",
        "spotify:track:0xakt5qbgqy7bny5atiQNV",
        "spotify:track:7HgniLM418Ao2e3pmw2Wa1")),
      Map(
        "type" -> Seq("recording"),
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"),
        "artist" -> Seq("alfred-brendel"),
        "piece" -> Seq("ludwig-van-beethoven:bagatelles-op-119"))),

    MediaItem(
      "alfred-brendel",
      "Alfred Brendel",
      Map("spotify-uri" -> Seq("spotify:artist:5vBh0nve44zwwVF5KWtCwA")),
      Map(
        "type" -> Seq("artist"),
        "genre" -> Seq("classical"),
        "instrument" -> Seq("piano"))),

    MediaItem(
      "alfred-brendel:ludwig-van-beethoven:beethoven-bagatelles",
      "Beethoven Bagatelles",
      Map("spotify-uri" -> Seq("spotify:album:3SFC4Aeqmqm4R7bQeujK2o")),
      Map(
        "type" -> Seq("album"),
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "artist" -> Seq("alfred-brendel"),
        "composer" -> Seq("ludwig-van-beethoven"))))
}

case class TagRequest(category: String)

case class TagResponse(tags: Seq[Tag])

class TagActor extends Actor with ActorLogging {

  def receive = {
    case TagRequest(category) =>
      sender() ! TagResponse(Database.tags.filter(tag => tag.category == category))
  }

}

case class TagTreeRequest(tags: Seq[String], currentType: String, currentItem: String)

case class FailureResponse(cause: String)

class TagTreeActor extends Actor with ActorLogging {

  def receive = {
    case TagTreeRequest(tags, currentType, currentItem) => {

      val currentMediaItemTry =
        Database.mediaItems.find(item => item.slugs == currentItem) match {
          case Some(mediaItem) => Success(mediaItem)
          case None => Failure(new IllegalArgumentException("No current mediaItem found"))
        }

      val currentIndexTry = tags.indexOf(currentType) match {
          case -1 => Failure(new IllegalArgumentException(currentType + " not found in tags"))
          case theIndex => Success(theIndex)
        }

      val childTypeTry = currentIndexTry.map(
        curr =>
          if(tags.size > curr + 1) Some(tags(curr + 1))
          else None)

      val childrenTry = for {
        childOption <- childTypeTry
        item <- currentMediaItemTry
      } yield
        childOption match {
          case Some(child) =>
            Database.mediaItems
              .filter(mediaItem =>
                mediaItem.getTag(currentType).contains(item.slugs) &&
                  mediaItem.getTag("type").contains(child))
          case None => Seq.empty
        }

      val tagTreeTry = for {
        currentMediaItem <- currentMediaItemTry
        children <- childrenTry
      } yield TagTree(tags, currentMediaItem, children)

      tagTreeTry match {
        case Success(tagTree) => sender() ! tagTree
        case Failure(cause) => sender() ! FailureResponse(cause.toString)
      }
    }

  }
}

