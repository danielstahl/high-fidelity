import java.util.Base64

import akka.actor.{ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout
import models._

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.io.StdIn


/**
  * Main web server
  */


object WebServer extends Directives with UserJsonSupport {

  val clientId = "1b24de0b94324459b855aa136d301949"
  val clientSecret = "010207693b134a4691b6dff1d53061e1"
  val spotifyAccountsAuth = Base64.getEncoder.encodeToString(s"$clientId:$clientSecret".getBytes)

  implicit val system = ActorSystem("high-fidelity-system")
  implicit val materializer = ActorMaterializer()

  implicit val executionContext = system.dispatcher

  val userSupervisorActor = system.actorOf(Props[UserSupervisorActor], "userSupervisorActor")

  implicit val timeout = Timeout(5 seconds) // needed for `?` below

  def main(args: Array[String]) = {

    val route =
      path("spotify-login-callback") {
        get {
          parameters('code) { (code) => {
            val userFuture: Future[User] =
              (userSupervisorActor ? LoginRequest(code)).mapTo[User]

            val redirectHtml =
              userFuture.map(currentUser =>
                HttpEntity(ContentTypes.`text/html(UTF-8)`,
                  "<meta http-equiv=\"refresh\" content=\"0; url=http://localhost:3000/logged-in?username=" + currentUser.privateUser.id + "\" />"))

            complete(redirectHtml)

            }
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
