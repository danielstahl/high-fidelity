import React, { Component } from 'react'

import {
  Row, Col, Grid, Panel, Button, Image
} from 'react-bootstrap'

import * as actions from '../actions/index'
import LinksView from './LinksView'
import AddLinkForm from '../forms/AddLinkForm'
import PieceForm from '../forms/PieceForm'
import AlbumForm from '../forms/AlbumForm'
import AlbumDigestView from './AlbumDigestView'
import PieceDigestView from './PieceDigestView'
import Builders from '../services/Builders'
import Spotify from '../services/Spotify'
import { connect } from 'react-redux'
import Utils from '../services/Utils'

class ComposerView extends Component {

  constructor(props) {
    super(props)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleEraClick = this.handleEraClick.bind(this)
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(undefined, 'root'))
  }

  handleEraClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.composerGraph.era.slugs, 'era'))
  }

  handleGenreCLick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.composerGraph.genre.slugs, 'genre'))
  }

  getSpotifyUriContent(spotifyUri) {
    return Spotify.getSpotifyUriContent(spotifyUri, this.props.spotifyUser, this.props.dispatch, this.props.spotifyUriContent)
  }

  getComposerImage(composer) {
    const spotifyComposerUri = Builders.getUriHead(composer, 'spotifyUri')
    const spotifyComposerUriContent = this.getSpotifyUriContent(spotifyComposerUri)
    let composerImage
    if(spotifyComposerUriContent) {
      composerImage = spotifyComposerUriContent.content.images[2].url
    }
    return composerImage
  }

  getAlbumThumbnail(album) {
    const spotifyAlbumUri = Builders.getUriHead(album, 'spotifyUri')

    const spotifyAlbumUriContent = this.getSpotifyUriContent(spotifyAlbumUri)
    let albumImage
    if(spotifyAlbumUriContent) {
      albumImage = Utils.getLastUrl(spotifyAlbumUriContent.content.images)
    }
    return albumImage
  }

  render() {
    const formPieces = this.props.composerGraph.form.map(formGraph => {
      return (
        <div key={formGraph.form.slugs}>
          <h3><small>{formGraph.form.name}</small></h3>
          <ul className="list-unstyled">
          {formGraph.pieces.map(piece =>
            <PieceDigestView pieceGraph={piece}
                             dispatch={this.props.dispatch}/>
          )}
        </ul>
      </div>
      )
    })

    const albums = this.props.composerGraph.albums.map(album => {
      const albumThumbnail = this.getAlbumThumbnail(album.album)
      return (
        <li key={album.album.slugs}>
          <AlbumDigestView albumGraph={album}
                           mediaItems={this.props.mediaItems}
                           dispatch={this.props.dispatch}
                           uriInfos={this.props.uriInfos}
                           thumbnail={albumThumbnail}/>
        </li>
      )
    })

    const composerImage = this.getComposerImage(this.props.composerGraph.composer)

    let composerImageCompoent
    if(composerImage) {
      composerImageCompoent = (<Image src={composerImage} rounded />)
    }

    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li><Button bsStyle="link" onClick={this.handleGenreMainClick}>All genres</Button></li>
            <li><Button bsStyle="link" onClick={this.handleGenreCLick}>{this.props.composerGraph.genre.name}</Button></li>
            <li><Button bsStyle="link" onClick={this.handleEraClick}>{this.props.composerGraph.era.name}</Button></li>
            <li className="active">{this.props.composerGraph.composer.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              {composerImageCompoent}
              <h1><small>composer</small> {this.props.composerGraph.composer.name}</h1>

              <LinksView graph={this.props.composerGraph} />

              <h2><small>Albums</small></h2>
              <ul className="list-unstyled">
                {albums}
              </ul>

              <h2><small>Pieces</small> </h2>
              {formPieces}
            </Panel>
          </Col>

          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><PieceForm composerGraph={this.props.composerGraph}
                               mediaItemHandler={this.props.mediaItemHandler}
                               mediaItems={this.props.mediaItems}/></li>
                <li><AddLinkForm item={this.props.composerGraph.composer}
                                 mediaItemHandler={this.props.mediaItemHandler}
                                 mediaItems={this.props.mediaItems}/></li>
                <li><AlbumForm genre={this.props.composerGraph.genre}
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

export default connect(mapStateToProps)(ComposerView)
