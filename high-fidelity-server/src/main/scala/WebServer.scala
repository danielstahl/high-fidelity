import java.util.Base64

import akka.actor.{ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshalling.Marshal
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.io.StdIn
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._
import models.{SpotifyLoginRequest, SpotifyUserJsonSupport, SpotifyUserSupervisorActor}
import models.mediaitem._
import models.user._
import service.Firebase


/**
  * Main web server
  */


object WebServer extends Directives with SpotifyUserJsonSupport with MediaItemJsonSupport with MediaItemTreeJsonSupport with UserJsonSupport {

  implicit val system = ActorSystem("high-fidelity-system")
  implicit val materializer = ActorMaterializer()

  implicit val executionContext = system.dispatcher

  val spotifyUserSupervisorActor = system.actorOf(Props[SpotifyUserSupervisorActor], "spotifyUserSupervisorActor")

  val mediaItemQueryTagActor = system.actorOf(Props[MediaItemQueryTagActor], "mediaItemQueryTagActor")

  val mediItemTreeActor = system.actorOf(Props[MediaItemTreeActor], "mediItemTreeActor")

  implicit val timeout = Timeout(5 seconds) // needed for `?` below

  val firebase = Firebase(system.settings.config)
  firebase.initializeFirebase()

  val userSupervisorActor =
    system.actorOf(Props[UserSupervisorActor](new UserSupervisorActor(firebase)), "userSupervisorActor")

  def main(args: Array[String]) = {

    val route =
      path("spotify-login-callback") {
        get {
          parameters('code) { (code) => {
            val userTokenFuture: Future[String] =
              (spotifyUserSupervisorActor ? SpotifyLoginRequest(code)).mapTo[String]

            val redirectHtml =
              userTokenFuture.map(token =>
                HttpEntity(ContentTypes.`text/html(UTF-8)`,
                  "<meta http-equiv=\"refresh\" content=\"0; url=http://localhost:3000/logged-in/" + token + "\" />"))

            complete(redirectHtml)

            }
          }
        }
      } ~ path("genre-tree" / Segment / Segment / Segment / Segment) { (theToken, treeType, currentType, current) =>
        get {
          cors() {
            val userMediaItemsFuture = (userSupervisorActor ? UserMediaItemsRequest(theToken)).mapTo[UserMediaItemsActorResponse]
            val mediaItemTreeFuture = userMediaItemsFuture.map(
              userMediaItems =>
                MediaItemActor.mediaItemTree(userMediaItems.mediaItems, current, currentType, treeType)
            )

            val response = mediaItemTreeFuture.flatMap {
              case mediItemTree: MediaItemTree =>
                Marshal(StatusCodes.OK -> mediItemTree).to[HttpResponse]
              //case error: FailureResponse =>
              //  Marshal(StatusCodes.BadRequest -> error).to[HttpResponse]
            }
            complete(response)
          }
        }
      } ~ path("media-items" / Segment / Segment ) { (theToken, theType) =>
        get {
          cors() {
            val userMediaItemsFuture = (userSupervisorActor ? UserMediaItemsRequest(theToken)).mapTo[UserMediaItemsActorResponse]
            val mediaItemsResponse = userMediaItemsFuture.map(
              userMediaItems =>
                MediItemQueryTagResponse(
                  userMediaItems.mediaItems.values.filter(mediaItem => mediaItem.types.contains(theType)).toSeq)
            )

            complete(mediaItemsResponse)
          }
        }
      } ~ path("firebase-token-login" / Segment ) { (theToken) =>
        get {
          cors() {
            val user = (userSupervisorActor ? LoginRequest(theToken)).mapTo[User]

            complete(user)
          }
        }
      }
    val bindingFuture = Http().bindAndHandle(route, "localhost", 8080)

    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine()

    bindingFuture
      .flatMap(binding => binding.unbind())
      .onComplete(_ => system.terminate())
  }
}
