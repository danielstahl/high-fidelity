
var slug = require('slug')
slug.defaults.mode = 'rfc3986'

const mySlugMode = {
    replacement: '-',      // replace spaces with replacement
    symbols: true,         // replace unicode symbols or not
    remove: /[.]/g,        // (optional) regex to remove characters
    lower: true,           // result in lower case
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
}

class Utils {
  static slug(value) {
    return slug(value, mySlugMode)
  }

  static sharedStart(array){
    if(array.length === 0) {
      return ""
    }
    var A = array.concat().sort(),
      a1 = A[0], a2= A[A.length-1], L = a1.length, i = 0
    while(i<L && a1.charAt(i) === a2.charAt(i)) i++
    return a1.substring(0, i)
  }

  static getLastUrl(images) {
    if(images && images.length) {
      return images.slice(-1)[0].url
    } else {
      return ''
    }
  }
}

export default Utils
