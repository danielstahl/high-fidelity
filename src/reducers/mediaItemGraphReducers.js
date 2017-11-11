
const mediaItemGraphReducers = (state = {graph: undefined, graphType: 'root'}, action) => {
  switch (action.type) {
    case 'SET_MEDIA_ITEM_GRAPH':
      return {
        graph: action.graph,
        graphType: action.graph.graphType
      }
    default:
      return state
  }
}

export default mediaItemGraphReducers
