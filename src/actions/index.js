
export const addMediaItem = (mediaItem) => ({
  type: 'ADD_MEDIA_ITEM',
  mediaItem: mediaItem
})

export const removeMediaItem = (slugs) => ({
  type: 'REMOVE_MEDIA_ITEM',
  slugs: slugs
})

export const updateMediaItem = mediaItem => ({
  type: 'UPDATE_MEDIA_ITEM',
  mediaItem: mediaItem
})

export const setUriInfo = uriInfo => ({
  type: 'SET_URI_INFO',
  uriInfo: uriInfo
})

export const setUser = user => ({
  type: 'SET_USER',
  user: user
})

export const unsetUser = () => ({
  type: 'UNSET_USER'
})

export const setSpotifyUser = spotifyUser => ({
  type: 'SET_SPOTIFY_USER',
  user: spotifyUser
})

export const unsetSpotifyUser = () => ({
  type: 'UNSET_SPOTIFY_USER'
})

export const setMediaItemGraph = (slugs, graphType) => ({
  type: 'SET_MEDIA_ITEM_GRAPH',
  slugs: slugs,
  graphType: graphType
})

export const setSpotifyPlayer = player => ({
  type: 'SET_SPOTIFY_PLAYER',
  player: player
})

export const unsetSpotifyPlayer = () => ({
  type: 'UNSET_SPOTIFY_PLAYER'
})

export const setSpotifyPlaybackState = state => ({
  type: 'SET_SPOTIFY_PLAYBACK_STATE',
  state: state,
})

export const setSpotifyPlaybackError = error => ({
  type: 'SET_SPOTIFY_PLAYBACK_ERROR',
  error: error
})

export const setSpotifyPlaybackDevice = deviceId => ({
  type: 'SET_SPOTIFY_PLAYBACK_DEVICE',
  deviceId: deviceId
})

export const setSpotifyUriContent = spotifyUriContent => ({
  type: 'SET_SPOTIFY_URI_CONTENT',
  spotifyUriContent: spotifyUriContent
})
