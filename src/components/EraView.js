import React, { Component } from 'react';

import {
  Button
} from 'react-bootstrap'

class EraView extends Component {

  render() {
    let component;
    if(this.props.digest === 'true') {
      component = (
        <li><Button bsStyle="link">{this.props.era.name}</Button></li>
      )
    }
    return component;
  }
}

export default EraView
