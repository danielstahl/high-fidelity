
import React, { Component } from 'react'

import {
  Row, Col, Grid
} from 'react-bootstrap'

import GenreView from './GenreView'

import Builders from '../services/Builders'

class GenresMainView extends Component {

  constructor(props) {
    super(props)
    this.makeGenreRow = this.makeGenreRow.bind(this)
  }

  createGroupedArray(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups
  }

  makeGenreRow(genres, rowIndex) {
    let genresCols = (genres.map((genre) => {
      return (<Col key={genre.slugs} md={4}>
        <GenreView genre={genre} digest='true' mediaItems={this.props.mediaItems}/>
      </Col>);
    }));

    return (
      <Row key={rowIndex}>
        {genresCols}
      </Row>
    )
  }

  render() {
    var genres = Builders.getGenresGraph(this.props.mediaItems)
    let genreGroups= (this.createGroupedArray(genres.genres, 3).map(this.makeGenreRow));

    return(
      <Grid>
        {genreGroups}
        <Row>
          <Col md={4}>

          </Col>
          <Col md={8}></Col>
        </Row>
      </Grid>
    )
  }
}

export default GenresMainView
