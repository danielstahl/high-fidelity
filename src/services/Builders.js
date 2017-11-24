
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

    static makeComposer(mediaItem) {
        return {
          slugs: mediaItem.slugs,
          name: mediaItem.name,
          era: Builders.getTagHead(mediaItem, 'era')
        }
    }

    static makeAlbum(mediaItem) {
        return {
          slugs: mediaItem.slugs,
          name: mediaItem.name,
          artists: mediaItem.tags['artist'],
          composers: mediaItem.tags['composer']
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

    static hasUri(mediaItem, uriType, uri) {
      let uris
      if(mediaItem.uris) {
          uris = mediaItem.uris[uriType]
      }

      if(uris) {
        return uris.includes(uri)
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

    static findBySlugs(slugs, mediaItems) {
        return mediaItems.find(mediaItem => mediaItem.slugs === slugs)
    }

    static getAlbumGraph(albumMediaItem, mediaItems, uriInfos) {
      var artists = albumMediaItem.tags['artist']
        .map(artistSlug => Builders.findBySlugs(artistSlug, mediaItems))
        .map(artistMediaItem => Builders.makeArtist(artistMediaItem))

      let composers
      if(albumMediaItem.tags['composer']) {
        composers = albumMediaItem.tags['composer']
          .map(composerSlug => Builders.findBySlugs(composerSlug, mediaItems))
          .map(composerMediaItem => Builders.makeComposer(composerMediaItem))
      } else {
        composers = []
      }

      var uris = Builders.toUris(albumMediaItem, uriInfos)

      return {
        graphType: 'album',
        album: Builders.makeAlbum(albumMediaItem),
        artists: artists,
        composers: composers,
        uris: uris
      }
    }

    static getArtistGraph(slugs, mediaItems, uriInfos) {
      var artistMediaItem = Builders.findBySlugs(slugs, mediaItems)

      var genreSlug = Builders.getTagHead(artistMediaItem, 'genre')
      var genreMediaItem = Builders.findBySlugs(genreSlug, mediaItems)

      var uris = Builders.toUris(artistMediaItem, uriInfos)

      var instrumentSlugs = artistMediaItem.tags['instrument']
      var instrumentMediaItems
      if(instrumentSlugs) {
        instrumentMediaItems = mediaItems
          .filter(mediaItem =>
            instrumentSlugs.includes(mediaItem.slugs))
      } else {
        instrumentMediaItems = []
      }

      var albumMediaItems = mediaItems
        .filter(mediaItem =>
            mediaItem.types.includes('album') &&
            Builders.hasTag(mediaItem, 'artist', slugs))

      return {
        graphType: 'artist',
        artist: Builders.makeArtist(artistMediaItem),
        instruments: instrumentMediaItems
          .map(instrumentMediaItem => Builders.makeInstrument(instrumentMediaItem)),
        genre: Builders.makeGenre(genreMediaItem),
        uris: uris,
        albums: albumMediaItems.map(
          albumMediaItem =>
          Builders.getAlbumGraph(albumMediaItem, mediaItems, uriInfos))
      }
    }

    static getEraGraph(slugs, mediaItems, uriInfos) {
      var eraMediaItem = Builders.findBySlugs(slugs, mediaItems)
      var genreSlug = Builders.getTagHead(eraMediaItem, 'genre')
      var genreMediaItem = Builders.findBySlugs(genreSlug, mediaItems)
      var uris = Builders.toUris(eraMediaItem, uriInfos)
      var composerMediaItems = mediaItems
        .filter(mediaItem =>
            mediaItem.types.includes('composer') &&
            Builders.hasTag(mediaItem, 'genre', genreSlug) &&
            Builders.hasTag(mediaItem, 'era', slugs))
      return {
        graphType: 'era',
        era: Builders.makeEra(eraMediaItem),
        genre: Builders.makeGenre(genreMediaItem),
        uris: uris,
        composers: composerMediaItems.map(
          composerMediaItem => Builders.makeComposer(composerMediaItem))
      }
    }

    static getGenreGraph(slugs, mediaItems, uriInfos) {
      var genreMediaItem = Builders.findBySlugs(slugs, mediaItems)

      var instrumentMediaItems = mediaItems
        .filter(mediaItem =>
          mediaItem.types.includes('instrument') &&
          Builders.hasTag(mediaItem, 'genre', slugs))

      var eras = mediaItems
        .filter(eraMediaItem =>
          eraMediaItem.types.includes('era') &&
          Builders.hasTag(eraMediaItem, 'genre', slugs))
        .map(eraMediaItem => Builders.makeEra(eraMediaItem))

      var artists = mediaItems
        .filter(mediaItem =>
          mediaItem.types.includes('artist') &&
          Builders.hasTag(mediaItem, 'genre', slugs))

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
