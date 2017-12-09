import React, { Component } from 'react'
import PlayButton from './PlayButton'
import * as actions from '../actions/index'

class PieceDigestView extends Component {
  render() {
    return (
      <li key={this.props.pieceGraph.piece.slugs}>
        <PlayButton name={this.props.pieceGraph.piece.name}
                    uris={this.props.pieceGraph.recordings[0].uris}/>
      </li>
    )
  }
}

export default PieceDigestView
