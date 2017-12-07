import React, { Component } from 'react'

import {
  Row, Col, Grid, Panel, Button
} from 'react-bootstrap'

import * as actions from '../actions/index'
import LinksView from './LinksView'
import AddLinkForm from '../forms/AddLinkForm'
import PieceForm from '../forms/PieceForm'
import AlbumView from './AlbumView'

class ComposerView extends Component {

  constructor(props) {
    super(props)
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this)
    this.handleGenreCLick = this.handleGenreCLick.bind(this)
    this.handleEraClick = this.handleEraClick.bind(this)
  }

  handleGenreMainClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(undefined, 'root'))
  }

  handleEraClick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.composerGraph.era.slugs, 'era'))
  }

  handleGenreCLick(e) {
    e.preventDefault()
    this.props.dispatch(actions.setMediaItemGraph(this.props.composerGraph.genre.slugs, 'genre'))
  }


  render() {
    const formPieces = this.props.composerGraph.form.map(formGraph => {
      return (
        <div key={formGraph.form.slugs}>
          <h3><small>{formGraph.form.name}</small></h3>
          <ul className="list-inline">
          {formGraph.pieces.map(piece =>
            <li key={piece.slugs}>
              <Button bsStyle="link">{piece.name}</Button>
            </li>
          )}
        </ul>
      </div>
      )
    })

    const albums = this.props.composerGraph.albums.map(album => {
      return (
        <li key={album.album.slugs}>
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
            <li><Button bsStyle="link" onClick={this.handleGenreMainClick}>All genres</Button></li>
            <li><Button bsStyle="link" onClick={this.handleGenreCLick}>{this.props.composerGraph.genre.name}</Button></li>
            <li><Button bsStyle="link" onClick={this.handleEraClick}>{this.props.composerGraph.era.name}</Button></li>
            <li className="active">{this.props.composerGraph.composer.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              <h1><small>composer</small> {this.props.composerGraph.composer.name}</h1>

              <LinksView graph={this.props.composerGraph} />

              <h2><small>Albums</small></h2>
              <ul className="list-unstyled">
                {albums}
              </ul>

              <h2><small>Pieces</small> </h2>
              {formPieces}
            </Panel>
          </Col>

          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><PieceForm composerGraph={this.props.composerGraph}
                               mediaItemHandler={this.props.mediaItemHandler}
                               mediaItems={this.props.mediaItems}/></li>
                <li><AddLinkForm item={this.props.composerGraph.era}
                                 mediaItemHandler={this.props.mediaItemHandler}
                                 mediaItems={this.props.mediaItems}/></li>
              </ul>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default ComposerView
