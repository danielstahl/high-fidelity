import React, { Component } from 'react';

import {
  Button, Glyphicon
} from 'react-bootstrap';
import { connect } from 'react-redux'

class PlayButton extends Component {

  constructor(props) {
    super(props);
    this.clickPlay = this.clickPlay.bind(this);
  }

  clickPlay(event) {
    event.preventDefault();
    const accessToken = this.props.spotifyUser.accessToken
    const deviceId = this.props.playbackStatus.deviceId

    let body
    if(this.props.uris[0].startsWith('spotify:track')) {
      body = {uris: this.props.uris}
    } else if(this.props.offset) {
      body = {
        context_uri: this.props.uris[0],
        offset: {
          position: this.props.offset
        }
      }
    } else {
      body = {
        context_uri: this.props.uris[0]
      }
    }
    fetch("https://api.spotify.com/v1/me/player/play?device_id=" + deviceId, {
      method: "put",
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      body: JSON.stringify(body)
    }).then(result => {
      if (!result.ok) {
        throw result
      }
      return result
    }).catch(error => {
      if(error.status === 401) {
        this.handlelogin()
      }
      console.log("Error", error)
    })
  }

  render() {
    let currentTrack
    let theStyle
    if(this.props.playbackStatus && this.props.playbackStatus.state && this.props.playbackStatus.state.track_window) {
      currentTrack = this.props.playbackStatus.state.track_window.current_track.uri
      if(currentTrack === this.props.uris[0]) {
        theStyle = "text-primary"
      } else {
        theStyle = "text-dark"
      }
    }

    let result
    if(this.props.action) {
      result = (<div className={theStyle}><Button bsStyle="link" onClick={this.props.action}>{this.props.name}</Button> <Button bsStyle="link" onClick={this.clickPlay}><Glyphicon glyph="play" /></Button></div>)
    } else if(this.props.name) {
      result = (<div className={theStyle}>{this.props.name} <Button bsStyle="link" onClick={this.clickPlay}><Glyphicon glyph="play" /></Button></div>)
    } else {
      result = (<Button bsStyle="link" onClick={this.clickPlay}><Glyphicon glyph="play" /></Button>)
    }
    return result
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.userStateReducers.loggedIn,
    spotifyUser: state.spotifyStateReducers.spotifyUser,
    spotifyLoggedIn: state.spotifyStateReducers.spotifyLoggedIn,
    playbackStatus: state.spotifyPlaybackStatusReducers
  }
}

export default connect(mapStateToProps)(PlayButton)
