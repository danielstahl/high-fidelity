import React, { Component } from 'react';

import PlayButton from '../PlayButton.js';

class LinksView extends Component {
  render() {
    let links;
    links = this.props.item.uris.map((theUri) => {
      if(theUri.uriType === 'spotifyPlaylist') {
        let uris = [theUri.uri];
        return (<PlayButton name={theUri.name} play={this.props.play} uris={uris}/>);
      } else {
        return (<li key={theUri.url}><a target="_blank" href={theUri.url}>{theUri.name}</a></li>);
      }
    });

    return (
      <ul className="list-unstyled">
        {links}
      </ul>
    );
  }
}

export default LinksView;
