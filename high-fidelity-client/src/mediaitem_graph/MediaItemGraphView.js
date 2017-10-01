import React, { Component } from 'react';

import GenresMainView from './GenresMainView.js';
import GenreView from './GenreView.js';
import EraView from './EraView.js';
import ArtistView from './ArtistView.js';

class MediaItemGraphView extends Component {
  constructor(props) {
    super(props);
    this.state = {graph: undefined};
    this.setGraph = this.setGraph.bind(this);
  }

  setGraph(graph) {
    this.setState({graph: graph});
  }

  getGraphComponent() {
    var graphComponent = (<GenresMainView user={this.props.user} genres={this.state.graph} setGraph={this.setGraph}/>);
    if(this.state.graph) {
      switch(this.state.graph.graphType) {
        case 'genre':
          graphComponent = (<GenreView user={this.props.user} setGraph={this.setGraph} genreGraph={this.state.graph} play={this.props.play} digest='false'/>);
          break;
        case 'era':
          graphComponent = (<EraView user={this.props.user} setGraph={this.setGraph} eraGraph={this.state.graph} play={this.props.play} digest='false'/>);
          break;
          case 'artist':
            graphComponent = (<ArtistView user={this.props.user} setGraph={this.setGraph} artistGraph={this.state.graph} play={this.props.play} digest='false'/>);
            break;
        case 'root':
        default:
      }
    }
    return graphComponent;
  }

  render() {
    return this.getGraphComponent();
  }
}

export default MediaItemGraphView;
