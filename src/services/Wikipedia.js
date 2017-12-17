
import * as actions from '../actions/index'
import DOMPurify from 'dompurify'

class Wikipedia {

  static fetchWikipediaUrlContent(wikipediaUrl, dispatch) {
    const urlParts = wikipediaUrl.split('/')
    const wikipediaId = urlParts[urlParts.length - 1]
    fetch("https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&format=json&exintro=&titles=" + wikipediaId)
      .then(result => {
      if (!result.ok) {
        throw result
      }
      return result.json()
    }).then(wikiResult => {
      const key = Object.keys(wikiResult.query.pages)[0]
      const value = wikiResult.query.pages[key]
      const cleanedExtract = DOMPurify.sanitize(value.extract)
      dispatch(actions.setWikipediaUrlContent({
        url: wikipediaUrl,
        extract: cleanedExtract,
        title: value.title
      }))
    }).catch(error => {
      console.error("Error fetch wikipedia", error)
      dispatch(actions.setWikipediaUrlContent({
        url: wikipediaUrl,
        content: undefined
      }))
    })
  }

  static getWikipediaUrlContent(wikipediaUrl, dispatch, wikipediaUrlContents) {
    if(!dispatch) {
      console.warn("No dispatch")
      return undefined
    }
    let wikipediaUrlContent
    if(wikipediaUrlContents) {
      wikipediaUrlContent = wikipediaUrlContents
        .find(tempWikipediaUrlContent => tempWikipediaUrlContent.url === wikipediaUrl)
    }
    if(wikipediaUrlContent) {
      return wikipediaUrlContent
    } else {
      Wikipedia.fetchWikipediaUrlContent(wikipediaUrl, dispatch)
      return undefined
    }
  }
}

export default Wikipedia
