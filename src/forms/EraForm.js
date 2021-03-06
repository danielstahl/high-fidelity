import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
import Utils from '../services/Utils'

class EraForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      slug: '',
      showModal: false
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.createEra = this.createEra.bind(this)
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
      slug: Utils.slug(e.target.value)
    })
  }

  close() {
    this.setState({
      showModal: false
    })
  }

  open() {
    this.setState({
      showModal: true
    })
  }

  createEra(event) {
    event.preventDefault()

    let newEraMediaItem = {
      slugs: this.state.slug,
      name: this.state.name,
      types: ['era'],
      uris: {},
      tags: {
        genre: [this.props.genre.slugs]
      }
    }
    this.props.mediaItemHandler.addMediaItem(newEraMediaItem)
    this.close()
  }

  render() {
      return (
        <div>
          <Button bsStyle="link" onClick={this.open}>Add Era</Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New Era for {this.props.genre.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Create new Era</h1>
              <form onSubmit={this.createEra}>
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

  export default EraForm;
