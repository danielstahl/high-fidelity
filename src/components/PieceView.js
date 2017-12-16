import React, { Component } from 'react'

import {
  Row, Col, Grid, Panel, Button, Image
} from 'react-bootstrap'

import * as actions from '../actions/index'
import LinksView from './LinksView'
import AddLinkForm from '../forms/AddLinkForm'
import PlayButton from './PlayButton'
import Utils from '../services/Utils'
import Builders from '../services/Builders'
import Spotify from '../services/Spotify'
import { connect } from 'react-redux'

class PieceView extends Component {

  constructor(props) {
    super(props)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleEraClick = this.handleEraClick.bind(this)
    this.handleComposerClick = this.handleComposerClick.bind(this)
    this.getRecordingView = this.getRecordingView.bind(this)
    this.handleArtistClick = this.handleArtistClick.bind(this)
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(undefined, 'root'))
  }

  handleEraClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.pieceGraph.era.slugs, 'era'))
  }

  handleGenreCLick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.pieceGraph.genre.slugs, 'genre'))
  }

  handleComposerClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.pieceGraph.composer.slugs, 'composer'))
  }

  handleArtistClick(artistSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(artistSlugs, 'artist'))
  }

  getAlbumThumbnail(recording) {
    const spotifyAlbumUri = Builders.getUriHead(recording, 'spotifyUri')

    const spotifyAlbumUriContent = this.getSpotifyUriContent(spotifyAlbumUri)
    let albumImage
    if(spotifyAlbumUriContent) {
      albumImage = Utils.getLastUrl(spotifyAlbumUriContent.content.images)
    }
    return albumImage
  }

  getSpotifyUriContent(spotifyUri) {
    return Spotify.getSpotifyUriContent(spotifyUri, this.props.spotifyUser, this.props.dispatch, this.props.spotifyUriContent)
  }

  getRecordingView(piece, recordingGraph) {
    const artists = recordingGraph.artists.map(artist => {
      return (
        <li key={artist.slugs}>
          <Button bsStyle="link" onClick={() => this.handleArtistClick(artist.slugs)}><span className="text-muted"><i>artist</i></span> {artist.name}</Button>
        </li>
      )
    })

    let movements
    if(piece.movements) {
      movements = piece.movements.map((movement, idx) => {
        return (
          <li key={movement}>
            <PlayButton name={movement}
                        uris={[recordingGraph.recording.uris.recordingUri[idx]]}/></li>
        )
      })
    }

    const albumThumbnail = this.getAlbumThumbnail(recordingGraph.recording)
    const thumbnailComponent = (<Image src={albumThumbnail} rounded />)

    return (
      <div key={recordingGraph.recording.slugs}>
        {thumbnailComponent}
        <PlayButton name={recordingGraph.recording.name}
                    uris={recordingGraph.recording.uris.recordingUri}/>

        <ul className="list-inline">
          {artists}
        </ul>

        <ul className="list-unstyled">
          {movements}
        </ul>
      </div>
    )
  }

  render() {

    let movements
    if(this.props.pieceGraph.piece.movements) {
      movements = (
        <div>
          <h2><small>Movements</small></h2>
          <ul className="list-unstyled">
            {this.props.pieceGraph.piece.movements.map(movement =>
              <li key={movement}>{movement}</li>
            )}
          </ul>
        </div>
      )
    }

    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li><Button bsStyle="link" onClick={this.handleGenreMainClick}>All genres</Button></li>
            <li><Button bsStyle="link" onClick={this.handleGenreCLick}>{this.props.pieceGraph.genre.name}</Button></li>
            <li><Button bsStyle="link" onClick={this.handleEraClick}>{this.props.pieceGraph.era.name}</Button></li>
            <li><Button bsStyle="link" onClick={this.handleComposerClick}>{this.props.pieceGraph.composer.name}</Button></li>
            <li className="active">{this.props.pieceGraph.piece.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              <h1>{this.props.pieceGraph.composer.name}</h1>
              <h2><small>piece</small> {this.props.pieceGraph.piece.name}</h2>

              <LinksView graph={this.props.pieceGraph} />

              {movements}

              <h2><small>Recordings</small></h2>

              {this.props.pieceGraph.recordings.map(recording =>
                this.getRecordingView(this.props.pieceGraph.piece, recording)
              )}
            </Panel>
          </Col>

          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><AddLinkForm item={this.props.pieceGraph.piece}
                                 mediaItemHandler={this.props.mediaItemHandler}
                                 mediaItems={this.props.mediaItems}/></li>
              </ul>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    spotifyUser: state.spotifyStateReducers.spotifyUser
  }
}

export default connect(mapStateToProps)(PieceView)
