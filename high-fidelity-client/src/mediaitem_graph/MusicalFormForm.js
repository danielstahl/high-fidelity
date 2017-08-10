import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

class MusicalFormForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', slug: '', showModal: false };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.createMusicalForm = this.createMusicalForm.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value, slug: this.props.genre.slugs + ":form:" + slug(e.target.value) });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        this.fetchMusicalForms(token);
      });
    this.setState({ showModal: true });
  }

  fetchMusicalForms(token) {
    let that = this;
    fetch('http://localhost:8080/media-items/' + token + '?type=form&tag=genre:' + this.props.genre.slugs)
      .then((musicalFormsResult) => {
        return musicalFormsResult.json();
      }).then((musicalFormsJson) => {
        that.setState({forms: musicalFormsJson.mediaItems});
      });
  }

  createMusicalForm(event) {
    event.preventDefault();

    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        let newMediaItem = {
          uid: '',
          slugs: this.state.slug,
          name: this.state.name,
          types: ['form'],
          uris: {},
          tags: {genre: [this.props.genre.slugs]}
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
          this.setState({ name: '', slug: ''});
          this.fetchMusicalForms(token);
        });
      });
  }

  render() {
    let forms;

    if(this.state.forms) {
      forms = (this.state.forms.map((form) =>
        <li>{form.name}</li>
      ));
    }

    return (
      <div>
        <a href="#" onClick={this.open}>Musical Forms</a>
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

    );
  }
}

export default MusicalFormForm;
