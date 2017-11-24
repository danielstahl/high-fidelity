import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
import Builders from '../services/Builders'
import Utils from '../services/Utils'
import { connect } from 'react-redux'

class InstrumentForm extends Component {
  constructor(props) {
    super(props)
    this.state = { name: '', slug: '', showModal: false }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.createInstrument = this.createInstrument.bind(this)
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
      slug: this.props.genre.slugs + ":instrument:" + Utils.slug(e.target.value)
    })
  }

  close() {
    this.setState({ showModal: false })
  }

  open() {
    this.setState({ showModal: true })
  }

  createInstrument(event) {
    event.preventDefault();

    let newInstrumentMediaItem = {
      slugs: this.state.slug,
      name: this.state.name,
      types: ['instrument'],
      uris: {},
      tags: {genre: [this.props.genre.slugs]}
    }
    this.props.mediaItemHandler.addMediaItem(newInstrumentMediaItem)
    this.setState({ name: '', slug: ''})
  }

  render() {
    const instruments = this.props.instruments.map(instrument =>
      <li key={instrument.slugs}>{instrument.name}</li>
    )

    return (
      <div>
        <Button bsStyle="link" onClick={this.open}>Instruments</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Instruments for {this.props.genre.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h1>Instruments</h1>
            <ul className="list-inline">
              {instruments}
            </ul>
            <h2><small>Add Instrument</small></h2>
            <form onSubmit={this.createInstrument}>
              <FormGroup controlId="nameField">
                <ControlLabel>Name</ControlLabel>
                <FormControl type="text" onChange={this.handleNameChange} value={this.state.name}></FormControl>
              </FormGroup>
              <FormGroup controlId="slugsField">
                <ControlLabel>Slugs</ControlLabel>
                <FormControl type="text" value={this.state.slug}></FormControl>
              </FormGroup>
              <Button type="submit">Create</Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

const getInstruments = (mediaItems, graphType, genreSlugs) => {
  if(graphType === 'genre') {
    return mediaItems.filter(mediaItem =>
      mediaItem.types.includes('instrument') &&
      Builders.hasTag(mediaItem, 'genre', genreSlugs))
  } else {
    return []
  }
}

const mapStateToProps = state => {
  const instruments = getInstruments(state.mediaItemReducers,
                                     state.mediaItemGraphReducers.graphType,
                                     state.mediaItemGraphReducers.slugs)
  return {
    instruments: instruments
  }
}

export default connect(mapStateToProps)(InstrumentForm)
