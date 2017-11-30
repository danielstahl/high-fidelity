import React, { Component } from 'react'

import {
  Image, Button
} from 'react-bootstrap'

import spotifyBlack from '../images/Spotify_Icon_RGB_Black.png'
import spotifyGreen from '../images/Spotify_Icon_RGB_Green.png'
import { connect } from 'react-redux'
import Spotify from '../services/Spotify'

class SpotifyLoginHandler extends Component {

  componentDidMount() {
    Spotify.handleLoginCallback(this.props.location, this.props.dispatch)
  }

  render() {
    let theComponent
    if(this.props.loggedIn) {
      if(this.props.spotifyLoggedIn) {
        theComponent = (
            <Button bsStyle="link" disabled><Image src={spotifyGreen} height="24" width="24"/></Button>
        )
      } else {
        theComponent = (
          <Button bsStyle="link" onClick={Spotify.handlelogin}><Image src={spotifyBlack} height="24" width="24"/> Login</Button>
        )
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
    spotifyLoggedIn: state.spotifyStateReducers.spotifyLoggedIn,
    player: state.spotifyPlayerReducers.player,
    playbackStatus: state.spotifyPlaybackStatusReducers
  }
}

export default connect(mapStateToProps)(SpotifyLoginHandler)
