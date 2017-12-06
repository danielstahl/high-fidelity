import React, { Component } from 'react';

import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl, Form
} from 'react-bootstrap';

import Utils from '../services/Utils'
import SpotifyBuilders from '../services/SpotifyBuilders'
import { connect } from 'react-redux'


class AlbumForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      albumUri: '',
      albumInfo: undefined
    }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.fetchAlbumInfo = this.fetchAlbumInfo.bind(this)
    this.handleAlbumUriChange = this.handleAlbumUriChange.bind(this)
    this.createAlbum = this.createAlbum.bind(this)
  }

  close() {
    this.setState({
      showModal: false,
      albumUri: '',
      albumInfo: undefined
    })
  }

  open() {
    this.setState({
      showModal: true
    })
  }

  handleAlbumUriChange(e) {
    this.setState({
      albumUri: e.target.value
    })
  }

  makeAlbumInfo(spotifyAlbum, mediaItems) {
    const albumArtistInfos = spotifyAlbum.artists
      .map(spotifyArtist => SpotifyBuilders.makeSpotifyAlbumArtistInfo(spotifyArtist, mediaItems))
    return {
      spotifyUri: spotifyAlbum.uri,
      name: spotifyAlbum.name,
      imageUri: Utils.getLastUrl(spotifyAlbum.images),
      artists: albumArtistInfos
    }
  }

  fetchAlbumInfo(event) {
    event.preventDefault()
    const accessToken = this.props.spotifyUser.accessToken

    const uriParts = this.state.albumUri.split(':')
    const albumId = uriParts[uriParts.length - 1]

    fetch("https://api.spotify.com/v1/albums/" + albumId, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }).then(result => {
      if (!result.ok) {
        throw result
      }
      return result.json()
    }).then(spotifyAlbumResult => {
      const albumInfo = this.makeAlbumInfo(spotifyAlbumResult, this.props.mediaItems)
      console.log(albumInfo)
      this.setState({
        albumInfo: albumInfo
      })
    }).catch(error => {
      if(error.status === 401) {
        this.handlelogin()
      }
      console.log("Error", error)
    })
  }

  createAlbum(event) {
    event.preventDefault()
    if(this.state.albumInfo) {
      let artists = this.state.albumInfo.artists
        .filter((artist) => artist.artistTypes.includes('artist'))
        .map((artist) => artist.slugs)

      let composers = this.state.albumInfo.artists
        .filter((artist) => artist.artistTypes.includes('composer'))
        .map((artist) => artist.slugs)

      let name = this.state.albumInfo.name
      let nameSlug = Utils.slug(name)
      let albumId = artists[0] + ":" + nameSlug

      let newAlbumMediaItem = {
        slugs: albumId,
        name: name,
        types: ['album'],
        uris: {spotifyUri: [this.state.albumInfo.spotifyUri]},
        tags: {
          genre: [this.props.genre.slugs],
          artist: artists,
          composer: composers
        }
      }
      console.log("newAlbumMediaItem", newAlbumMediaItem)
      this.props.mediaItemHandler.addMediaItem(newAlbumMediaItem)
      this.close()
    }
  }

  renderAlbumInfoArtist(artist) {
    let artistTypes = artist.artistTypes.join();
    if(artist.slugs) {
      return (<li key={artist.spotifyUri}><i>{artistTypes}</i> {artist.name} <Glyphicon glyph="ok" /></li>)
    } else {
      return (<li key={artist.slugs}>{artist.name} <Glyphicon glyph="remove" /></li>)
    }
  }

  render() {
    let albumInfoView, createAlbumForm;
    if(this.state.albumInfo) {
      albumInfoView = (
      <div>
        <h3><img alt={this.state.albumInfo.name} src={this.state.albumInfo.imageUri}/> {this.state.albumInfo.name}</h3>
        <ul className="list-inline">
        {this.state.albumInfo.artists.map(artist =>
          {return this.renderAlbumInfoArtist(artist)}
        )}
        </ul>
      </div>)

      createAlbumForm = (
        <Form inline onSubmit={this.createAlbum}>
          <Button type="submit">Create Album</Button>
        </Form>
      )
    }

    return (
      <div>
          <Button bsStyle="link" onClick={this.open}>Add Album</Button>

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
    )
  }
}

const mapStateToProps = state => {
  return {
    spotifyUser: state.spotifyStateReducers.spotifyUser
  }
}

export default connect(mapStateToProps)(AlbumForm)
