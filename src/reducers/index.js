import { combineReducers } from 'redux'

import mediaItemReducers from './mediaItemReducers'
import userStateReducers from './userStateReducers'
import spotifyStateReducers from './spotifyStateReducers'
import mediaItemGraphReducers from './mediaItemGraphReducers'
import uriInfoReducers from './uriInfoReducers'

const highFidelityReducers = combineReducers({
  mediaItemReducers, userStateReducers, spotifyStateReducers, mediaItemGraphReducers, uriInfoReducers
})

export default highFidelityReducers
