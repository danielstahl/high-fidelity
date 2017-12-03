import React, { Component } from 'react'

import {
  Button
} from 'react-bootstrap'
import PlayButton from './PlayButton'
import * as actions from '../actions/index'

class AlbumView extends Component {

  constructor(props) {
    super(props)
    this.handleArtistClick = this.handleArtistClick.bind(this)
  }

  handleArtistClick(artistSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(artistSlugs, 'artist'))
  }

  getSpotifyUri(uris) {
    return uris.find(uri => uri.uriType === 'spotifyUri')
  }

  render() {
    let composers
    composers = this.props.albumGraph.composers.map(composer => {
      return (
        <li key={composer.slugs}><Button bsStyle="link">{composer.name}</Button></li>
      )
    })

    let artists
    artists = this.props.albumGraph.artists.map(artist => {
      return (
        <li key={artist.slugs}>
          <Button bsStyle="link" onClick={() => this.handleArtistClick(artist.slugs)}>{artist.name}</Button>
        </li>
      )
    })

    let nameComponent
    const spotifyUri = this.props.albumGraph.uris.find(uri => uri.uriType === 'spotifyUri')

    if(spotifyUri) {
      let uris = [spotifyUri.uri];
      nameComponent = (<PlayButton name={this.props.albumGraph.album.name} uris={uris}/>)
    } else {
      nameComponent = (<div>{this.props.albumGraph.album.name}</div>)
    }

    return (
      <div>
        {nameComponent}
        <ul className="list-inline">
          {composers}
          {artists}
        </ul>
      </div>
    )
  }
}

export default AlbumView
