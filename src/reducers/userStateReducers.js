
const userStateReducers = (state = {user: undefined, loggedIn: false}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.user,
        loggedIn: (action.user) ? action.user.loggedIn : false
      }
    case 'UNSET_USER':
      return {
        user: undefined,
        loggedIn: false
      }
    default:
      return state
  }
}

export default userStateReducers
