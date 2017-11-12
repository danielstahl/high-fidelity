
import uriInfoReducers from './uriInfoReducers'

const uriInfo1 = {
    uriType: 'spotifyUri',
    uri: 'spotify:artist:60ju8DuNEmkdLw3ymddLje',
    url: 'https://open.spotify.com/artist/60ju8DuNEmkdLw3ymddLje',
    name: 'Alban Berg'
}

const uriInfo1update = {
    uriType: 'spotifyUri',
    uri: 'spotify:artist:60ju8DuNEmkdLw3ymddLje',
    url: 'https://open.spotify.com/artist/60ju8DuNEmkdLw3ymddLje',
    name: 'Alban The Berg'
}

const uriInfo2 = {
    uriType: 'wikipedia',
    uri: 'https://en.wikipedia.org/wiki/Classical_period_(music)',
    url: 'https://en.wikipedia.org/wiki/Classical_period_(music)',
    name: 'Classical Period'
}

describe('set uriInfo', () => {
  it('should handle initial state', () => {
    expect(uriInfoReducers(undefined, {})).toEqual([])
  })

  it('should handle add uriInfo', () => {
    expect(uriInfoReducers([uriInfo1], {
      type: 'SET_URI_INFO',
      uriInfo: uriInfo2
    })).toEqual([uriInfo1, uriInfo2])
  })

  it('should handle updated uriInfo', () => {
    expect(uriInfoReducers([uriInfo1, uriInfo2], {
      type: 'SET_URI_INFO',
      uriInfo: uriInfo1update
    })).toEqual([uriInfo2, uriInfo1update])
  })
})
