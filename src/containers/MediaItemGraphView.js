import React, { Component } from 'react';

import { connect } from 'react-redux'

import GenresMainView from '../components/GenresMainView'
import GenreView from '../components/GenreView'

class MediaItemGraphView extends Component {
  getGraphComponent() {
    switch(this.props.graphType) {
      case 'genre':
        return (<GenreView genreGraph={this.props.graph} digest='false' mediaItems={this.props.mediaItems} dispatch={this.props.dispatch}/>)
      case 'root':
      default:
        return (<GenresMainView mediaItems={this.props.mediaItems}/>)
    }
  }

  render() {
    return this.getGraphComponent()
  }
}

const mapStateToProps = state => {
  return {
    graph: state.mediaItemGraphReducers.graph,
    graphType: state.mediaItemGraphReducers.graphType
  }
}

export default connect(mapStateToProps)(MediaItemGraphView)
