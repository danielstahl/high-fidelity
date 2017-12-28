import React, { Component } from 'react'

import {
  Row, Col, Grid, Panel, Button, Image
} from 'react-bootstrap'
import * as actions from '../actions/index'
import LinksView from './LinksView'
import Builders from '../services/Builders'
import Spotify from '../services/Spotify'
import { connect } from 'react-redux'
import Utils from '../services/Utils'
import Wikipedia from '../services/Wikipedia'
import AddLinkForm from '../forms/AddLinkForm'
import PlayButton from './PlayButton'

class AlbumView extends Component {

  constructor(props) {
    super(props)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleArtistClick = this.handleArtistClick.bind(this)
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(undefined, 'root'))
  }

  handleGenreCLick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.albumGraph.genre.slugs, 'genre'))
  }

  handleArtistClick(artistSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(artistSlugs, 'artist'))
  }

  handleComposerClick(composerSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(composerSlugs, 'composer'))
  }

  getSpotifyUriContent(spotifyUri) {
    return Spotify.getSpotifyUriContent(spotifyUri, this.props.spotifyUser, this.props.dispatch, this.props.spotifyUriContent)
  }

  getWikipediaUrlContent(wikipediaUrl) {
    return Wikipedia.getWikipediaUrlContent(wikipediaUrl, this.props.dispatch, this.props.wikipediaUrlContent)
  }

  getAlbumImage(album) {
    const spotifyAlbumUri = Builders.getUriHead(album, 'spotifyUri')
    const spotifyAlbumUriContent = this.getSpotifyUriContent(spotifyAlbumUri)
    let albumImage
    if(spotifyAlbumUriContent) {
      const nrImages = spotifyAlbumUriContent.content.images.length
      if(nrImages >= 3) {
          albumImage = spotifyAlbumUriContent.content.images[nrImages - 2].url
      } else {
        albumImage = Utils.getLastUrl(spotifyAlbumUriContent.content.images)
      }

    }
    return albumImage
  }

  getAlbumTracks(album) {
    const spotifyAlbumUri = Builders.getUriHead(album, 'spotifyUri')
    const spotifyAlbumUriContent = this.getSpotifyUriContent(spotifyAlbumUri)
    let albumTracks
    if(spotifyAlbumUriContent) {
      albumTracks = spotifyAlbumUriContent.content.tracks.items.map(track => {
        return <li key={track.uri}><PlayButton name={track.name} uris={[spotifyAlbumUriContent.content.uri]} offset={track.track_number - 1}/></li>
      })
    }
    return albumTracks
  }

  render() {
    const albumImage = this.getAlbumImage(this.props.albumGraph.album)
    let albumImageCompoent
    if(albumImage) {
      albumImageCompoent = (<Image src={albumImage} rounded />)
    }

    let wikiComponent

    const wikipediaAlbumUri = Builders.getUriHead(this.props.albumGraph.album, 'wikipedia')
    if(wikipediaAlbumUri) {
      const content = this.getWikipediaUrlContent(wikipediaAlbumUri)
      if(content) {
        wikiComponent = (<div dangerouslySetInnerHTML={{__html: content.extract}}></div>)
      }
    }

    const composers = this.props.albumGraph.composers.map(composer => {
      return (
        <li key={composer.slugs}>
          <Button bsStyle="link" onClick={() => this.handleComposerClick(composer.slugs)} ><span className="text-muted"><i>composer</i></span> {composer.name}</Button>
        </li>
      )
    })

    const artists = this.props.albumGraph.artists.map(artist => {
      return (
        <li key={artist.slugs}>
          <Button bsStyle="link" onClick={() => this.handleArtistClick(artist.slugs)}><span className="text-muted"><i>artist</i></span> {artist.name}</Button>
        </li>
      )
    })

    let playComponent
    const spotifyUri = this.props.albumGraph.uris.find(uri => uri.uriType === 'spotifyUri')

    if(spotifyUri) {
      let uris = [spotifyUri.uri];
      playComponent = (<PlayButton uris={uris}/>)
    }

    const albumTracks = this.getAlbumTracks(this.props.albumGraph.album)

    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li><Button bsStyle="link" onClick={this.handleGenreMainClick}>All genres</Button></li>
            <li><Button bsStyle="link" onClick={this.handleGenreCLick}>{this.props.albumGraph.genre.name}</Button></li>
            <li><Button bsStyle="link" onClick={() => this.handleArtistClick(this.props.albumGraph.artists[0].slugs)}>{this.props.albumGraph.artists[0].name}</Button></li>
            <li className="active">{this.props.albumGraph.album.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              {albumImageCompoent}
              <h1><small>album</small> {this.props.albumGraph.album.name} {playComponent}</h1>

              <ul className="list-inline">
                {composers}
                {artists}
              </ul>

              {wikiComponent}

              <LinksView graph={this.props.albumGraph} />

              <h2><small>Tracks</small></h2>
              <ol>
                {albumTracks}
              </ol>
            </Panel>
          </Col>
          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><AddLinkForm item={this.props.albumGraph.album}
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

export default connect(mapStateToProps)(AlbumView)
