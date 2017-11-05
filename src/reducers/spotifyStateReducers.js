
const spotifyStateReducers = (state = {spotifyUser: undefined, spotifyLoggedIn: false}, action) => {
  switch (action.type) {
    case 'SET_SPOTIFY_USER':
      return {
        spotifyUser: action.user,
        spotifyLoggedIn: (action.user) ? action.user.spotifyLoggedIn : false
      }
    case 'UNSET_SPOTIFY_USER':
      return {
        spotifyUser: undefined,
        spotifyLoggedIn: false
      }
    default:
      return state
  }
}

export default spotifyStateReducers
