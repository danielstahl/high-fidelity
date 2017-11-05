
import userStateReducers from './userStateReducers'

const loggedInUser = {
    email: 'user@domain.com',
    uid: 'theUserUID',
    loggedIn: true
}

describe('userState reducers', () => {
  it('should handle initial state', () => {
    expect(userStateReducers(undefined, {}))
      .toEqual({user: undefined, loggedIn: false})
  })
  it('should handle undefined user', () => {
    expect(userStateReducers(undefined, {
      type: 'SET_USER',
      user: undefined
    })).toEqual({ user: undefined, loggedIn: false })
  })
  it('should handle logged in SET_USER', () => {
    expect(userStateReducers(undefined, {
      type: 'SET_USER',
      user: loggedInUser
    })).toEqual({ user: loggedInUser, loggedIn: true})
  })
})
