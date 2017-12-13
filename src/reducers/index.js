import { combineReducers } from 'redux'

import mediaItemReducers from './mediaItemReducers'
import userStateReducers from './userStateReducers'
import spotifyStateReducers from './spotifyStateReducers'
import mediaItemGraphReducers from './mediaItemGraphReducers'
import uriInfoReducers from './uriInfoReducers'
import spotifyPlayerReducers from './spotifyPlayerReducers'
import spotifyPlaybackStatusReducers from './spotifyPlaybackStatusReducers'
import spotifyUriContentReducers from './spotifyUriContentReducers'

const highFidelityReducers = combineReducers({
  mediaItemReducers,
  userStateReducers,
  spotifyStateReducers,
  mediaItemGraphReducers,
  uriInfoReducers,
  spotifyPlayerReducers,
  spotifyPlaybackStatusReducers,
  spotifyUriContentReducers
})

export default highFidelityReducers
