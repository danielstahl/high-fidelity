import React, { Component } from 'react';

import {
  Button, ButtonGroup, Glyphicon, ProgressBar, Panel
} from 'react-bootstrap';

class SpotifyPlaybackStatus extends Component {
  constructor(props) {
    super(props);
    this.fetchPlaybackStatus = this.fetchPlaybackStatus.bind(this);
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

  render() {
    let theComponent = null;

    if(this.props.user && this.props.user.spotify && this.props.playbackStatus) {
      let player;
      if(this.props.playbackStatus.isPlaying) {
        player = (<Glyphicon glyph="pause" />);
      } else {
        player = (<Glyphicon glyph="play" />);
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
            <Button bsStyle="link"><Glyphicon glyph="step-backward" /></Button>
            <Button bsStyle="link">{player}</Button>
            <Button bsStyle="link"><Glyphicon glyph="step-forward" /></Button>
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
