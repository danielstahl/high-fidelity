import React, { Component } from 'react'
import PlayButton from './PlayButton'
import * as actions from '../actions/index'

class PieceDigestView extends Component {

  constructor(props) {
    super(props)
    this.handlePieceCLick = this.handlePieceCLick.bind(this)
  }

  handlePieceCLick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.pieceGraph.piece.slugs, 'piece'))
  }

  render() {
    return (
      <li key={this.props.pieceGraph.piece.slugs}>
        <PlayButton name={this.props.pieceGraph.piece.name}
                    uris={this.props.pieceGraph.recordings[0].recording.uris.recordingUri.uri}
                    action={this.handlePieceCLick}/>
      </li>
    )
  }
}

export default PieceDigestView
