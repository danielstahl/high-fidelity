
import React, { Component } from 'react'
import {
  Row, Col, Grid, Panel
} from 'react-bootstrap'
import GenreForm from '../forms/GenreForm'
import * as actions from '../actions/index'

class GenresMainView extends Component {

  constructor(props) {
    super(props)
    this.makeGenreRow = this.makeGenreRow.bind(this)
    this.handleGenreClick = this.handleGenreClick.bind(this)
  }

  createGroupedArray(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize))
    }
    return groups
  }

  handleGenreClick(genreSlugs) {
    this.props.dispatch(actions.setMediaItemGraph(genreSlugs, 'genre'))
  }

  makeGenreRow(genres, rowIndex) {
    let genresCols = genres.map(genre => {
      return (
        <Col key={genre.slugs} md={4}>
          <Panel onClick={() => this.handleGenreClick(genre.slugs)}>
            <h2>{genre.name}</h2>
          </Panel>
        </Col>)
    })

    return (
      <Row key={rowIndex}>
        {genresCols}
      </Row>
    )
  }

  render() {
    const genres = this.props.graph
    let genreGroups= (this.createGroupedArray(genres.genres, 3).map(this.makeGenreRow));

    return(
      <Grid>
        {genreGroups}
        <Row>
          <Col md={4}>
            <GenreForm mediaItemHandler={this.props.mediaItemHandler}/>
          </Col>
          <Col md={8}></Col>
        </Row>
      </Grid>
    )
  }
}

export default GenresMainView
