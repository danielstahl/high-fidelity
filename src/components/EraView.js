import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel, Button
} from 'react-bootstrap'

import Builders from '../services/Builders'
import * as actions from '../actions/index'
import LinksView from './LinksView'

class EraView extends Component {
  constructor(props) {
    super(props)
    this.handleEraClick = this.handleEraClick.bind(this)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
  }

  handleEraClick(e) {
    e.preventDefault()
    var eraGraph = Builders.getEraGraph(this.props.era.slugs, this.props.mediaItems, this.props.uriInfos)
    this.props.dispatch(actions.setMediaItemGraph(eraGraph))
  }

  handleGenreCLick(e) {
    e.preventDefault()
    var genreGraph = Builders.getGenreGraph(this.props.eraGraph.genre.slugs, this.props.mediaItems, this.props.uriInfos)
    this.props.dispatch(actions.setMediaItemGraph(genreGraph))
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    var genresGraph = Builders.getGenresGraph(this.props.mediaItems)
    this.props.dispatch(actions.setMediaItemGraph(genresGraph))
  }

  getEraView() {
    let composers
    composers = this.props.eraGraph.composers.map(composer => {
      return (
        <li key={composer.slugs}><Button bsStyle="link">{composer.name}</Button></li>
      )
    })

    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li><Button bsStyle="link" onClick={this.handleGenreMainClick}>All genres</Button></li>
            <li><Button bsStyle="link" onClick={this.handleGenreCLick}>{this.props.eraGraph.genre.name}</Button></li>
            <li className="active">{this.props.eraGraph.era.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              <h1><small>era</small> {this.props.eraGraph.era.name}</h1>

              <LinksView graph={this.props.eraGraph} />

              <h2><small>Composers</small></h2>
              <ul className="list-inline">
                {composers}
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
        <li key={this.props.era.slugs}>
          <Button bsStyle="link" onClick={this.handleEraClick}>{this.props.era.name}</Button>
        </li>
      )
    } else {
      component = this.getEraView()
    }
    return component
  }
}

export default EraView
