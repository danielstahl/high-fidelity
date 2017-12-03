import React, { Component } from 'react'

import {
  Row, Col, Grid, Panel, Button
} from 'react-bootstrap'
import { connect } from 'react-redux'
import * as actions from '../actions/index'
import LinksView from './LinksView'
import AddLinkForm from '../forms/AddLinkForm'
import EraForm from '../forms/EraForm'
import InstrumentForm from '../forms/InstrumentForm'
import MusicalFormForm from '../forms/MusicalFormForm'
import ArtistForm from '../forms/ArtistForm'
import AlbumForm from '../forms/AlbumForm'

class GenreView extends Component {

  constructor(props) {
    super(props)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
    this.handleEraClick = this.handleEraClick.bind(this)
    this.handleArtistClick = this.handleArtistClick.bind(this)
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(undefined, 'root'))
  }

  handleEraClick(eraSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(eraSlugs, 'era'))
  }

  handleArtistClick(artistSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(artistSlugs, 'artist'))
  }

  render() {
    let artistsWithoutInstruments;
    if(this.props.genreGraph.artists) {
      artistsWithoutInstruments = this.props.genreGraph.artists.map(artist => {
        return (
          <li key={artist.slugs}>
            <Button bsStyle="link" onClick={() => this.handleArtistClick(artist.slugs)}>{artist.name}</Button>
          </li>
        )
      })
    }

    let instrumentArtists
    instrumentArtists = this.props.genreGraph.instruments.map(instrumentGraph => {
      return (
        <div key={instrumentGraph.instrument.slugs}>
          <h3><small>{instrumentGraph.instrument.name}</small></h3>
          <ul className="list-inline">
          {instrumentGraph.artists.map(artist =>
            <li key={artist.slugs}>
              <Button bsStyle="link" onClick={() => this.handleArtistClick(artist.slugs)}>{artist.name}</Button>
            </li>
          )}
        </ul>
      </div>
      )
    })

    let eras
    if(this.props.genreGraph.eras) {
      eras = this.props.genreGraph.eras.map(era => {
        return (
          <li key={era.slugs}>
            <Button bsStyle="link" onClick={() => this.handleEraClick(era.slugs)}>{era.name}</Button>
          </li>
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
                <li><AddLinkForm item={this.props.genreGraph.genre}
                                 mediaItemHandler={this.props.mediaItemHandler}
                                 mediaItems={this.props.mediaItems}/></li>
                <li><EraForm genre={this.props.genreGraph.genre}
                             mediaItemHandler={this.props.mediaItemHandler}/></li>
                <li><ArtistForm genre={this.props.genreGraph.genre}
                                mediaItemHandler={this.props.mediaItemHandler}/></li>
                <li><AlbumForm genre={this.props.genreGraph.genre}
                               mediaItemHandler={this.props.mediaItemHandler}
                               mediaItems={this.props.mediaItems}/></li>
                <li><InstrumentForm genre={this.props.genreGraph.genre}
                                    mediaItemHandler={this.props.mediaItemHandler}/></li>
                <li><MusicalFormForm genre={this.props.genreGraph.genre}
                                     mediaItemHandler={this.props.mediaItemHandler}/></li>

              </ul>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default connect()(GenreView)
