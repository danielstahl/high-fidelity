import { combineReducers } from 'redux'

import mediaItemReducers from './mediaItemReducers'
import userStateReducers from './userStateReducers'
import spotifyStateReducers from './spotifyStateReducers'

const highFidelityReducers = combineReducers({
  mediaItemReducers, userStateReducers, spotifyStateReducers
})

export default highFidelityReducers
