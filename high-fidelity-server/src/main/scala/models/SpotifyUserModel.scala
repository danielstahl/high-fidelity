package models

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

case class AccessToken(access_token: String, token_type: String, scope: Option[String], expires_in: Int, refresh_token: String)

case class Followers(href: Option[String], total: Int)

case class Image(url: String, height: Option[Int], width: Option[Int])

case class PrivateUser(birthdate: Option[String],
                       country: Option[String],
                       display_name: String,
                       email: Option[String],
                       external_urls: Map[String, String],
                       followers: Followers,
                       href: String,
                       id: String,
                       images: Array[Image],
                       product: Option[String],
                       `type`: String,
                       uri: String)

case class SpotifyUser(accessToken: AccessToken, privateUser: PrivateUser)



trait SpotifyUserJsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val followersFormat = jsonFormat2(Followers)
  implicit val imageFormat = jsonFormat3(Image)
  implicit val accountFormat = jsonFormat5(AccessToken)
  implicit val privateUserFormat = jsonFormat12(PrivateUser)
}
