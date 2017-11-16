import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel, Button
} from 'react-bootstrap'

import * as actions from '../actions/index'
import Builders from '../services/Builders'
import LinksView from './LinksView'
import AlbumView from './AlbumView'

class ArtistView extends Component {

  constructor(props) {
    super(props)
    this.handleArtistClick = this.handleArtistClick.bind(this)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
  }

  handleArtistClick(e) {
    e.preventDefault()
    var artistGraph = Builders.getArtistGraph(this.props.artist.slugs, this.props.mediaItems, this.props.uriInfos)
    this.props.dispatch(actions.setMediaItemGraph(artistGraph))
  }

  handleGenreCLick(e) {
    e.preventDefault()
    var genreGraph = Builders.getGenreGraph(this.props.artistGraph.genre.slugs, this.props.mediaItems, this.props.uriInfos)
    this.props.dispatch(actions.setMediaItemGraph(genreGraph))
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    var genresGraph = Builders.getGenresGraph(this.props.mediaItems)
    this.props.dispatch(actions.setMediaItemGraph(genresGraph))
  }

  getArtistView() {
    let albums
    albums = this.props.artistGraph.albums.map(album => {
      return (
        <li key={album.slugs}>
          <AlbumView albumGraph={album}
                     mediaItems={this.props.mediaItems}
                     dispatch={this.props.dispatch}
                     uriInfos={this.props.uriInfos}/>
        </li>
      )
    })

    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li key="main"><Button bsStyle="link" onClick={this.handleGenreMainClick}>All genres</Button></li>
            <li key="genre"><Button bsStyle="link" onClick={this.handleGenreCLick}>{this.props.artistGraph.genre.name}</Button></li>
            <li key="artist" className="active">{this.props.artistGraph.artist.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              <h1><small>artist</small> {this.props.artistGraph.artist.name}</h1>

              <LinksView graph={this.props.artistGraph} />

              <h2><small>Albums</small></h2>
              <ul className="list-unstyled">
                {albums}
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
    )

  }

  render() {
    let component
    if(this.props.digest === 'true') {
      component = (
        <li key={this.props.artist.slugs}>
          <Button bsStyle="link" onClick={this.handleArtistClick}>{this.props.artist.name}</Button>
        </li>
      )
    } else {
      component = this.getArtistView()
    }
    return component
  }
}

export default ArtistView
