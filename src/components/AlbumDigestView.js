import React, { Component } from 'react'

import {
  Button, Image
} from 'react-bootstrap'
import PlayButton from './PlayButton'
import * as actions from '../actions/index'

class AlbumDigestView extends Component {

  constructor(props) {
    super(props)
    this.handleArtistClick = this.handleArtistClick.bind(this)
    this.handleAlbumClick = this.handleAlbumClick.bind(this)
  }

  handleArtistClick(artistSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(artistSlugs, 'artist'))
  }

  handleComposerClick(composerSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(composerSlugs, 'composer'))
  }

  handleAlbumClick(albumSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(albumSlugs, 'album'))
  }

  getSpotifyUri(uris) {
    return uris.find(uri => uri.uriType === 'spotifyUri')
  }

  render() {
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

    let nameComponent
    const spotifyUri = this.props.albumGraph.uris.find(uri => uri.uriType === 'spotifyUri')

    if(spotifyUri) {
      let uris = [spotifyUri.uri];
      nameComponent = (<PlayButton action={() => this.handleAlbumClick(this.props.albumGraph.album.slugs)} name={this.props.albumGraph.album.name} uris={uris}/>)
    } else {
      nameComponent = (<Button bsStyle="link" onCLick={() => this.handleAlbumClick(this.props.albumGraph.album.slugs)}>{this.props.albumGraph.album.name}</Button>)
    }

    let thumbnailComponent
    if(this.props.thumbnail) {
      thumbnailComponent = (<Image src={this.props.thumbnail} rounded />)
    }
    return (
      <div>
        {thumbnailComponent}
        {nameComponent}
        <ul className="list-inline">
          {composers}
          {artists}
        </ul>
        <br/>
      </div>
    )
  }
}

export default AlbumDigestView
