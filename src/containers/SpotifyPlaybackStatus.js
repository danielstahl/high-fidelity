import React, { Component } from 'react';

import {
  Button, Glyphicon, ProgressBar, Panel, Image
} from 'react-bootstrap';
import { connect } from 'react-redux'
import Utils from '../services/Utils'

class SpotifyPlaybackStatus extends Component {

  constructor(props) {
    super(props)
    this.clickPlay = this.clickPlay.bind(this)
    this.clickPause = this.clickPause.bind(this)
    this.clickNext = this.clickNext.bind(this)
    this.clickPrevious = this.clickPrevious.bind(this)
    this.setCurrentProgress = this.setCurrentProgress.bind(this)
    this.state = {progress: undefined}
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

  componentDidMount() {
    this.timeoutID = setTimeout(this.setCurrentProgress, 2000)
    this.intervalID = setInterval(this.setCurrentProgress, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID)
    clearInterval(this.intervalID)
  }

  setCurrentProgress() {
    if(this.props.loggedIn && this.props.spotifyLoggedIn && this.props.playbackStatus.state) {
      this.setState({ progress: this.getCurrentProgress()})
    }
  }

  getCurrentProgress() {

    let position
    if(!this.props.playbackStatus.state.paused) {
      const now = Utils.currentTimeMillis()
      position = now - this.props.playbackStatus.currentTimeMillis + this.props.playbackStatus.state.position
    } else {
      position = this.props.playbackStatus.state.position
    }

    return (position / this.props.playbackStatus.state.duration) * 100;
  }

  getSmallestAlbumImage(images) {
    return images.reduce((prev, next) => {
      if(prev.height < next.height) {
        return prev
      } else {
        return next
      }
    })
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
      let progress, trackName, artistName, contextName, albumImage
      if(this.props.playbackStatus.state) {
        progress = this.state.progress
        trackName = this.props.playbackStatus.state.track_window.current_track.name
        artistName = this.props.playbackStatus.state.track_window.current_track.artists[0].name
        albumImage =  this.getSmallestAlbumImage(this.props.playbackStatus.state.track_window.current_track.album.images).url
      }

      let thumbnailComponent
      if(albumImage) {
        thumbnailComponent = (<Image src={albumImage} rounded />)
      }

      if(this.props.playbackStatus.state.context && this.props.playbackStatus.state.context.metadata.context_description) {
        contextName = (<div><span className="text-muted"><i>from</i></span> {this.props.playbackStatus.state.context.metadata.context_description}</div>)
      }
      theComponent = (
        <Panel>
            <div>
            <Button bsStyle="link" onClick={this.clickPrevious}><Glyphicon glyph="step-backward" /></Button>
            {player}
            <Button bsStyle="link" onClick={this.clickNext}><Glyphicon glyph="step-forward" /></Button>
          </div>

          <ProgressBar now={progress}/>
          <div>{thumbnailComponent} {trackName}</div>
          <div><span className="text-muted"><i>by </i></span>{artistName}</div>
          {contextName}
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
