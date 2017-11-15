import React, { Component } from 'react';

import {
  Button
} from 'react-bootstrap'

class ArtistView extends Component {
  render() {
    let component
    if(this.props.digest === 'true') {
      component = (
        <li key={this.props.artist.slugs}><Button bsStyle="link">{this.props.artist.name}</Button></li>
      )
    }
    return component
  }
}

export default ArtistView
