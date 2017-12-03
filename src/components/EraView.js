import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel, Button
} from 'react-bootstrap'

import * as actions from '../actions/index'
import LinksView from './LinksView'
import AddLinkForm from '../forms/AddLinkForm'
import ComposerForm from '../forms/ComposerForm'

class EraView extends Component {
  constructor(props) {
    super(props)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
    this.handleComposerClick = this.handleComposerClick.bind(this)
  }

  handleGenreCLick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.eraGraph.genre.slugs, 'genre'))
  }

  handleComposerClick(composerSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(composerSlugs, 'composer'))
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(undefined, 'root'))
  }

  render() {
    let composers
    composers = this.props.eraGraph.composers.map(composer => {
      return (
        <li key={composer.slugs}>
          <Button bsStyle="link" onClick={() => this.handleComposerClick(composer.slugs)}>{composer.name}</Button>
        </li>
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
                <li><AddLinkForm item={this.props.eraGraph.era}
                                 mediaItemHandler={this.props.mediaItemHandler}
                                 mediaItems={this.props.mediaItems}/></li>
                 <li><ComposerForm era={this.props.eraGraph.era}
                                   genre={this.props.eraGraph.genre}
                                   mediaItemHandler={this.props.mediaItemHandler}/></li>
              </ul>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default EraView
