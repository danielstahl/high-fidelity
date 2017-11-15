
class Builders {
    static makeGenre(mediaItem) {
      return {
        slugs: mediaItem.slugs,
        name: mediaItem.name
      }
    }

    static makeInstrument(mediaItem) {
      return {
        slugs: mediaItem.slugs,
        name: mediaItem.name
      }
    }

    static makeArtist(mediaItem) {
      return {
        slugs: mediaItem.slugs,
        name: mediaItem.name,
        instrument: Builders.getTagHead(mediaItem, 'instrument'),
        genre: Builders.getTagHead(mediaItem, 'genre')
      }
    }

    static makeEra(mediaItem) {
      return {
        slugs: mediaItem.slugs,
        name: mediaItem.name,
        genre: Builders.getTagHead(mediaItem, 'genre')
      }
    }

    static toUris(mediaItem, uriInfos) {
        let theResult = []
        if(!mediaItem.uris) {
          return theResult
        }
        Object.entries(mediaItem.uris).forEach(([uriType, uris]) => {
          uris.forEach(uri => {
            let uriInfo = uriInfos.find(uriInfo => uriInfo.uri === uri)
            if(!uriInfo) {
              uriInfo = {
                uriType: uriType,
                uri: uri,
                url: uri,
                name: uri
              }
            }
            theResult.push(uriInfo)
          })

        })
        return theResult
    }

    static getGenresGraph(mediaItems) {
      var genres = mediaItems
        .filter(mediaItem => mediaItem.types.includes('genre'))
        .map(mediaItem => {
          return Builders.makeGenre(mediaItem)
        })
        return {
          graphType: 'root',
          genres: genres
        }
    }

    static hasTag(mediaItem, tag, value) {
      var tagValues = mediaItem.tags[tag]
      if(tagValues) {
        return tagValues.includes(value)
      } else {
        return false
      }
    }

    static getTagHead(mediaItem, tag) {
        var tagValues = mediaItem.tags[tag]
        if(tagValues) {
          return tagValues[0]
        } else {
          return undefined
        }
    }

    static makeInstrumentArtists(instrumentSlugs, artistMediaItems) {
      return artistMediaItems
        .filter(artistMediaItem =>
          Builders.hasTag(artistMediaItem, "instrument", instrumentSlugs))
        .map(artistMediaItem => Builders.makeArtist(artistMediaItem))
    }

    static getGenreGraph(slugs, mediaItems, uriInfos) {
      var genreMediaItem = mediaItems.find(mediaItem => mediaItem.slugs === slugs)

      var instrumentMediaItems = mediaItems
        .filter(mediaItem =>
          mediaItem.types.includes('instrument') &&
          this.hasTag(mediaItem, 'genre', slugs))

      var eras = mediaItems
        .filter(eraMediaItem =>
          eraMediaItem.types.includes('era') &&
          this.hasTag(eraMediaItem, 'genre', slugs))
        .map(eraMediaItem => Builders.makeEra(eraMediaItem))

      var artists = mediaItems
        .filter(mediaItem =>
          mediaItem.types.includes('artist') &&
          this.hasTag(mediaItem, 'genre', slugs))

      var instruments = instrumentMediaItems.map(instrumentMediaItem => {
          return {
            graphType: 'instrument',
            instrument: Builders.makeInstrument(instrumentMediaItem),
            artists: Builders.makeInstrumentArtists(instrumentMediaItem.slugs, artists),
            eras: eras
          }
      })

      var artistsWithoutInstruments = artists
        .filter(artistMediaItem => !artistMediaItem.tags['instrument'])
        .map(artistMediaItem => Builders.makeArtist(artistMediaItem))

      var uris = Builders.toUris(genreMediaItem, uriInfos)

      return {
        graphType: 'genre',
        genre: Builders.makeGenre(genreMediaItem),
        instruments: instruments,
        artists: artistsWithoutInstruments,
        eras: eras,
        uris: uris
      }

    }
}

export default Builders
