package models.mediaitem

import akka.actor.{Actor, ActorLogging}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

case class MediaItem(uid: String, slugs: String, name: String, types: Seq[String], uris: Map[String, Seq[String]], tags: Map[String, Seq[String]]) {

  def hasTag(category: String, tag: String): Boolean = {
    getTag(category).contains(tag)
  }

  def getTag(category: String): Seq[String] = {
    tags.getOrElse(category, Seq.empty)
  }
}

case class TypeDescription(slug: String, name: String, metaType: String)

case class TagTree(typeTree: Seq[String], currentItem: MediaItem, children: Seq[MediaItem], parent: Option[MediaItem])

trait MediaItemJsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val mediaItemFormat = jsonFormat6(MediaItem)
  implicit val tagTreeFormat = jsonFormat4(TagTree)
  implicit val failureResponseFormat =  jsonFormat1(FailureResponse)
  implicit val mediItemQueryTagResponseFormat = jsonFormat1(MediItemQueryTagResponse)
}

object Database {

  val typeDescriptions = Seq(
    TypeDescription("spotify-uri", "Spotify URI", "uri-type"),
    TypeDescription("composer", "Composer", "type"),
    TypeDescription("artist", "Artist", "type"),
    TypeDescription("piece", "Piece", "type"),
    TypeDescription("album", "Album", "type"),
    TypeDescription("recording", "Recording", "type"),
    TypeDescription("genre", "Genre", "type"),
    TypeDescription("era", "Era", "type"),
    TypeDescription("instrument", "Instrument", "type")
  ).map(desc => desc.slug -> desc).toMap

  val originalMediaItems = Seq(

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "classical",
      name = "Classical music",
      types = Seq("genre"),
      uris = Map(),
      tags = Map()),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "jazz",
      name = "Jazz music",
      types = Seq("genre"),
      uris = Map(),
      tags = Map()),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "ambient",
      name = "Ambient music",
      types = Seq("genre"),
      Map(),
      Map()),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "electronica",
      name = "Electronica music",
      types = Seq("genre"),
      uris = Map(),
      tags = Map()),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "classical-era",
      name = "Classical Era",
      types = Seq("era"),
      uris = Map(),
      tags = Map("genre" -> Seq("classical"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "piano",
      name = "Piano",
      types = Seq("instrument"),
      uris = Map(),
      tags = Map("genre" -> Seq("classical"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "ludwig-van-beethoven",
      name = "Ludwig van Beethoven",
      types = Seq("composer"),
      uris = Map("spotify-uri" -> Seq("spotify:artist:2wOqMjp9TyABvtHdOSOTUS")),
      tags = Map(
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "ludwig-van-beethoven:bagatelles-op-119",
      name = "Bagatelles Op 119",
      types = Seq("piece"),
      uris = Map(),
      tags = Map(
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "ludwig-van-beethoven:diabelli-variations-op-120",
      name = "Diabelli Variations Op 120",
      types = Seq("piece"),
      uris = Map(),
      tags = Map(
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "paul-lewis",
      name = "Paul Lewis",
      types = Seq("artist"),
      uris = Map("spotify-uri" -> Seq("spotify:artist:4LYCuV8d6rylb6zjv2k03l")),
      tags = Map(
        "genre" -> Seq("classical"),
        "instrument" -> Seq("piano"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "igor-levit",
      name = "Igor Levit",
      types = Seq("artist"),
      uris = Map("spotify-uri" -> Seq("spotify:album:4293SPqEXe9mFXt5Wb1k6U")),
      tags = Map(
        "type" -> Seq("artist"),
        "genre" -> Seq("classical"),
        "instrument" -> Seq("piano"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "ludwig-van-beethoven:paul-lewis:diabelli-variations-op-120",
      name = "Beethoven: Diabelli Variations, Op. 120",
      types = Seq("recording"),
      uris = Map("spotify-uri" -> Seq("spotify:album:0us4zAnvnsqwFpcjsAefAK")),
      tags = Map(
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"),
        "artist" -> Seq("paul-lewis"),
        "piece" -> Seq("ludwig-van-beethoven:diabelli-variations-op-120"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "ludwig-van-beethoven:igor-levit:diabelli-variations-op-120",
      name = "Beethoven: Diabelli Variations, Op. 120",
      types = Seq("recording"),
      uris = Map("spotify-uri" -> Seq("spotify:album:4293SPqEXe9mFXt5Wb1k6U")),
      tags = Map(
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"),
        "artist" -> Seq("igor-levit"),
        "piece" -> Seq("ludwig-van-beethoven:diabelli-variations-op-120"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "ludwig-van-beethoven:alfred-brendel:bagatelles-op-119",
      name = "Bagatelles Op 119",
      types = Seq("recording"),
      uris = Map("spotify-uri" -> Seq(
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
      tags = Map(
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "composer" -> Seq("ludwig-van-beethoven"),
        "artist" -> Seq("alfred-brendel"),
        "piece" -> Seq("ludwig-van-beethoven:bagatelles-op-119"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "alfred-brendel",
      name = "Alfred Brendel",
      types = Seq("artist"),
      uris = Map("spotify-uri" -> Seq("spotify:artist:5vBh0nve44zwwVF5KWtCwA")),
      tags = Map(
        "genre" -> Seq("classical"),
        "instrument" -> Seq("piano"))),

    MediaItem(
      uid = "ZlnnPfqyyYZqDxGDAKTPV5yRuBF3",
      slugs = "alfred-brendel:ludwig-van-beethoven:beethoven-bagatelles",
      name = "Beethoven Bagatelles",
      types = Seq("album"),
      uris = Map("spotify-uri" -> Seq("spotify:album:3SFC4Aeqmqm4R7bQeujK2o")),
      tags = Map(
        "genre" -> Seq("classical"),
        "era" -> Seq("classical-era"),
        "instrument" -> Seq("piano"),
        "artist" -> Seq("alfred-brendel"),
        "composer" -> Seq("ludwig-van-beethoven")))
  )

  val mediaItems = originalMediaItems.groupBy(mediaItem => mediaItem.uid)
    .mapValues(mediaItems => mediaItems.map(mediaItem => (mediaItem.slugs, mediaItem)).toMap)
}


case class MediaItemQueryTagRequest(uid: String, theType: String)

case class MediItemQueryTagResponse(mediaItems: Seq[MediaItem])

class MediaItemQueryTagActor extends Actor with ActorLogging {
  def receive = {
    case MediaItemQueryTagRequest(uid, theType) =>
      sender() ! MediItemQueryTagResponse(
        Database.mediaItems(uid).values.filter(mediaItem => mediaItem.types.contains(theType)).toSeq)
  }
}

case class FailureResponse(cause: String)

