import React, { Component } from 'react'

import {
  Row, Col, Grid, Panel, Button
} from 'react-bootstrap'
import { connect } from 'react-redux'
import Builders from '../services/Builders'
import * as actions from '../actions/index'
import LinksView from './LinksView'
import ArtistView from './ArtistView'
import EraView from './EraView'

class GenreView extends Component {

  constructor(props) {
    super(props)
    this.handleGenreClick = this.handleGenreClick.bind(this)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
  }

  handleGenreClick(e) {
    e.preventDefault()
    var genreGraph = Builders.getGenreGraph(this.props.genre.slugs, this.props.mediaItems, this.props.uriInfos)
    this.props.dispatch(actions.setMediaItemGraph(genreGraph))
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    var genresGraph = Builders.getGenresGraph(this.props.mediaItems)
    this.props.dispatch(actions.setMediaItemGraph(genresGraph))
  }

  getGenreView() {
    let artistsWithoutInstruments;
    if(this.props.genreGraph.artists) {
      artistsWithoutInstruments = this.props.genreGraph.artists.map(artist => {
        return (
          <ArtistView artist={artist} digest='true'/>
        )
      })
    }

    let instrumentArtists;
    instrumentArtists = this.props.genreGraph.instruments.map(instrumentGraph => {
      return (
        <div>
          <h3><small>{instrumentGraph.instrument.name}</small></h3>
          <ul className="list-inline">
          {instrumentGraph.artists.map((artist) =>
            <ArtistView artist={artist} digest='true'/>
          )}
        </ul>
      </div>
      )
    })

    let eras;
    if(this.props.genreGraph.eras) {
      eras = this.props.genreGraph.eras.map(era => {
        return (
          <EraView era={era} digest='true'/>
        )
      })
    }

    return (

      <Grid>

        <Row>
          <ol className="breadcrumb">
            <li><Button onClick={this.handleGenreMainClick} bsStyle="link">All genres</Button></li>
            <li className="active">{this.props.genreGraph.genre.name}</li>
          </ol>
        </Row>

        <Row>
          <Col md={8}>
            <Panel>
              <h1><small>genre</small> {this.props.genreGraph.genre.name}</h1>

              <LinksView graph={this.props.genreGraph}/>

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

              </ul>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {

    let component

    if(this.props.digest === 'true') {
      component = (
        <Panel onClick={this.handleGenreClick}>
          <h2>{this.props.genre.name}</h2>
        </Panel>
      )
    } else {
      component = component = this.getGenreView()
    }
    // Get the genreGraph through the this.props.genreGraph passed
    // down from the MediaItemGraphView
    return component
  }
}

export default connect()(GenreView)
