import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel, Glyphicon, Button
} from 'react-bootstrap';

import Actions from './MediaItemGraphActions.js';
import AlbumForm from './AlbumForm.js';

class ArtistView extends Component {

  constructor(props) {
    super(props);
    this.handleArtistCLick = this.handleArtistCLick.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this);
    this.handleGenreCLick = this.handleGenreCLick.bind(this);
  }

  handleArtistCLick(e) {
    e.preventDefault();
    this.refresh();
  }

  refresh() {
    let slugs;
    if(this.props.digest === 'true') {
      slugs = this.props.artist.slugs;
    } else {
      slugs = this.props.artistGraph.artist.slugs;
    }
    Actions.fetchArtistGraph(this.props.user, slugs, this.props.setGraph);
  }

  handleGenreCLick(e) {
    e.preventDefault();
    Actions.fetchGenreGraph(this.props.user, this.props.artistGraph.genre.slugs, this.props.setGraph);
  }

  handleGenreMainClick(e) {
    e.preventDefault();
    Actions.fetchGenres(this.props.user, this.props.setGraph);
  }

  getArtistView() {
    console.log(this.props.artistGraph);
    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li><a href="#" onClick={this.handleGenreMainClick}>All genres</a></li>
            <li><a href="#" onClick={this.handleGenreCLick}>{this.props.artistGraph.genre.name}</a></li>
            <li className="active">{this.props.artistGraph.artist.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              <h1><small>artist</small> {this.props.artistGraph.artist.name}</h1>
            </Panel>
          </Col>
        </Row>
        <Col md={4}>
          <Panel>
          </Panel>
        </Col>
      </Grid>
    );
  }

  render() {
    let component;
    if(this.props.digest === 'true') {
      component = (
        <li><a href="#" onClick={this.handleArtistCLick}>{this.props.artist.name}</a></li>
      );
    } else {
      component = this.getArtistView();
    }

    return component;
  }
}

export default ArtistView;
