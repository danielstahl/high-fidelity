
function sameMediaItem(mediaItem1, mediaItem2) {
  return mediaItem1.uid === mediaItem2.uid && mediaItem1.slugs === mediaItem2.slugs
}

const mediaItemReducers = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MEDIA_ITEM':
      return [
        ...state, action.mediaItem
      ]
    case 'REMOVE_MEDIA_ITEM':
      return state.filter(mediaItem =>
        !sameMediaItem(mediaItem, action.mediaItem))
    case 'UPDATE_MEDIA_ITEM':
      return state.map(mediaItem =>
        (sameMediaItem(mediaItem, action.mediaItem)) ? action.mediaItem : mediaItem
      )
    default:
      return state
  }
}

export default mediaItemReducers
