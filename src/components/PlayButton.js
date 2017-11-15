import React, { Component } from 'react';

import {
  Button, Glyphicon
} from 'react-bootstrap';

class PlayButton extends Component {

  render() {
    return (
      <div>{this.props.name} <Button bsStyle="link"><Glyphicon glyph="play" /></Button></div>
    )
  }
}

export default PlayButton;
