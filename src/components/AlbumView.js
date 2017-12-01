import React, { Component } from 'react'

import ArtistView from './ArtistView.js'
import {
  Button
} from 'react-bootstrap'
import PlayButton from './PlayButton'

class AlbumView extends Component {

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
        <ArtistView dispatch={this.props.dispatch}
                    mediaItems={this.props.mediaItems}
                    uriInfos={this.props.uriInfos}
                    artist={artist}
                    digest='true'/>
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
