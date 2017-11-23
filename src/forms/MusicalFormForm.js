import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
import Builders from '../services/Builders'
import { connect } from 'react-redux'

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

class MusicalFormForm extends Component {
  constructor(props) {
    super(props)
    this.state = { name: '', slug: '', showModal: false }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.createMusicalForm = this.createMusicalForm.bind(this)
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
      slug: this.props.genre.slugs + ":form:" + slug(e.target.value)
    })
  }

  close() {
    this.setState({
      showModal: false,
      name: '',
      slug: ''
    })
  }

  open() {
    this.setState({ showModal: true });
  }

  createMusicalForm(event) {
    event.preventDefault()
    let newMediaItem = {
      slugs: this.state.slug,
      name: this.state.name,
      types: ['form'],
      uris: {},
      tags: {genre: [this.props.genre.slugs]}
    }
    this.props.mediaItemHandler.addMediaItem(newMediaItem)
    this.setState({
      name: '',
      slug: ''
    })
  }

  render() {
    let forms;

    if(this.props.forms) {
      forms = this.props.forms.map(form =>
        <li key={form.slugs}>{form.name}</li>
      )
    }

    return (
      <div>
        <Button bsStyle="link" onClick={this.open}>Musical Forms</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Musical Forms for {this.props.genre.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h1>Musical Forms</h1>
            <ul className="list-inline">
              {forms}
            </ul>
            <h2><small>Add Musical Form</small></h2>
            <form onSubmit={this.createMusicalForm}>
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

const getMusicalForms = (mediaItems, graphType, genreSlugs) => {
  if(graphType === 'genre') {
    return mediaItems.filter(mediaItem =>
      mediaItem.types.includes('form') &&
      Builders.hasTag(mediaItem, 'genre', genreSlugs))
  } else {
    return []
  }
}

const mapStateToProps = state => {
  const musicalForms = getMusicalForms(state.mediaItemReducers,
                                       state.mediaItemGraphReducers.graphType,
                                       state.mediaItemGraphReducers.slugs)
  return {
    forms: musicalForms
  }
}

export default connect(mapStateToProps)(MusicalFormForm)
