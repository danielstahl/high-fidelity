import React, { Component } from 'react';

import PlayButton from './PlayButton'

class LinksView extends Component {
  render() {
    const links = this.props.graph.uris.map(theUri => {
      if(theUri.uriType === 'spotifyPlaylist') {
        const uris = [theUri.uri]
        return (<li key={theUri.uri}><PlayButton name={theUri.name} uris={uris}/></li>)
      } else {
        return (<li key={theUri.uri}><a target="_blank" href={theUri.url}>{theUri.name}</a></li>)
      }
    })

    return (
      <ul className="list-unstyled">
        {links}
      </ul>
    )
  }
}

export default LinksView
