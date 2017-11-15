
import Builders from './Builders'

describe('makeGenre', () => {
  it('makeGenre should make an genre', () => {
    var mediaItem = { slugs: 'classical-music', name: 'Classical Music'}
    expect(Builders.makeGenre(mediaItem)).toEqual({
      slugs: 'classical-music',
      name: 'Classical Music'
    })
  })

  it('toUris should make uris with info', () => {
    var mediaItem = {
      name: "Alban Berg",
      slugs: "alban-berg",
      uris: {
        spotifyUri: ["spotify:artist:60ju8DuNEmkdLw3ymddLje", "spotify:album:4wH3yCexG4STVJnCGohKEA"],
        wikipedia: ["https://en.wikipedia.org/wiki/Alfred_Brendel"]
      }
    }
    var urisInfos = [
      {
        name: "Alban Berg at Spotify",
        uri: "spotify:artist:60ju8DuNEmkdLw3ymddLje",
        uriType: "spotifyUri",
        url: "https://open.spotify.com/artist/60ju8DuNEmkdLw3ymddLje"
      },
      {
        name: "Alfred Brendel on Wikipedia",
        uri: "https://en.wikipedia.org/wiki/Alfred_Brendel",
        uriType: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Alfred_Brendel"
      },
      {
        name: "Schubert: The Complete Impromptus/Moments Musicaux (2 CDs) at Spotify",
        uri: "spotify:album:4wH3yCexG4STVJnCGohKEA",
        uriType: "spotifyUri",
        url: "https://open.spotify.com/album/4wH3yCexG4STVJnCGohKEA"
      }
    ]

    var expectedUris =
      [
        {
          name: "Alban Berg at Spotify",
          uri: "spotify:artist:60ju8DuNEmkdLw3ymddLje",
          uriType: "spotifyUri",
          url: "https://open.spotify.com/artist/60ju8DuNEmkdLw3ymddLje"
        },
        {
          name: "Schubert: The Complete Impromptus/Moments Musicaux (2 CDs) at Spotify",
          uri: "spotify:album:4wH3yCexG4STVJnCGohKEA",
          uriType: "spotifyUri",
          url: "https://open.spotify.com/album/4wH3yCexG4STVJnCGohKEA"
        },
        {
          name: "Alfred Brendel on Wikipedia",
          uri: "https://en.wikipedia.org/wiki/Alfred_Brendel",
          uriType: "wikipedia",
          url: "https://en.wikipedia.org/wiki/Alfred_Brendel"
        }
      ]

    expect(Builders.toUris(mediaItem, urisInfos)).toEqual(expectedUris)
  })
})
