import React, { Component } from 'react';

import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl, Form
} from 'react-bootstrap';

import Actions from './MediaItemGraphActions.js';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

var mySlugMode = {
    replacement: '-',      // replace spaces with replacement
    symbols: true,         // replace unicode symbols or not
    remove: /[.]/g,        // (optional) regex to remove characters
    lower: true,           // result in lower case
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
};


class AlbumForm extends Component {

  constructor(props) {
    super(props);
    this.state = { showModal: false, albumUri: '', albumInfo: undefined };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.fetchAlbumInfo = this.fetchAlbumInfo.bind(this);
    this.handleAlbumUriChange = this.handleAlbumUriChange.bind(this);
    this.createAlbum = this.createAlbum.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleAlbumUriChange(e) {
    this.setState({ albumUri: e.target.value});
  }

  fetchAlbumInfo(event) {
    let that = this;
    event.preventDefault();
    return this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        fetch('http://localhost:8080/albums/info/' + that.state.albumUri, Actions.fetchInit(token))
        .then((albumResult) => {
          return albumResult.json();
        })
        .then((albumJson) => {
          that.setState({albumInfo: albumJson});
        });
      });
  }

  createAlbum(event) {
    event.preventDefault();
    if(this.state.albumInfo) {
      let artists = this.state.albumInfo.artists
        .filter((artist) => artist.artistTypes.includes('artist'))
        .map((artist) => artist.slugs);

      let composers = this.state.albumInfo.artists
        .filter((artist) => artist.artistTypes.includes('composer'))
        .map((artist) => artist.slugs);

      let name = this.state.albumInfo.name;
      let nameSlug = slug(name, mySlugMode);
      let albumId = artists[0] + ":" + nameSlug;

      let newMediaItem = {
        uid: '',
        slugs: albumId,
        name: name,
        types: ['album'],
        uris: {spotifyUri: [this.state.albumInfo.spotifyUri]},
        tags: {
          genre: [this.props.genre.slugs],
          artist: artists,
          composer: composers
        }
      };

      this.props.user.firebaseUser.getIdToken(false)
        .then((token) => {
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
            this.setState({ albumInfo: undefined});
            this.close();
          });
        });
    }
  }

  renderAlbumInfoArtist(artist) {
    let artistTypes = artist.artistTypes.join();
    if(artist.slugs) {
      return (<li><i>{artistTypes}</i> {artist.name} <Glyphicon glyph="ok" /></li>);
    } else {
      return (<li>{artist.name} <Glyphicon glyph="remove" /></li>);
    }
  }

  render() {
    let albumInfoView, createAlbumForm;
    if(this.state.albumInfo) {
      albumInfoView = (
      <div>
        <h3><img alt={this.state.albumInfo.name} src={this.state.albumInfo.imageUri}/> {this.state.albumInfo.name}</h3>
        <ul className="list-inline">
        {this.state.albumInfo.artists.map((artist) =>
          {return this.renderAlbumInfoArtist(artist)}
        )}
      </ul>
      </div>);

      createAlbumForm = (
        <Form inline onSubmit={this.createAlbum}>
          <Button type="submit">Create Album</Button>
        </Form>
      );
    }

    return (
      <div>
          <a href="#" onClick={this.open}>Add Album</a>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New Album</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Add new album</h1>
              <Form inline onSubmit={this.fetchAlbumInfo}>
                <FormGroup controlId="albumUriField">
                  <ControlLabel>Album URI</ControlLabel>
                  {' '}
                  <FormControl type="text" onChange={this.handleAlbumUriChange} value={this.state.albumUri}></FormControl>
                </FormGroup>
                {' '}
                <Button type="submit">Fetch album</Button>
              </Form>
              {albumInfoView}
              {createAlbumForm}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default AlbumForm;
