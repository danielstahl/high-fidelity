
import Utils from '../services/Utils'

const spotifyPlaybackStatusReducers = (state = {state: undefined, error: undefined, deviceId: ''}, action) => {
  switch (action.type) {
    case 'SET_SPOTIFY_PLAYBACK_STATE':
      return {
        state: action.state,
        error: state.error,
        deviceId: state.deviceId,
        currentTimeMillis: Utils.currentTimeMillis()
      }
    case 'SET_SPOTIFY_PLAYBACK_ERROR':
      return {
        state: state.state,
        error: action.error,
        deviceId: state.deviceId,
        currentTimeMillis: Utils.currentTimeMillis()
      }
    case 'SET_SPOTIFY_PLAYBACK_DEVICE':
      return {
        state: state.state,
        error: state.error,
        deviceId: action.deviceId,
        currentTimeMillis: Utils.currentTimeMillis()
      }
    default:
      return state
  }
}

export default spotifyPlaybackStatusReducers
