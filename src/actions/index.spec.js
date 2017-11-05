import * as actions from './index'

const testMediaItem = {
    uid: 'ZlnnPfqyyYZqDxGDAKTPV5yRuBF3',
    slug: 'alabin-berg'
}

describe('addMediaItem', () => {
  it('addMediaItem should create a ADD_MEDIA_ITEM action', () => {
    expect(actions.addMediaItem(testMediaItem)).toEqual({
      type: 'ADD_MEDIA_ITEM',
      mediaItem: testMediaItem
    })
  })
})

describe('removeMediaItem', () => {
  it('removeMediaItem should create a REMOVE_MEDIA_ITEM action', () => {
    expect(actions.removeMediaItem(testMediaItem)).toEqual({
      type: 'REMOVE_MEDIA_ITEM',
      mediaItem: testMediaItem
    })
  })
})

describe('updateMediaItem', () => {
  it('updateMediaItem should create a UPDATE_MEDIA_ITEM action', () => {
    expect(actions.updateMediaItem(testMediaItem)).toEqual({
      type: 'UPDATE_MEDIA_ITEM',
      mediaItem: testMediaItem
    })
  })
})
