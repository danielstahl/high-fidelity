import React, { Component } from 'react';

import PlayButton from './PlayButton'

class LinksView extends Component {
  render() {
    let links;
    links = this.props.graph.uris.map(theUri => {
      if(theUri.uriType === 'spotifyPlaylist') {
        return (<li key={theUri.uri}><PlayButton name={theUri.name}/></li>)
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
