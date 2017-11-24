
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
}

export default Utils
