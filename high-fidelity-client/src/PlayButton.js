import React, { Component } from 'react';

import {
  Button, Glyphicon
} from 'react-bootstrap';

class PlayButton extends Component {

  constructor(props) {
    super(props);
    this.clickPlay = this.clickPlay.bind(this);
  }

  clickPlay(event) {
    event.preventDefault();
    this.props.play(this.props.uris);
  }

  render() {
    return (
      <div>{this.props.name} <Button bsStyle="link" onClick={this.clickPlay}><Glyphicon glyph="play" /></Button></div>);
  }
}

export default PlayButton;
