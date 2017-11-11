import React, { Component } from 'react'

import {
  Image, Button
} from 'react-bootstrap'

import spotifyBlack from '../images/Spotify_Icon_RGB_Black.png'
import spotifyGreen from '../images/Spotify_Icon_RGB_Green.png'
import { connect } from 'react-redux'

import * as actions from '../actions/index'

const queryString = require('query-string');

class SpotifyLoginHandler extends Component {

  constructor(props) {
    super(props)
    this.handlelogin = this.handlelogin.bind(this)
  }

  componentDidMount() {
    var that = this
    var parsed = queryString.parse(this.props.location.hash);
    if(parsed.access_token) {
      var accessToken = parsed.access_token

      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      }).then((result) => {
        if (!result.ok) {
          throw result
        }
        return result.json()
      }).then(spotifyUser => {
        that.props.dispatch(actions.setSpotifyUser({
          id: spotifyUser.id,
          displayName: spotifyUser.display_name,
          spotifyLoggedIn: true,
          accessToken: accessToken
        }))
      }).catch(error => {
        if(error.status === 401) {
            that.handlelogin()
        }
        console.log(error)
      })
    }
  }

  handlelogin() {
    var ACCOUNTS_BASE_URL = 'https://accounts.spotify.com'
    var CLIENT_ID = '1b24de0b94324459b855aa136d301949'
    var REDIRECT_URI = 'http://localhost:3000'

    var scopes = ['user-read-playback-state', 'user-modify-playback-state']
    var url = ACCOUNTS_BASE_URL + '/authorize?client_id=' + CLIENT_ID
           + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
           + '&scope=' + encodeURIComponent(scopes.join(' '))
           + '&response_type=token'

    window.location.href = url;
    return false;
  }

  render() {
    let theComponent;
    if(this.props.loggedIn) {
      if(this.props.spotifyLoggedIn) {
        theComponent = (
            <Button bsStyle="link" disabled><Image src={spotifyGreen} height="24" width="24"/></Button>
        );
      } else {
        theComponent = (
          <Button bsStyle="link" onClick={this.handlelogin}><Image src={spotifyBlack} height="24" width="24"/> Login</Button>
        );
      }
    }
    return (
      <div>{theComponent}</div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.userStateReducers.loggedIn,
    spotifyUser: state.spotifyStateReducers.spotifyUser,
    spotifyLoggedIn: state.spotifyStateReducers.spotifyLoggedIn
  }
}

export default connect(mapStateToProps)(SpotifyLoginHandler)
