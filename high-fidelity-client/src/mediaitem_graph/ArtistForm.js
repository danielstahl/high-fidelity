import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

import {
  Typeahead, AsyncTypeahead
} from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/ClearButton.css';
import 'react-bootstrap-typeahead/css/Loader.css';
import 'react-bootstrap-typeahead/css/Token.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class ArtistForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', slug: '', spotifyUri: '', showModal: false,  instruments: [], instrumentChoises: []};
    this.handleNameChange = this.handleNameChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.createArtist = this.createArtist.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.selectInstruments = this.selectInstruments.bind(this);
    this.fetchInstruments = this.fetchInstruments.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value, slug: slug(e.target.value)});
  }

  close() {
    this.setState({ showModal: false });
  }

  fetchInstruments(token) {
    let that = this;
    fetch('http://localhost:8080/media-items/' + token + '?type=instrument&tag=genre:' + this.props.genre.slugs)
      .then((instrumentResult) => {
        return instrumentResult.json();
      }).then((instrumentJson) => {
        that.setState({instrumentChoises: instrumentJson.mediaItems});
      });
  }

  open() {
    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        this.fetchInstruments(token);
      });
    this.setState({ showModal: true });
  }

  createArtist(event) {
    event.preventDefault();

    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        let newMediaItem = {
          uid: '',
          slugs: this.state.slug,
          name: this.state.name,
          types: ['artist'],
          uris: {spotifyUri: [this.state.spotifyUri]},
          tags: {genre: [this.props.genre.slugs], instrument: this.state.instruments}
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
          this.props.refresh();
          this.setState({ name: '', slug: '', instruments: []});
        });
      });

    this.close();
  }

  remoteSearch(query) {
    let that = this;
    return this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        fetch('http://localhost:8080/search/artist/' + token + '?query=' + query)
        .then((result) => {
          return result.json();
        })
        .then((json) => {
          that.setState({options: json.result});
        });
      });

  }

  selectArtist(artist) {
    if(artist[0]) {
      this.setState({ name: artist[0].name, slug: slug(artist[0].name), spotifyUri: artist[0].spotifyUri });
    }
  }

  selectInstruments(instruments) {
    let instrumentSlugs = instruments.map((instrument) => instrument.slugs);
    this.setState({ instruments: instrumentSlugs});
  }

  render() {
    return (
      <div>
          <a href="#" onClick={this.open}>Add Artist</a>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New {this.props.genre.name} Artist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Create new Artist</h1>
              <form onSubmit={this.createArtist}>
                <FormGroup controlId="searchField">
                  <ControlLabel>Search</ControlLabel>
                  <AsyncTypeahead
                    onChange={this.selectArtist}
                    onSearch={query => (
                      this.remoteSearch(query)
                    )}
                    labelKey={option => `${option.name}`}
                    options={this.state.options}
                  />
                </FormGroup>
                <FormGroup controlId="slugsField">
                  <ControlLabel>Slugs</ControlLabel>
                  <FormControl type="text" value={this.state.slug}></FormControl>
                </FormGroup>
                <FormGroup controlId="nameField">
                  <ControlLabel>Name</ControlLabel>
                  <FormControl type="text" onChange={this.handleNameChange} value={this.state.name}></FormControl>
                </FormGroup>
                <FormGroup controlId="instrumentsField">
                  <ControlLabel>Instruments</ControlLabel>
                  <Typeahead multiple
                    onChange={this.selectInstruments}
                    options={this.state.instrumentChoises}
                    labelKey={option => `${option.name}`}
                  />
                </FormGroup>
                <Button type="submit">Create</Button>
              </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ArtistForm;
