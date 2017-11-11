
export const addMediaItem = (mediaItem) => ({
  type: 'ADD_MEDIA_ITEM',
  mediaItem: mediaItem
})

export const removeMediaItem = (slugs) => ({
  type: 'REMOVE_MEDIA_ITEM',
  slugs: slugs
})

export const updateMediaItem = (mediaItem) => ({
  type: 'UPDATE_MEDIA_ITEM',
  mediaItem: mediaItem
})

export const setUser = (user) => ({
  type: 'SET_USER',
  user: user
})

export const unsetUser = () => ({
  type: 'UNSET_USER'
})

export const setSpotifyUser = (spotifyUser) => ({
  type: 'SET_SPOTIFY_USER',
  user: spotifyUser
})

export const unsetSpotifyUser = () => ({
  type: 'UNSET_SPOTIFY_USER'
})

export const setMediaItemGraph = (graph) => ({
  type: 'SET_MEDIA_ITEM_GRAPH',
  graph: graph
})
