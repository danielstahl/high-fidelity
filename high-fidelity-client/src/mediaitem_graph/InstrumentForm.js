import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

class InstrumentForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', slug: '', showModal: false };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.createInstrument = this.createInstrument.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value, slug: this.props.genre.slugs + ":instrument:" + slug(e.target.value) });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        this.fetchInstruments(token);
      });
    this.setState({ showModal: true });
  }

  fetchInstruments(token) {
    let that = this;
    fetch('http://localhost:8080/media-items/' + token + '?type=instrument&tag=genre:' + this.props.genre.slugs)
      .then((instrumentResult) => {
        return instrumentResult.json();
      }).then((instrumentJson) => {
        that.setState({instruments: instrumentJson.mediaItems});
      });
  }

  createInstrument(event) {
    event.preventDefault();

    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        let newMediaItem = {
          uid: '',
          slugs: this.state.slug,
          name: this.state.name,
          types: ['instrument'],
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
          this.fetchInstruments(token);
        });
      });
  }

  render() {
    let instruments;

    if(this.state.instruments) {
      instruments = (this.state.instruments.map((instrument) =>
        <li>{instrument.name}</li>
      ));
    }

    return (
      <div>
        <a href="#" onClick={this.open}>Instruments</a>
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

    );
  }
}

export default InstrumentForm;
