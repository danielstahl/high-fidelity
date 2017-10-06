import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel
} from 'react-bootstrap';

import Actions from './MediaItemGraphActions.js';
import InstrumentForm from './InstrumentForm.js';
import MusicalFormForm from './MusicalFormForm.js';
import ArtistForm from './ArtistForm.js';
import AddLinkForm from './AddLinkForm.js';
import EraView from './EraView.js';
import EraForm from './EraForm.js';
import LinksView from './LinksView.js';
import ArtistView from './ArtistView.js';
import AlbumForm from './AlbumForm.js';

class GenreView extends Component {
  constructor(props) {
    super(props);
    this.handleGenreCLick = this.handleGenreCLick.bind(this);
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  handleGenreCLick(e) {
    e.preventDefault();
    this.refresh();
  }

  refresh() {
    let slugs;
    if(this.props.digest === 'true') {
      slugs = this.props.genre.slugs;
    } else {
      slugs = this.props.genreGraph.genre.slugs;
    }
    Actions.fetchGenreGraph(this.props.user, slugs, this.props.setGraph);
  }

  handleGenreMainClick(e) {
    e.preventDefault();
    Actions.fetchGenres(this.props.user, this.props.setGraph);
  }

  getGenreView() {
    let artistsWithoutInstruments;
    if(this.props.genreGraph.artists) {
      artistsWithoutInstruments = (this.props.genreGraph.artists.map((artist) => {
        return (
          <ArtistView user={this.props.user} setGraph={this.props.setGraph} artist={artist} digest='true'/>
        );
      }));
    }

    let instrumentArtists;
    instrumentArtists = (this.props.genreGraph.instruments.map((instrumentGraph) => {
      return (
        <div>
          <h3><small>{instrumentGraph.instrument.name}</small></h3>
          <ul className="list-inline">
          {instrumentGraph.artists.map((artist) =>
            <ArtistView user={this.props.user} setGraph={this.props.setGraph} artist={artist} digest='true'/>
          )}
        </ul>
      </div>
    );
    }))

    let eras;
    if(this.props.genreGraph.eras) {
      eras = (this.props.genreGraph.eras.map((era) => {
        return (
          <EraView user={this.props.user} setGraph={this.props.setGraph} era={era} digest='true'/>
        );
      }));
    }

    return (

      <Grid>

        <Row>
          <ol className="breadcrumb">
            <li><a href="#" onClick={this.handleGenreMainClick}>All genres</a></li>
            <li className="active">{this.props.genreGraph.genre.name}</li>
          </ol>
        </Row>

        <Row>
          <Col md={8}>
            <Panel>
              <h1><small>genre</small> {this.props.genreGraph.genre.name}</h1>

              <LinksView item={this.props.genreGraph} play={this.props.play} />

              <h2><small>Artists</small> </h2>
              <ul className="list-inline">
                {artistsWithoutInstruments}
              </ul>

              {instrumentArtists}

              <h2><small>Eras</small></h2>
              <ul className="list-inline">
                {eras}
              </ul>
            </Panel>
          </Col>
          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><InstrumentForm genre={this.props.genreGraph.genre} user={this.props.user}/></li>
                <li><MusicalFormForm genre={this.props.genreGraph.genre} user={this.props.user}/></li>
                <li><ArtistForm refresh={this.refresh} user={this.props.user} genre={this.props.genreGraph.genre}/></li>
                <li><EraForm refresh={this.refresh} user={this.props.user} genre={this.props.genreGraph.genre}/></li>
                <li><AddLinkForm refresh={this.refresh} user={this.props.user} item={this.props.genreGraph.genre}/></li>
                <li><AlbumForm refresh={this.refresh} user={this.props.user} genre={this.props.genreGraph.genre}/></li>
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
        <Panel onClick={this.handleGenreCLick}>
          <h2>{this.props.genre.name}</h2>
        </Panel>
      );
    } else {
      component = this.getGenreView();
    }

    return component;
  }
}

export default GenreView;
