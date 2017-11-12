
const uriInfoReducers = (state = [], action) => {
  switch (action.type) {
    case 'SET_URI_INFO':
      return [...state.filter(uriInfo => uriInfo.uri !== action.uriInfo.uri), action.uriInfo]
    default:
      return state
  }
}

export default uriInfoReducers
