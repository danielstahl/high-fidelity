import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel
} from 'react-bootstrap';

import Actions from './MediaItemGraphActions.js';
import AddLinkForm from './AddLinkForm.js';
import LinksView from './LinksView.js';
import AlbumView from './AlbumView.js';

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
    let albums;
    albums = (this.props.artistGraph.albums.map((album) => {
      return (
        <li key={album.slugs}><AlbumView user={this.props.user} albumGraph={album} play={this.props.play} setGraph={this.props.setGraph}/></li>
      );
    }))

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

              <LinksView item={this.props.artistGraph} play={this.props.play} />

              <h2><small>Albums</small></h2>
              <ul className="list-unstyled">
                {albums}
              </ul>
            </Panel>
          </Col>
          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><AddLinkForm refresh={this.refresh} user={this.props.user} item={this.props.artistGraph.artist}/></li>
              </ul>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {
    let component;
    if(this.props.digest === 'true') {
      component = (
        <li key={this.props.artist.slugs}><a href="#" onClick={this.handleArtistCLick}>{this.props.artist.name}</a></li>
      );
    } else {
      component = this.getArtistView();
    }

    return component;
  }
}

export default ArtistView;
