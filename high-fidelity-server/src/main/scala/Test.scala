import net.ruippeixotog.scalascraper.browser.JsoupBrowser

import net.ruippeixotog.scalascraper.dsl.DSL._
import net.ruippeixotog.scalascraper.dsl.DSL.Extract._

object Test extends App {

  val browser = JsoupBrowser()

  val htmlDoc = browser.get("https://www.youtube.com/watch?v=p9Aq2WWds8k")

  val title = htmlDoc >> text("title")

  println(title)
}
