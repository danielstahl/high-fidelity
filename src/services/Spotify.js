
import * as actions from '../actions/index'
const queryString = require('query-string');

class Spotify {
  static handlelogin() {
    var ACCOUNTS_BASE_URL = 'https://accounts.spotify.com'
    var CLIENT_ID = '1b24de0b94324459b855aa136d301949'
    var REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
    var scopes = [
      'user-read-playback-state',
      'user-modify-playback-state',
      'streaming',
      'user-read-birthdate',
      'user-read-email',
      'user-read-private'
    ]
    var url = ACCOUNTS_BASE_URL + '/authorize?client_id=' + CLIENT_ID
           + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
           + '&scope=' + encodeURIComponent(scopes.join(' '))
           + '&response_type=token'

    window.location.href = url;
    return false;
  }

  static handleLoginCallback(location, dispatch) {
    const parsed = queryString.parse(location.hash);
    const accessToken = parsed.access_token
    if(accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      }).then(result => {
        if (!result.ok) {
          throw result
        }
        return result.json()
      }).then(spotifyUser => {
        dispatch(actions.setSpotifyUser({
          id: spotifyUser.id,
          displayName: spotifyUser.display_name,
          spotifyLoggedIn: true,
          accessToken: accessToken
        }))
        Spotify.setupPlayer(dispatch, accessToken)
      }).catch(error => {
        if(error.status === 401) {
          Spotify.handlelogin()
        }
        console.error(error)
      })
    }
  }


  static setupPlayer(dispatch, accessToken) {
    window.onSpotifyPlayerAPIReady = () => {
      const player = new window.Spotify.Player({
        name: 'High Fidelity Player',
        getOAuthToken: cb => {
          cb(accessToken)
        }
      })
      player.on('initialization_error',
        e => {
          dispatch(actions.setSpotifyPlaybackError(e))
        })
      player.on('authentication_error',
        e => {
          dispatch(actions.setSpotifyPlaybackError(e))
        })

      player.on('account_error',
        e => {
          dispatch(actions.setSpotifyPlaybackError(e))
        })
      player.on('playback_error',
        e => {
          dispatch(actions.setSpotifyPlaybackError(e))
        })

      player.on('player_state_changed', state => {
        dispatch(actions.setSpotifyPlaybackState(state))
      })

      player.on('ready', data => {
        dispatch(actions.setSpotifyPlaybackDevice(data.device_id))
      })

      player.connect()
        .then(success => {
          if (success) {
            console.log("The Web Playback SDK successfully connected to Spotify!", success)
          }
        })
      dispatch(actions.setSpotifyPlayer(player))
    }
    window.onSpotifyPlayerAPIReady()

  }

  static getSpotifyFetchUrl(spotifyUri) {
    const uriParts = spotifyUri.split(':')
    const uid = uriParts[uriParts.length - 1]
    const uriType = uriParts[uriParts.length - 2]
    let fetchUrl
    if('artist' === uriType) {
      fetchUrl = "https://api.spotify.com/v1/artists/" + uid
    } else if('album' === uriType) {
      fetchUrl = "https://api.spotify.com/v1/albums/" + uid
    } else if('playlist' === uriType) {
      fetchUrl = "https://api.spotify.com/v1/users/" + uriParts[2] + "/playlists/" + uid
    }
    return fetchUrl
  }

  static fetchSpotifyUriContent(spotifyUri, spotifyUser, dispatch) {
    var accessToken = spotifyUser.accessToken
    const fetchUrl = Spotify.getSpotifyFetchUrl(spotifyUri)

    if(fetchUrl) {
      fetch(fetchUrl, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      }).then(result => {
        if (!result.ok) {
          throw result
        }
        return result.json()
      }).then(resultJson => {
        dispatch(actions.setSpotifyUriContent({
          uri: spotifyUri,
          content: resultJson
        }))
      }).catch(error => {
        console.log("error", error)
        dispatch(actions.setSpotifyUriContent({
          uri: spotifyUri,
          content: undefined
        }))
        if(error.status === 401) {
            this.handlelogin()
        }
      })
    }
  }

  static getSpotifyUriContent(spotifyUri, spotifyUser, dispatch, spotifyUriContents) {
    if(!dispatch) {
      console.warn("No dispatch")
      return undefined
    }
    let spotifyUriContent
    if(spotifyUriContents) {
      spotifyUriContent = spotifyUriContents
        .find(tempSpotifyUriContent => tempSpotifyUriContent.uri === spotifyUri)
    }
    if(spotifyUriContent) {
      return spotifyUriContent
    } else {
      Spotify.fetchSpotifyUriContent(spotifyUri, spotifyUser, dispatch)
      return undefined
    }
  }
}

export default Spotify
