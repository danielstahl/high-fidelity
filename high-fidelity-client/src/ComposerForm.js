import React, { Component } from 'react';

import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

import {
  AsyncTypeahead
} from 'react-bootstrap-typeahead';

class ComposerForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', slug: '', spotifyUri: '', showModal: false };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.createComposer = this.createComposer.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
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

  createComposer(event) {
    event.preventDefault();

    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        let newMediaItem = {
          uid: '',
          slugs: this.state.slug,
          name: this.state.name,
          types: ['composer'],
          uris: {spotifyUri: [this.state.spotifyUri]},
          tags: {genre: [this.props.era.tags.genre[0].tag.slugs], era: [this.props.era.slugs]}
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
          this.props.refresh(this.props.tree, "era", this.props.era.slugs);
          this.setState({ name: '', slug: ''});
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

  render() {
    return (
      <div>
          <h2><small>Add Composer</small></h2>
          <Button bsStyle="link" onClick={this.open}><Glyphicon glyph="plus" /></Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New Composer for {this.props.era.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Create new Composer</h1>
              <form onSubmit={this.createComposer}>
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
                <Button type="submit">Create</Button>
              </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ComposerForm;
