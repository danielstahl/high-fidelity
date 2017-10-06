import React, { Component } from 'react';

import PlayButton from '../PlayButton.js';

import ArtistView from './ArtistView.js';

class AlbumView extends Component {

  getSpotifyUri(uris) {
    return uris.find(uri => uri.uriType === 'spotifyUri')
  }

  render() {

    let composers;
    composers = (this.props.albumGraph.composers.map((composer) => {
      return (
        <li key={composer.slugs}><a href="#">{composer.name}</a></li>
    );
    }));

    let artists;
    artists = (this.props.albumGraph.artists.map((artist) => {
      return (
        <ArtistView user={this.props.user} setGraph={this.props.setGraph} artist={artist} digest='true'/>
    );
    }));

    let spotifyUri = this.getSpotifyUri(this.props.albumGraph.uris);
    let nameComponent;
    if(spotifyUri) {
      let uris = [spotifyUri.uri];
      nameComponent = (<PlayButton name={this.props.albumGraph.album.name} play={this.props.play} uris={uris}/>)
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
    );
  }
}

export default AlbumView;
