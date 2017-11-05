
import mediaItemReducers from './mediaItemReducers'

const testMediaItem1 = {
    uid: 'ZlnnPfqyyYZqDxGDAKTPV5yRuBF3',
    slugs: 'alabin-berg',
    name: 'Alban Berg'
}

const testMediaItem2 = {
  uid: 'ZlnnPfqyyYZqDxGDAKTPV5yRuBF3',
  slugs: 'anton-webern',
  name: 'Anton Weber'
}

const updatedTestMediaItem2 = {
  uid: 'ZlnnPfqyyYZqDxGDAKTPV5yRuBF3',
  slugs: 'anton-webern',
  name: 'Anton Webern'
}

describe('mediaItem reducers', () => {
  it('should handle inital state', () => {
    expect(mediaItemReducers(undefined, {})).toEqual([])
  })

  it('should handle ADD_MEDIA_ITEM', () => {
    expect(mediaItemReducers([testMediaItem1], {
      type: 'ADD_MEDIA_ITEM',
      mediaItem: testMediaItem2
    })).toEqual([testMediaItem1, testMediaItem2])
  })

  it('should handle REMOVE_MEDIA_ITEM', () => {
    expect(mediaItemReducers([testMediaItem1, testMediaItem2], {
      type: 'REMOVE_MEDIA_ITEM',
      mediaItem: testMediaItem2
    })).toEqual([testMediaItem1])
  })

  it('should handle UPDATE_MEDIA_ITEM', () => {
    expect(mediaItemReducers([testMediaItem1, testMediaItem2], {
      type: 'UPDATE_MEDIA_ITEM',
      mediaItem: updatedTestMediaItem2
    })).toEqual([testMediaItem1, updatedTestMediaItem2])
  })
})
