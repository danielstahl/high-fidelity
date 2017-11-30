
import * as actions from '../actions/index'
const queryString = require('query-string');

class Spotify {
  static handlelogin() {
    var ACCOUNTS_BASE_URL = 'https://accounts.spotify.com'
    var CLIENT_ID = '1b24de0b94324459b855aa136d301949'
    var REDIRECT_URI = 'http://localhost:3000'

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
}

export default Spotify
