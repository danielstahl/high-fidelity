
const spotifyPlayerReducers = (state = {player: undefined}, action) => {
  switch (action.type) {
    case 'SET_SPOTIFY_PLAYER':
      return {
        player: action.player
      }
    case 'UNSET_SPOTIFY_PLAYER':
      return {
        player: undefined
      }
    default:
      return state
  }
}

export default spotifyPlayerReducers
