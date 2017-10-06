import React, { Component } from 'react';

import {
  Button, Glyphicon, ProgressBar, Panel
} from 'react-bootstrap';

class SpotifyPlaybackStatus extends Component {
  constructor(props) {
    super(props);
    this.fetchPlaybackStatus = this.fetchPlaybackStatus.bind(this);
    this.clickPlay = this.clickPlay.bind(this);
    this.clickPause = this.clickPause.bind(this);
    this.clickNext = this.clickNext.bind(this);
    this.clickPrevious = this.clickPrevious.bind(this);
  }

  componentDidMount() {
    this.timeoutID = setTimeout(this.fetchPlaybackStatus, 2000);
    this.intervalID = setInterval(this.fetchPlaybackStatus, 15000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    clearInterval(this.intervalID);
  }

  fetchPlaybackStatus() {
    if(this.props.user && this.props.user.spotify) {
      let that = this;
      return this.props.user.firebaseUser.getIdToken(false)
        .then((token) => {
          fetch('http://localhost:8080/playback/status/' + token)
          .then((result) => {
            return result.json();
          })
          .then((json) => {
            that.props.setPlaybackStatus(json);
          });
        });
    }
  }

  clickPlay(event) {
    event.preventDefault();
    this.props.play();
  }

  clickPause(event) {
    event.preventDefault();
    this.props.pause();
  }

  clickNext(event) {
    event.preventDefault();
    this.props.next();
  }

  clickPrevious(event) {
    event.preventDefault();
    this.props.previous();
  }

  render() {
    let theComponent = null;

    if(this.props.user && this.props.user.spotify && this.props.playbackStatus) {
      let player;
      if(this.props.playbackStatus.isPlaying) {
        player = (<Button bsStyle="link" onClick={this.clickPause}><Glyphicon glyph="pause" /></Button>);
      } else {
        player = (<Button bsStyle="link" onClick={this.clickPlay}><Glyphicon glyph="play" /></Button>);
      }
      let progress, trackName, artistName, deviceName;
      if(this.props.playbackStatus.track) {
        progress = (this.props.playbackStatus.progressMs / this.props.playbackStatus.track.durationMs) * 100;
        trackName = this.props.playbackStatus.track.name;
        artistName = this.props.playbackStatus.track.artists[0].name;
      }
      if(this.props.playbackStatus.device) {
        deviceName = this.props.playbackStatus.device.name;
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
          <div>On {deviceName}</div>
        </Panel>
      );
    }

    return theComponent;
  }
}

export default SpotifyPlaybackStatus;
