import React, { Component } from 'react';

import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import Actions from './MediaItemGraphActions.js';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

class GenreForm extends Component {

  constructor(props) {
    super(props);
    this.state = { name: '', slug: '', showModal: false };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.createGenre = this.createGenre.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value, slug: slug(e.target.value) });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  createGenre(event) {
    event.preventDefault();

    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        let newMediaItem = {
          uid: '',
          slugs: this.state.slug,
          name: this.state.name,
          types: ['genre'],
          uris: {},
          tags: {}
        };
        fetch('http://localhost:8080/media-items/' + token, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newMediaItem)
        }).then(res => res.json())
        .then(postResult => {
          console.log("Post result");
          console.log(postResult);
          Actions.fetchGenres(this.props.user, this.props.setGraph);
        });
      });

    this.close();
  }

  render() {
    return(
      <div>
          <h2><small>Add Genre</small></h2>
          <Button bsStyle="link" onClick={this.open}><Glyphicon glyph="plus" /></Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New Genre</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Create new Genre</h1>
              <form onSubmit={this.createGenre}>
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

    );
  }
}

export default GenreForm;
