
import akka.actor.{ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshalling.Marshal
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.{Directives, ExceptionHandler, RejectionHandler, Route}
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.io.StdIn
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import models.{SpotifyLoginRequest, SpotifyUserJsonSupport, SpotifyUserSupervisorActor}
import models.mediaitem._
import models.user._
import service.Firebase


/**
  * Main web server
  */
object WebServer extends Directives
  with SpotifyUserJsonSupport
  with MediaItemJsonSupport
  with MediaItemTreeJsonSupport
  with UserJsonSupport
  with UserMediaItemJsonSupport {

  implicit val system = ActorSystem("high-fidelity-system")
  implicit val materializer = ActorMaterializer()

  implicit val executionContext = system.dispatcher

  val spotifyUserSupervisorActor = system.actorOf(Props[SpotifyUserSupervisorActor], "spotifyUserSupervisorActor")

  val mediaItemQueryTagActor = system.actorOf(Props[MediaItemQueryTagActor], "mediaItemQueryTagActor")

  implicit val timeout = Timeout(5 seconds) // needed for `?` below

  val firebase = Firebase(system.settings.config)
  firebase.initializeFirebase()

  val userSupervisorActor =
    system.actorOf(Props[UserSupervisorActor](new UserSupervisorActor(firebase)), "userSupervisorActor")

  val rejectionHandler = corsRejectionHandler withFallback RejectionHandler.default

  val exceptionHandler = ExceptionHandler {
    case e: NoSuchElementException => complete(StatusCodes.NotFound -> e.getMessage)
    case e: Throwable =>  complete(StatusCodes.InternalServerError -> e.getMessage)
  }

  val handleErrors = handleRejections(rejectionHandler) & handleExceptions(exceptionHandler)

  val corsSettings = CorsSettings.defaultSettings

  def main(args: Array[String]) = {

    val route: Route =
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
          val userMediaItemsFuture = (userSupervisorActor ? UserMediaItemsRequest(theToken)).mapTo[UserMediaItemsActorResponse]
          val mediaItemTreeFuture = userMediaItemsFuture.map(
            userMediaItems =>
              MediaItemTreeService.mediaItemTree(userMediaItems.mediaItems, current, currentType, treeType)
          )

          val response = mediaItemTreeFuture.flatMap {
            case mediItemTree: MediaItemTree =>
              Marshal(StatusCodes.OK -> mediItemTree).to[HttpResponse]
            //case error: FailureResponse =>
            //  Marshal(StatusCodes.BadRequest -> error).to[HttpResponse]
          }
          complete(response)
        }
      } ~ path("media-items" / Segment / Segment ) { (theToken, theType) =>
        get {
          val userMediaItemsFuture = (userSupervisorActor ? UserMediaItemsRequest(theToken)).mapTo[UserMediaItemsActorResponse]
          val mediaItemsResponse = userMediaItemsFuture.map(
            userMediaItems =>
              MediItemQueryTagResponse(
                userMediaItems.mediaItems.values.filter(mediaItem => mediaItem.types.contains(theType)).toSeq)
          )

          complete(mediaItemsResponse)
        }
      } ~ path("firebase-token-login" / Segment ) { (theToken) =>
        get {
          val user = (userSupervisorActor ? LoginRequest(theToken)).mapTo[User]

          complete(user)
        }
      } ~ path("media-items" / Segment ) { theToken =>
        post {
          entity(as[MediaItem]) {
            mediaItem =>
              val mediaItemCreateResult = userSupervisorActor ? UpdateMediaItem(theToken, mediaItem, ADD, null)
              val response = mediaItemCreateResult.flatMap {
                case mediaItemUpdateSuccess: MediaItemUpdateSuccess =>
                  Marshal(StatusCodes.OK -> mediaItemUpdateSuccess).to[HttpResponse]
                case mediaItemUpdateError: MediaItemUpdateError =>
                  Marshal(StatusCodes.InternalServerError -> mediaItemUpdateError).to[HttpResponse]
              }
              complete(response)
          }
        }

      } ~ path("media-items" / Segment / Segment) { (theToken, slugs) =>
        put {
          entity(as[MediaItem]) {
            mediaItem =>
              val mediaItemCreateResult = userSupervisorActor ? UpdateMediaItem(theToken, mediaItem, CHANGE, null)
              val response = mediaItemCreateResult.flatMap {
                case mediaItemUpdateSuccess: MediaItemUpdateSuccess =>
                  Marshal(StatusCodes.OK -> mediaItemUpdateSuccess).to[HttpResponse]
                case mediaItemUpdateError: MediaItemUpdateError =>
                  Marshal(StatusCodes.InternalServerError -> mediaItemUpdateError).to[HttpResponse]
              }
              complete(response)
          }
        }

      } ~ path("media-items" / Segment / Segment ) { (theToken, slugs) =>
        delete {
          val mediaItemCreateResult = userSupervisorActor ? RemoveMediaItem(theToken, slugs, null)
          val response = mediaItemCreateResult.flatMap {
            case mediaItemRemoveSuccess: MediaItemRemoveSuccess =>
              Marshal(StatusCodes.OK -> mediaItemRemoveSuccess).to[HttpResponse]
            case mediaItemRemoveError: MediaItemUpdateError =>
              Marshal(StatusCodes.InternalServerError -> mediaItemRemoveError).to[HttpResponse]
          }
          complete(response)
        }

      }

    // POST create
    // media-items/<user-token>
    // POST body
    // http://doc.akka.io/docs/akka-http/current/scala/http/common/json-support.html
    // PUT update
    // media-items/<user-token>/<slugs>
    // PUT body
    // GET get
    // media-items/<user-token>/<slugs>
    // We should have a separate object for the official media-items where we don't expose
    // the userid


    val fullRoute = handleErrors {
      cors(corsSettings) {
        route
      }
    }

    val bindingFuture = Http().bindAndHandle(fullRoute, "localhost", 8080)

    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine()

    bindingFuture
      .flatMap(binding => binding.unbind())
      .onComplete(_ => system.terminate())
  }
}
