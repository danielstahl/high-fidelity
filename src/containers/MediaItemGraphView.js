import React, { Component } from 'react';

import { connect } from 'react-redux'

import GenresMainView from '../components/GenresMainView'
import GenreView from '../components/GenreView'

class MediaItemGraphView extends Component {
  getGraphComponent() {
    switch(this.props.graphType) {
      case 'genre':
        return (<GenreView genreGraph={this.props.graph}
                           digest='false'
                           mediaItems={this.props.mediaItems}
                           uriInfos={this.props.uriInfos}
                           dispatch={this.props.dispatch}/>)
      case 'root':
      default:
        return (<GenresMainView
                  mediaItems={this.props.mediaItems}
                  uriInfos={this.props.uriInfos}/>)
    }
  }

  render() {
    return this.getGraphComponent()
  }
}

const mapStateToProps = state => {
  return {
    graph: state.mediaItemGraphReducers.graph,
    graphType: state.mediaItemGraphReducers.graphType,
    uriInfos: state.uriInfoReducers
  }
}

export default connect(mapStateToProps)(MediaItemGraphView)
