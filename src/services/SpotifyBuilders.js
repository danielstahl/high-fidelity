
import Builders from './Builders'

class SpotifyBuilders {

  static makeSpotifyAlbumArtistInfo(spotifyArtist, mediaItems) {
    const optionalArtistMediaItem =
      mediaItems.find(mediaItem => Builders.hasUri(mediaItem, 'spotifyUri', spotifyArtist.uri))
    if(optionalArtistMediaItem) {
      return {
        spotifyUri: spotifyArtist.uri,
        name: optionalArtistMediaItem.name,
        slugs: optionalArtistMediaItem.slugs,
        artistTypes: optionalArtistMediaItem.types
      }
    } else {
      return {
        spotifyUri: spotifyArtist.uri,
        name: spotifyArtist.name,
        slugs: undefined,
        artistTypes: []
      }
    }
  }
}

export default SpotifyBuilders
