import React, { Component } from 'react';

import {
  Button, Glyphicon, ProgressBar, Panel
} from 'react-bootstrap';
import { connect } from 'react-redux'

class SpotifyPlaybackStatus extends Component {

  constructor(props) {
    super(props)
    this.clickPlay = this.clickPlay.bind(this)
    this.clickPause = this.clickPause.bind(this)
    this.clickNext = this.clickNext.bind(this)
    this.clickPrevious = this.clickPrevious.bind(this)
  }

  clickPlay(event) {
    event.preventDefault()
    this.props.player.resume()
  }

  clickPause(event) {
    event.preventDefault()
    this.props.player.pause()
  }

  clickNext(event) {
    event.preventDefault()
    this.props.player.nextTrack()
  }

  clickPrevious(event) {
    event.preventDefault()
    this.props.player.previousTrack()
  }

  render() {
    let theComponent = null
    if(this.props.loggedIn && this.props.spotifyLoggedIn && this.props.playbackStatus.state) {
      let player
      if(!this.props.playbackStatus.state.paused) {
        player = (<Button bsStyle="link" onClick={this.clickPause}><Glyphicon glyph="pause" /></Button>)
      } else {
        player = (<Button bsStyle="link" onClick={this.clickPlay}><Glyphicon glyph="play" /></Button>)
      }
      let progress, trackName, artistName, contextName;
      if(this.props.playbackStatus.state) {
        progress = (this.props.playbackStatus.state.position / this.props.playbackStatus.state.duration) * 100;
        trackName = this.props.playbackStatus.state.track_window.current_track.name
        artistName = this.props.playbackStatus.state.track_window.current_track.artists[0].name;
      }
      if(this.props.playbackStatus.state.context) {
        contextName = this.props.playbackStatus.state.context.metadata.context_description
      }
      theComponent = (
        <Panel>
            <div>
            <Button bsStyle="link" onClick={this.clickPrevious}><Glyphicon glyph="step-backward" /></Button>
            {player}
            <Button bsStyle="link" onClick={this.clickNext}><Glyphicon glyph="step-forward" /></Button>
          </div>

          <ProgressBar now={progress}/>
          <div>{trackName} by {artistName}</div>
          <div>From {contextName}</div>
        </Panel>
      )
    }
    return theComponent
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

export default connect(mapStateToProps)(SpotifyPlaybackStatus)
