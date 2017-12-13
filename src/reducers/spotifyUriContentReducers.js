
const spotifyUriContentReducers = (state = [], action) => {
  switch (action.type) {
    case 'SET_SPOTIFY_URI_CONTENT':
      return [...state.filter(spotifyUriContent => spotifyUriContent.uri !== action.spotifyUriContent.uri), action.spotifyUriContent]
    default:
      return state
  }
}

export default spotifyUriContentReducers
