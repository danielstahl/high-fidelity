package models.spotify

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

case class ExternalUrls(spotify: String)
case class Followers(href: Option[String], total: Int)
case class Image(url: String, height: Int, width: Int)

case class SpotifyArtist(external_urls: ExternalUrls, followers: Followers, genres: Seq[String], href: String, images: Seq[Image], name: String, popularity: Int, `type`: String, uri: String)
case class SpotifyArtistSearchResult(href: String, items: Seq[SpotifyArtist])

case class SpotifySearchResult(artists: Option[SpotifyArtistSearchResult])

trait SpotifyModelJsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val ExternalUrlsFormat = jsonFormat1(ExternalUrls)
  implicit val followersFormat = jsonFormat2(Followers)
  implicit val imageFormat = jsonFormat3(Image)
  implicit val artistFormat = jsonFormat9(SpotifyArtist)
  implicit val artistSearchResult = jsonFormat2(SpotifyArtistSearchResult)
  implicit val searchResult = jsonFormat1(SpotifySearchResult)
}
