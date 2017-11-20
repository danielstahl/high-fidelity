
const mediaItemGraphReducers = (state = {graphType: 'root', slugs: undefined}, action) => {
  switch (action.type) {
    case 'SET_MEDIA_ITEM_GRAPH':
      return {
        slugs: action.slugs,
        graphType: action.graphType
      }
    default:
      return state
  }
}

export default mediaItemGraphReducers
