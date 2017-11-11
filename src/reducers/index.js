import { combineReducers } from 'redux'

import mediaItemReducers from './mediaItemReducers'
import userStateReducers from './userStateReducers'
import spotifyStateReducers from './spotifyStateReducers'
import mediaItemGraphReducers from './mediaItemGraphReducers'

const highFidelityReducers = combineReducers({
  mediaItemReducers, userStateReducers, spotifyStateReducers, mediaItemGraphReducers
})

export default highFidelityReducers
