import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import {
  Typeahead
} from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/ClearButton.css';
import 'react-bootstrap-typeahead/css/Loader.css';
import 'react-bootstrap-typeahead/css/Token.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class AddLinkForm extends Component {
  constructor(props) {
    super(props);
    this.state = { uri: '', uriType: '', showModal: false };
    this.handleUriChange = this.handleUriChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.selectLinkType = this.selectLinkType.bind(this);
    this.addLinkToMediaItem = this.addLinkToMediaItem.bind(this);
    this.addLink = this.addLink.bind(this);
  }

  uriTypes = {
    spotifyUri: "Spotify URI",
    spotifyPlaylist: "Playlist",
    wikipedia: "Wikipedia",
    youtube: "Youtube"
  };

  uriOptions = [
    {id: 'spotifyUri', label: 'Spotify URI'},
    {id: 'wikipedia', label: 'Wikipedia'},
    {id: 'spotifyPlaylist', label: 'Playlist'},
    {id: 'youtube', label: 'Youtube'}
  ];

  handleUriChange(e) {
    this.setState({ uri: e.target.value});
  }

  selectLinkType(linkType) {
    if(linkType[0]) {
      this.setState({ uriType: linkType[0].id});
    }
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  addLinkToMediaItem(mediaItem) {
    let uriType = this.state.uriType;
    let uri = this.state.uri;

    if(!mediaItem.uris) {
      mediaItem.uris = {};
    }
    if(mediaItem.uris[uriType]) {
      mediaItem.uris.uriType = mediaItem.uris[uriType].push(uri);
    } else {
      mediaItem.uris[uriType] = [uri];
    }
    return mediaItem
  }

  addLink(event) {
    event.preventDefault();
    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {

        fetch('http://localhost:8080/media-items/' + token + '/' + this.props.item.slugs)
          .then((mediaItemResult) => {
            return mediaItemResult.json();
          }).then((mediaItem) => {
            let updatedMediaItem = this.addLinkToMediaItem(mediaItem);

            fetch('http://localhost:8080/media-items/' + token + '/' + this.props.item.slugs, {
              method: 'put',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedMediaItem)
            }).then(res => res.json())
            .then(putResult => {
              this.props.refresh();
              this.setState({ uri: '', uriType: ''});
              this.close();
            });

          });

      });
    this.close();
  }

  render() {

    return (
      <div>
          <a href="#" onClick={this.open}>Add Link</a>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Add link for {this.props.item.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Add new link</h1>
              <form onSubmit={this.addLink}>
                <FormGroup controlId="linkTypeField">
                  <ControlLabel>Link type</ControlLabel>
                  <Typeahead
                    onChange={this.selectLinkType}
                    options={this.uriOptions}/>
                </FormGroup>

                <FormGroup controlId="uriField">
                  <ControlLabel>URI</ControlLabel>
                  <FormControl type="text" onChange={this.handleUriChange} value={this.state.uri}></FormControl>
                </FormGroup>
                <Button type="submit">Add</Button>
              </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default AddLinkForm;
