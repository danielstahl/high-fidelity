import React, { Component } from 'react';

import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import {
  Typeahead
} from 'react-bootstrap-typeahead';

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
    youtype: "Youtube"
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
    console.log("uriType " + uriType + " uri " + uri);
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
              this.props.refresh(this.props.tree, this.props.item.types[0].slug, this.props.item.slugs);
              this.setState({ uri: '', uriType: ''});
              this.close();
            });

          });

      });
    this.close();
  }

  getHref(uriType, theUri, name) {
    if(uriType === 'spotifyUri') {
      var splitSpotifyId = theUri.split(":");
      var spotifyType = splitSpotifyId[splitSpotifyId.length-2];
      var spotifyId = splitSpotifyId[splitSpotifyId.length-1];
      var theUrl = "https://open.spotify.com/" + spotifyType + "/" + spotifyId;
      return (<a target="_blank" href={theUrl}>{name}</a>);
    } else if(uriType === 'wikipedia') {
      var splitWikipediaUrl = theUri.split("/");
      var pageName = splitWikipediaUrl[splitWikipediaUrl.length-1].replace(/_/g, ' ');
      return (<a target="_blank" href={theUri}>{pageName}</a>);
    } else {
      return (<a target="_blank" href={theUri}>{name}</a>);
    }
  }

  render() {
    let links = (Object.keys(this.props.item.uris).map((uriType) => {
      let uriHeadName = this.uriTypes[uriType];
      let uriHead = (<h2><small>{uriHeadName}</small></h2>);
      let theUris = this.props.item.uris[uriType].map((theUri) => {
        return this.getHref(uriType, theUri, this.props.item.name);
      });
      return (
        <div>
          {uriHead}
          <ul className="list-unstyled">
          {theUris}
        </ul>
        </div>
      );
    }));

    return (
      <div>
          {links}
          <h2><small>Add Link</small></h2>
          <Button bsStyle="link" onClick={this.open}><Glyphicon glyph="plus" /></Button>

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
