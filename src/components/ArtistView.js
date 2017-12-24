import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel, Button, Image
} from 'react-bootstrap'

import * as actions from '../actions/index'
import LinksView from './LinksView'
import AlbumDigestView from './AlbumDigestView'
import AlbumForm from '../forms/AlbumForm'
import AddLinkForm from '../forms/AddLinkForm'
import { connect } from 'react-redux'
import Builders from '../services/Builders'
import Utils from '../services/Utils'
import Spotify from '../services/Spotify'
import Wikipedia from '../services/Wikipedia'

class ArtistView extends Component {

  constructor(props) {
    super(props)
    this.state = { wikipediaContent: undefined}
    this.handleArtistClick = this.handleArtistClick.bind(this)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
  }

  handleArtistClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.artist.slugs, 'artist'))
  }

  handleGenreCLick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.artistGraph.genre.slugs, 'genre'))
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(undefined, 'root'))
  }

  getSpotifyUriContent(spotifyUri) {
    return Spotify.getSpotifyUriContent(spotifyUri, this.props.spotifyUser, this.props.dispatch, this.props.spotifyUriContent)
  }

  getWikipediaUrlContent(wikipediaUrl) {
    return Wikipedia.getWikipediaUrlContent(wikipediaUrl, this.props.dispatch, this.props.wikipediaUrlContent)
  }

  getArtistImage(artist) {
    const spotifyArtistUri = Builders.getUriHead(artist, 'spotifyUri')
    const spotifyArtistUriContent = this.getSpotifyUriContent(spotifyArtistUri)
    let artistImage
    if(spotifyArtistUriContent) {
      const nrImages = spotifyArtistUriContent.content.images.length
      if(nrImages >= 3) {
          artistImage = spotifyArtistUriContent.content.images[nrImages - 2].url
      } else {
        artistImage = Utils.getLastUrl(spotifyArtistUriContent.content.images)
      }
    }
    return artistImage
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
    let albums
    albums = this.props.artistGraph.albums.map(album => {
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

    const artistImage = this.getArtistImage(this.props.artistGraph.artist)
    let artistImageCompoent
    if(artistImage) {
      artistImageCompoent = (<Image src={artistImage} rounded />)
    }

    let wikiComponent

    const wikipediaArtistUri = Builders.getUriHead(this.props.artistGraph.artist, 'wikipedia')
    if(wikipediaArtistUri) {
      const content = this.getWikipediaUrlContent(wikipediaArtistUri)
      if(content) {
        wikiComponent = (<div dangerouslySetInnerHTML={{__html: content.extract}}></div>)
      }
    }

    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li key="main"><Button bsStyle="link" onClick={this.handleGenreMainClick}>All genres</Button></li>
            <li key="genre"><Button bsStyle="link" onClick={this.handleGenreCLick}>{this.props.artistGraph.genre.name}</Button></li>
            <li key="artist" className="active">{this.props.artistGraph.artist.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              {artistImageCompoent}
              <h1><small>artist</small> {this.props.artistGraph.artist.name}</h1>

              {wikiComponent}

              <LinksView graph={this.props.artistGraph} />

              <h2><small>Albums</small></h2>
              <ul className="list-unstyled">
                {albums}
              </ul>
            </Panel>
          </Col>
          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><AlbumForm genre={this.props.artistGraph.genre}
                               mediaItemHandler={this.props.mediaItemHandler}
                               mediaItems={this.props.mediaItems}/></li>
                <li><AddLinkForm item={this.props.artistGraph.artist}
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

export default connect(mapStateToProps)(ArtistView)
