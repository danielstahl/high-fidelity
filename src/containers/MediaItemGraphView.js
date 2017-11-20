import React, { Component } from 'react';

import { connect } from 'react-redux'

import GenresMainView from '../components/GenresMainView'
import GenreView from '../components/GenreView'
import ArtistView from '../components/ArtistView'
import EraView from '../components/EraView'
import Builders from '../services/Builders'

class MediaItemGraphView extends Component {
  getGraphComponent() {
    switch(this.props.graphType) {
      case 'genre':
        return (<GenreView genreGraph={this.props.graph}
                           digest='false'
                           mediaItems={this.props.mediaItems}
                           uriInfos={this.props.uriInfos}
                           dispatch={this.props.dispatch}
                           mediaItemHandler={this.props.mediaItemHandler}/>)
      case 'artist':
        return (<ArtistView artistGraph={this.props.graph}
                            digest='false'
                            mediaItems={this.props.mediaItems}
                            uriInfos={this.props.uriInfos}
                            dispatch={this.props.dispatch}/>)
      case 'era':
        return (<EraView eraGraph={this.props.graph}
                         digest='false'
                         mediaItems={this.props.mediaItems}
                         uriInfos={this.props.uriInfos}
                         dispatch={this.props.dispatch}/>)
      case 'root':
      default:
        return (<GenresMainView
                  graph={this.props.graph}
                  mediaItems={this.props.mediaItems}
                  uriInfos={this.props.uriInfos}
                  user={this.props.user}
                  mediaItemHandler={this.props.mediaItemHandler}
                  dispatch={this.props.dispatch}/>)
    }
  }

  render() {
    return this.getGraphComponent()
  }
}

const getGraph = (graphType, mediaItemSlugs, mediaItems, uriInfos) => {
  switch(graphType) {
    case 'genre':
      return Builders.getGenreGraph(mediaItemSlugs, mediaItems, uriInfos)
    case 'artist':
      return Builders.getArtistGraph(mediaItemSlugs, mediaItems, uriInfos)
    case 'era':
      return Builders.getEraGraph(mediaItemSlugs, mediaItems, uriInfos)
    case 'root':
    default:
      return Builders.getGenresGraph(mediaItems)
  }
}

const mapStateToProps = state => {
  const graph = getGraph(state.mediaItemGraphReducers.graphType,
                         state.mediaItemGraphReducers.slugs,
                         state.mediaItemReducers,
                         state.uriInfoReducers)
  return {
    graph: graph,
    graphType: state.mediaItemGraphReducers.graphType,
    uriInfos: state.uriInfoReducers,
    user: state.userStateReducers.user,
  }
}

export default connect(mapStateToProps)(MediaItemGraphView)
