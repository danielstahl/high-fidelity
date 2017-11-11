
import Builders from './Builders'

describe('makeGenre', () => {
  it('makeGenre should make an genre', () => {
    var mediaItem = { slugs: 'classical-music', name: 'Classical Music'}
    expect(Builders.makeGenre(mediaItem)).toEqual({
      slugs: 'classical-music',
      name: 'Classical Music'
    })
  })
})
