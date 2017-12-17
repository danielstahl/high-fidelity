
class Builders {
  static makeGenre(mediaItem) {
    return {
      slugs: mediaItem.slugs,
      name: mediaItem.name,
      uris: mediaItem.uris
    }
  }

  static makeInstrument(mediaItem) {
    return {
      slugs: mediaItem.slugs,
      name: mediaItem.name,
      uris: mediaItem.uris
    }
  }

  static makeArtist(mediaItem) {
    return {
      slugs: mediaItem.slugs,
      name: mediaItem.name,
      instrument: Builders.getTagHead(mediaItem, 'instrument'),
      genre: Builders.getTagHead(mediaItem, 'genre'),
      uris: mediaItem.uris
    }
  }

  static makeAlbum(mediaItem) {
    return  {
      slugs: mediaItem.slugs,
      name: mediaItem.name,
      artists: mediaItem.tags['artist'],
      composers: mediaItem.tags['composer'],
      uris: mediaItem.uris
    }
  }

  static makeEra(mediaItem) {
    return {
      slugs: mediaItem.slugs,
      name: mediaItem.name,
      genre: Builders.getTagHead(mediaItem, 'genre'),
      uris: mediaItem.uris
    }
  }

  static makeComposer(mediaItem) {
    return {
      slugs: mediaItem.slugs,
      name: mediaItem.name,
      genre: Builders.getTagHead(mediaItem, 'genre'),
      era: Builders.getTagHead(mediaItem, 'era'),
      uris: mediaItem.uris
    }
  }

  static makePiece(pieceMediaItem) {
    return {
      slugs: pieceMediaItem.slugs,
      name: pieceMediaItem.name,
      movements: pieceMediaItem.tags['pieceMovements'],
      genre: Builders.getTagHead(pieceMediaItem, 'genre'),
      era: Builders.getTagHead(pieceMediaItem, 'era'),
      composers: pieceMediaItem.tags['composer'],
      form: pieceMediaItem.tags['form'],
      uris: pieceMediaItem.uris
    }
  }

  static makeRecording(recordingMediaItem) {
    return {
      slugs: recordingMediaItem.slugs,
      name: recordingMediaItem.name,
      genre: Builders.getTagHead(recordingMediaItem, 'genre'),
      era: Builders.getTagHead(recordingMediaItem, 'era'),
      composers: recordingMediaItem.tags['composer'],
      artists: recordingMediaItem.tags['form'],
      uris: recordingMediaItem.uris
    }
  }

  static makeForm(formMediaItem) {
    return {
      slugs: formMediaItem.slugs,
      name: formMediaItem.name,
      genre: Builders.getTagHead(formMediaItem, 'genre'),
      uris: formMediaItem.uris
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
    const genres = mediaItems
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
    const tagValues = mediaItem.tags[tag]
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
    const tagValues = mediaItem.tags[tag]
    if(tagValues) {
      return tagValues[0]
    } else {
      return undefined
    }
  }

  static getUriHead(mediaItem, uriType) {
    if(!mediaItem.uris) {
      return undefined
    }
    const uriValues = mediaItem.uris[uriType]
    if(uriValues) {
      return uriValues[0]
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

  static getGenreSlugs(graphType, graphSlugs, mediaItems) {
    if(graphType === 'genre') {
      return graphSlugs
    } else if(graphType === 'era' || graphType === 'composer') {
      const mediaItem = Builders.findBySlugs(graphSlugs, mediaItems)
      return Builders.getTagHead(mediaItem, 'genre')
    } else {
      return undefined
    }
  }

  static getInstruments(mediaItems, graphType, graphSlugs) {
    const genreSlugs = Builders.getGenreSlugs(graphType, graphSlugs, mediaItems)
    if(genreSlugs) {
      return mediaItems.filter(mediaItem =>
        mediaItem.types.includes('instrument') &&
        Builders.hasTag(mediaItem, 'genre', genreSlugs))
    } else {
      return []
    }
  }

  static getForms(mediaItems, graphType, graphSlugs) {
    const genreSlugs = Builders.getGenreSlugs(graphType, graphSlugs, mediaItems)
    if(genreSlugs) {
      return mediaItems.filter(mediaItem =>
        mediaItem.types.includes('form') &&
        Builders.hasTag(mediaItem, 'genre', genreSlugs))
    } else {
      return []
    }
  }

  static getAlbumGraph(albumMediaItem, mediaItems, uriInfos) {
    let artists
    if(albumMediaItem.tags['artist']) {
      artists = albumMediaItem.tags['artist']
        .map(artistSlug => Builders.findBySlugs(artistSlug, mediaItems))
        .map(artistMediaItem => Builders.makeArtist(artistMediaItem))
    } else {
      artists = []
    }


    let composers
    if(albumMediaItem.tags['composer']) {
      composers = albumMediaItem.tags['composer']
        .map(composerSlug => Builders.findBySlugs(composerSlug, mediaItems))
        .map(composerMediaItem => Builders.makeComposer(composerMediaItem))
    } else {
      composers = []
    }

    const uris = Builders.toUris(albumMediaItem, uriInfos)

    return {
      graphType: 'album',
      album: Builders.makeAlbum(albumMediaItem),
      artists: artists,
      composers: composers,
      uris: uris
    }
  }

  static getArtistGraph(slugs, mediaItems, uriInfos) {
    const artistMediaItem = Builders.findBySlugs(slugs, mediaItems)

    const genreSlug = Builders.getTagHead(artistMediaItem, 'genre')
    const genreMediaItem = Builders.findBySlugs(genreSlug, mediaItems)

    const uris = Builders.toUris(artistMediaItem, uriInfos)

    const instrumentSlugs = artistMediaItem.tags['instrument']
    var instrumentMediaItems
    if(instrumentSlugs) {
      instrumentMediaItems = mediaItems
        .filter(mediaItem =>
          instrumentSlugs.includes(mediaItem.slugs))
    } else {
      instrumentMediaItems = []
    }

    const albumMediaItems = mediaItems
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
    const eraMediaItem = Builders.findBySlugs(slugs, mediaItems)
    const genreSlug = Builders.getTagHead(eraMediaItem, 'genre')
    const genreMediaItem = Builders.findBySlugs(genreSlug, mediaItems)
    const uris = Builders.toUris(eraMediaItem, uriInfos)
    const composerMediaItems = mediaItems
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
    const genreMediaItem = Builders.findBySlugs(slugs, mediaItems)

    const instrumentMediaItems = mediaItems
      .filter(mediaItem =>
        mediaItem.types.includes('instrument') &&
        Builders.hasTag(mediaItem, 'genre', slugs))

    const eras = mediaItems
      .filter(eraMediaItem =>
        eraMediaItem.types.includes('era') &&
        Builders.hasTag(eraMediaItem, 'genre', slugs))
      .map(eraMediaItem => Builders.makeEra(eraMediaItem))

    const artists = mediaItems
      .filter(mediaItem =>
        mediaItem.types.includes('artist') &&
        Builders.hasTag(mediaItem, 'genre', slugs))

    const instruments = instrumentMediaItems.map(instrumentMediaItem => {
        return {
          graphType: 'instrument',
          instrument: Builders.makeInstrument(instrumentMediaItem),
          artists: Builders.makeInstrumentArtists(instrumentMediaItem.slugs, artists),
          eras: eras
        }
    })
    .filter(instrument => instrument.artists && instrument.artists.length > 0)

    const artistsWithoutInstruments = artists
      .filter(artistMediaItem => !artistMediaItem.tags['instrument'])
      .map(artistMediaItem => Builders.makeArtist(artistMediaItem))

    const uris = Builders.toUris(genreMediaItem, uriInfos)

    return {
      graphType: 'genre',
      genre: Builders.makeGenre(genreMediaItem),
      instruments: instruments,
      artists: artistsWithoutInstruments,
      eras: eras,
      uris: uris
    }
  }

  static getPieceGraph(slugs, mediaItems, uriInfos) {
    const pieceMediaItem = Builders.findBySlugs(slugs, mediaItems)
    return Builders.makePieceGraph(pieceMediaItem, mediaItems, uriInfos)
  }

  static makePieceGraph(pieceMediaItem, mediaItems, uriInfos) {
    const uris = Builders.toUris(pieceMediaItem, uriInfos)

    const genreSlug = Builders.getTagHead(pieceMediaItem, 'genre')
    const genreMediaItem = Builders.findBySlugs(genreSlug, mediaItems)
    const eraSlug = Builders.getTagHead(pieceMediaItem, 'era')
    const eraMediaItem = Builders.findBySlugs(eraSlug, mediaItems)
    const composerSlug = Builders.getTagHead(pieceMediaItem, 'composer')
    const composerMediaItem = Builders.findBySlugs(composerSlug, mediaItems)

    const recordings = mediaItems
      .filter(mediaItem =>
        mediaItem.types.includes('recording') &&
        Builders.hasTag(mediaItem, 'piece', pieceMediaItem.slugs))
      .map(recordingMediaItem => Builders.makeRecordingGraph(recordingMediaItem, mediaItems, uriInfos))
    return {
      graphType: 'piece',
      piece: Builders.makePiece(pieceMediaItem),
      composer: Builders.makeComposer(composerMediaItem),
      genre: Builders.makeGenre(genreMediaItem),
      era: Builders.makeEra(eraMediaItem),
      recordings: recordings,
      uris: uris
    }
  }

  static makeRecordingGraph(recordingMediaItem, mediaItems, uriInfos) {
    const uris = Builders.toUris(recordingMediaItem, uriInfos)

    let artists
    if(recordingMediaItem.tags['artist']) {
      artists = recordingMediaItem.tags['artist']
        .map(artistSlug => Builders.findBySlugs(artistSlug, mediaItems))
        .map(artistMediaItem => Builders.makeArtist(artistMediaItem))
    } else {
      artists = []
    }

    return {
      graphType: 'recording',
      recording: Builders.makeRecording(recordingMediaItem),
      artists: artists,
      uris: uris

    }
  }

  static makeFormPieces(formSlugs, pieceMediaItems, mediaItems, uriInfos) {
    return pieceMediaItems
      .filter(pieceMediaItem =>
        Builders.hasTag(pieceMediaItem, 'form', formSlugs))
      .filter(pieceMediaItem =>
        !((formSlugs === 'classical-music:form:chamber-music' ||
           formSlugs === 'classical-music:form:orchestral-music') &&
            pieceMediaItem.tags['form'].length > 1)
      )
      .map(pieceMediaItem => Builders.makePieceGraph(pieceMediaItem, mediaItems, uriInfos))
  }

  static getComposerGraph(slugs, mediaItems, uriInfos) {
    const composerMediaItem = Builders.findBySlugs(slugs, mediaItems)
    const uris = Builders.toUris(composerMediaItem, uriInfos)
    const genreSlug = Builders.getTagHead(composerMediaItem, 'genre')
    const genreMediaItem = Builders.findBySlugs(genreSlug, mediaItems)
    const eraSlug = Builders.getTagHead(composerMediaItem, 'era')
    const eraMediaItem = Builders.findBySlugs(eraSlug, mediaItems)

    const formMediaItems = mediaItems
      .filter(mediaItem =>
        mediaItem.types.includes('form') &&
        Builders.hasTag(mediaItem, 'genre', genreSlug))

    const pieceMediaItems = mediaItems
      .filter(mediaItem =>
          mediaItem.types.includes('piece') &&
          Builders.hasTag(mediaItem, 'composer', slugs))

    const forms = formMediaItems.map(formMediaItem => {
      return {
        graphType: 'form',
        form: Builders.makeForm(formMediaItem),
        pieces: Builders.makeFormPieces(formMediaItem.slugs, pieceMediaItems, mediaItems, uriInfos),
      }
    })
    .filter(form => form.pieces && form.pieces.length > 0)

    const albumMediaItems = mediaItems
      .filter(mediaItem =>
          mediaItem.types.includes('album') &&
          Builders.hasTag(mediaItem, 'composer', slugs))

    return {
      graphType: 'composer',
      composer: Builders.makeComposer(composerMediaItem),
      genre: Builders.makeGenre(genreMediaItem),
      era: Builders.makeEra(eraMediaItem),
      uris: uris,
      albums: albumMediaItems.map(
        albumMediaItem =>
        Builders.getAlbumGraph(albumMediaItem, mediaItems, uriInfos)),
      form: forms
    }
  }

}

export default Builders
