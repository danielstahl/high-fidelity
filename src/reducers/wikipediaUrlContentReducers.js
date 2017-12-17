
const wikipediaUrlContentReducers = (state = [], action) => {
  switch (action.type) {
    case 'SET_WIKIPEDIA_URL_CONTENT':
      return [...state.filter(wikipediaUrlContent => wikipediaUrlContent.url !== action.wikipediaUrlContent.url), action.wikipediaUrlContent]
    default:
      return state
  }
}

export default wikipediaUrlContentReducers
