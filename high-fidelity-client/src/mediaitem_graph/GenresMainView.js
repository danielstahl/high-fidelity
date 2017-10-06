import React, { Component } from 'react';

import {
  Row, Col, Grid
} from 'react-bootstrap';

import GenreForm from './GenreForm.js';
import GenreView from './GenreView.js';
import Actions from './MediaItemGraphActions.js';

class GenresMainView extends Component {
  constructor(props) {
    super(props);
    this.makeGenreRow = this.makeGenreRow.bind(this);
  }

  componentDidMount() {
    Actions.fetchGenres(this.props.user, this.props.setGraph);
  }

  createGroupedArray(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  }

  makeGenreRow(genres) {
    let genresCols = (genres.map((genre) => {
      return (<Col key={genre.slugs} md={4}>
        <GenreView user={this.props.user} setGraph={this.props.setGraph} genre={genre} digest='true'/>
      </Col>);
    }));

    return (
      <Row>
        {genresCols}
      </Row>
    );
  }

  render() {
    let genreGroups;
    if(this.props.genres) {
      genreGroups = (this.createGroupedArray(this.props.genres.genres, 3).map(this.makeGenreRow));
    }

    return(
      <Grid>
        {genreGroups}
        <Row>
          <Col md={4}>
            <GenreForm user={this.props.user} setGraph={this.props.setGraph} />
          </Col>
          <Col md={8}></Col>
        </Row>
      </Grid>
    );
  }
}

export default GenresMainView;
