import React, { Component } from 'react'

import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl, Form, Checkbox
} from 'react-bootstrap';
import { connect } from 'react-redux'
import Builders from '../services/Builders'
import SpotifyBuilders from '../services/SpotifyBuilders'
import Utils from '../services/Utils'
import {
  Typeahead
} from 'react-bootstrap-typeahead'
const uuidBase62 = require('uuid-base62')

class PieceForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      albumUri: '',
      albumInfo: undefined,
      pieceTracks: [],
      pieceName: '',
      pieceMovements: [],
      instruments: [],
      forms: [],
      artists: []
    }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.fetchAlbumInfo = this.fetchAlbumInfo.bind(this)
    this.handleAlbumUriChange = this.handleAlbumUriChange.bind(this)
    this.makeAlbumInfo = this.makeAlbumInfo.bind(this)
    this.renderAlbumInfoTrack = this.renderAlbumInfoTrack.bind(this)
    this.handleCheckTrackPiece = this.handleCheckTrackPiece.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleMovementChange = this.handleMovementChange.bind(this)
    this.selectInstruments = this.selectInstruments.bind(this)
    this.selectForms = this.selectForms.bind(this)
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

  makeAlbumTrackInfo(spotifyTrack, mediaItems) {
    const albumTrackArtists = spotifyTrack.artists
      .map(spotifyArtist =>
        SpotifyBuilders.makeSpotifyAlbumArtistInfo(spotifyArtist, mediaItems))
    return {
      uri: spotifyTrack.uri,
      name: spotifyTrack.name,
      artists: albumTrackArtists
    }
  }

  makeAlbumInfo(spotifyAlbum, mediaItems) {
    const spotifyArtistUri = this.props.composerGraph.uris
      .find(uri => uri.uriType === 'spotifyUri').uri

    const albumArtistInfos = spotifyAlbum.artists
      .map(spotifyArtist => SpotifyBuilders.makeSpotifyAlbumArtistInfo(spotifyArtist, mediaItems))

    const albumTrackInfos = spotifyAlbum.tracks.items
      .filter(spotifyTrack => spotifyTrack.artists.some(artist => artist.uri === spotifyArtistUri))
      .map(spotifyTrack => this.makeAlbumTrackInfo(spotifyTrack, mediaItems))
    return {
      spotifyUri: spotifyAlbum.uri,
      name: spotifyAlbum.name,
      imageUri: Utils.getLastUrl(spotifyAlbum.images) ,
      tracks: albumTrackInfos,
      artists: albumArtistInfos
    }
  }

  createPiece = (e) => {
    e.preventDefault()
    const artists = this.state.artists
      .filter(artist => artist.artistTypes.includes('artist'))
      .map(artist => artist.slugs)

    const pieceSlug = 'piece:' + uuidBase62.v4()

    const newPieceMediaItem = {
      slugs: pieceSlug,
      name: this.state.pieceName,
      types: ['piece'],
      uris: {},
      tags: {
        genre: [this.props.composerGraph.genre.slugs],
        era: [this.props.composerGraph.era.slugs],
        composer: [this.props.composerGraph.composer.slugs],
        pieceMovements: this.state.pieceMovements,
        instruments: this.state.instruments,
        form: this.state.forms
      }
    }
    console.log("newPieceMediaItem", newPieceMediaItem)
    this.props.mediaItemHandler.addMediaItem(newPieceMediaItem)

    let recordingSlug = 'recording:' + uuidBase62.v4()

    let newRecordingMediaItem = {
      slugs: recordingSlug,
      name: this.state.albumInfo.name,
      types: ['recording'],
      uris: {
        spotifyUri: [this.state.albumInfo.spotifyUri],
        recordingUri: this.state.pieceTracks
      },
      tags: {
        genre: [this.props.composerGraph.genre.slugs],
        era: [this.props.composerGraph.era.slugs],
        composer: [this.props.composerGraph.composer.slugs],
        piece: [pieceSlug],
        artist: artists
      }
    }
    console.log("newRecordingMediaItem", newRecordingMediaItem)
    this.props.mediaItemHandler.addMediaItem(newRecordingMediaItem)
    this.close()
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
      this.setState({
        albumInfo: albumInfo,
        artists: albumInfo.artists
      })
    }).catch(error => {
      if(error.status === 401) {
        this.handlelogin()
      }
      console.log("Error", error)
    })
  }

  handleCheckTrackPiece(trackUri) {
    let newPieceTracks

    if(this.state.pieceTracks.includes(trackUri)) {
      newPieceTracks = this.state.pieceTracks.filter(uri => uri !== trackUri)
    } else {
      newPieceTracks = [...this.state.pieceTracks, trackUri]
    }
    const albumPieceTrackNames = this.state.albumInfo.tracks
      .filter(track => {
        return newPieceTracks.includes(track.uri)
      })
      .map(track => track.name)

    let pieceName = Utils.sharedStart(albumPieceTrackNames)
    if(pieceName.endsWith('I')) {
      pieceName = pieceName.slice(0, -1)
    }
    let reducedPieceTrackNames
    if(albumPieceTrackNames.length > 1) {
      reducedPieceTrackNames = albumPieceTrackNames
        .map(name => name.replace(pieceName, ''))
    } else {
      reducedPieceTrackNames = []
    }

    let newArtists = this.state.artists
    this.state.albumInfo.tracks
      .filter(track => {
        return newPieceTracks.includes(track.uri)
      })
      .forEach(track => {
        track.artists.forEach(trackArtist => {
          if(!newArtists.some(newArtist =>
              newArtist.spotifyUri === trackArtist.spotifyUri)) {
            newArtists.push(trackArtist)
          }
        })
      })

    this.setState({
      pieceTracks: newPieceTracks,
      pieceName: pieceName,
      pieceMovements: reducedPieceTrackNames,
      artists: newArtists
    })
  }

  renderAlbumInfoTrack(track) {
    return (
      <li key={track.uri}>
        <Checkbox checked={() => this.state.pieceTracks.includes(track.uri)}
                  onChange={() => this.handleCheckTrackPiece(track.uri)}>{track.name}</Checkbox>
      </li>)
  }

  handleNameChange(e) {
    e.preventDefault()
    const albumPieceTrackNames = this.state.albumInfo.tracks
      .filter(track => {
        return this.state.pieceTracks.includes(track.uri)
      })
      .map(track => track.name)

    const newPieceName = e.target.value

    let reducedPieceTrackNames
    if(albumPieceTrackNames.length > 1) {
      reducedPieceTrackNames = albumPieceTrackNames
        .map(name => name.replace(newPieceName, '').trim())
    } else {
      reducedPieceTrackNames = []
    }

    this.setState({
      pieceName: newPieceName,
      pieceMovements: reducedPieceTrackNames
    })
  }

  handleMovementChange = (idx) => (evt) => {
    evt.preventDefault()
    const newPieceMovements = this.state.pieceMovements.map((movement, movementIdx) => {
      if(idx === movementIdx) {
        return evt.target.value
      } else {
        return movement
      }
    })
    this.setState({
      pieceMovements: newPieceMovements
    })
  }

  selectInstruments(instruments) {
    let instrumentSlugs = instruments.map(instrument => instrument.slugs)
    this.setState({
      instruments: instrumentSlugs
    })
  }

  selectForms(forms) {
    let formSlugs = forms.map(form => form.slugs)
    this.setState({
      forms: formSlugs
    });
  }

  renderAlbumInfoArtist(artist) {
    let artistTypes = artist.artistTypes.join()
    if(artist.slugs) {
      return (<li key={artist.spotifyUri}><i>{artistTypes}</i> {artist.name} <Glyphicon glyph="ok" /></li>)
    } else {
      return (<li key={artist.slugs}>{artist.name} <Glyphicon glyph="remove" /></li>)
    }
  }

  render() {
    let albumInfoView, movementViews
    if(this.state.albumInfo) {

      albumInfoView = (
        <div>
          <h3><img alt={this.state.albumInfo.name} src={this.state.albumInfo.imageUri}/> {this.state.albumInfo.name}</h3>
          <ul className="list-inline">
            {this.state.artists.map(artist =>
              {return this.renderAlbumInfoArtist(artist)}
            )}
          </ul>
          <ul className="list-unstyled">
            {this.state.albumInfo.tracks.map(track =>
              {return this.renderAlbumInfoTrack(track)}
            )}
          </ul>
        </div>)

      if(this.state.pieceMovements.length > 0) {
        movementViews = (
          <FormGroup controlId="movementField">
            <ControlLabel>Movements</ControlLabel>
            {' '}
            <ul className="list-unstyled">
              {this.state.pieceMovements.map((movement, idx) =>
                {
                  return (
                    <li key={idx}>
                      <FormControl type="text" onChange={this.handleMovementChange(idx)} value={movement}></FormControl>
                    </li>
                  )
                }
              )}
            </ul>
          </FormGroup>
        )
      }
    }

    return (
      <div>
          <Button bsStyle="link" onClick={this.open}>Add Piece</Button>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New Piece for {this.props.composerGraph.composer.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1><small>New Piece for</small> {this.props.composerGraph.composer.name}</h1>
              <Form onSubmit={this.fetchAlbumInfo}>
                <FormGroup controlId="albumUriField">
                  <ControlLabel>Album URI that contain the piece</ControlLabel>
                  {' '}
                  <FormControl type="text" onChange={this.handleAlbumUriChange} value={this.state.albumUri}></FormControl>
                </FormGroup>
                {' '}
                <Button type="submit">Fetch album</Button>
              </Form>
              {albumInfoView}
              <Form onSubmit={this.createPiece}>
                <FormGroup controlId="nameField">
                  <ControlLabel>Name</ControlLabel>
                  {' '}
                  <FormControl type="text" onChange={this.handleNameChange} value={this.state.pieceName}></FormControl>
                </FormGroup>
                {movementViews}
                <FormGroup controlId="instrumentsField">
                  <ControlLabel>Instruments</ControlLabel>
                  <Typeahead multiple
                    onChange={this.selectInstruments}
                    options={this.props.instrumentChoises}
                    labelKey={option => `${option.name}`}/>
                </FormGroup>
                <FormGroup controlId="formsField">
                  <ControlLabel>Forms</ControlLabel>
                  <Typeahead multiple
                    onChange={this.selectForms}
                    options={this.props.formChoises}
                    labelKey={option => `${option.name}`}/>
                </FormGroup>
                <Button type="submit">Create Piece and recording</Button>
              </Form>

          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    instrumentChoises: Builders.getInstruments(state.mediaItemReducers,
                                               state.mediaItemGraphReducers.graphType,
                                               state.mediaItemGraphReducers.slugs),
    formChoises: Builders.getForms(state.mediaItemReducers,
                                   state.mediaItemGraphReducers.graphType,
                                   state.mediaItemGraphReducers.slugs),
    spotifyUser: state.spotifyStateReducers.spotifyUser
  }
}

export default connect(mapStateToProps)(PieceForm)
