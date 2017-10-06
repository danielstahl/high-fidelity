import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel
} from 'react-bootstrap';

import Actions from './MediaItemGraphActions.js';
import AddLinkForm from './AddLinkForm.js';
import LinksView from './LinksView.js';
import ComposerForm from './ComposerForm.js';

class EraView extends Component {
  constructor(props) {
    super(props);
    this.handleEraCLick = this.handleEraCLick.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleGenreMainClick = this.handleGenreMainClick.bind(this);
    this.handleGenreCLick = this.handleGenreCLick.bind(this);
  }

  handleEraCLick(e) {
    e.preventDefault();
    this.refresh();
  }

  handleGenreCLick(e) {
    e.preventDefault();
    Actions.fetchGenreGraph(this.props.user, this.props.eraGraph.genre.slugs, this.props.setGraph);
  }

  handleGenreMainClick(e) {
    e.preventDefault();
    Actions.fetchGenres(this.props.user, this.props.setGraph);
  }

  refresh() {
    let slugs;
    if(this.props.digest === 'true') {
      slugs = this.props.era.slugs;
    } else {
      slugs = this.props.eraGraph.era.slugs;
    }
    Actions.fetchEraGraph(this.props.user, slugs, this.props.setGraph);
  }

  getEraView() {
    let composers;
    composers = (this.props.eraGraph.composers.map((composer) => {
      return (
        <li><a href="#">{composer.name}</a></li>
    );
    }))

    return (
      <Grid>
        <Row>
          <ol className="breadcrumb">
            <li><a href="#" onClick={this.handleGenreMainClick}>All genres</a></li>
            <li><a href="#" onClick={this.handleGenreCLick}>{this.props.eraGraph.genre.name}</a></li>
            <li className="active">{this.props.eraGraph.era.name}</li>
          </ol>
        </Row>
        <Row>
          <Col md={8}>
            <Panel>
              <h1><small>era</small> {this.props.eraGraph.era.name}</h1>

              <LinksView item={this.props.eraGraph} play={this.props.play} />

              <h2><small>Composers</small></h2>
              <ul className="list-inline">
                {composers}
              </ul>

            </Panel>
          </Col>

          <Col md={4}>
            <Panel>
              <ul className="list-unstyled">
                <li><AddLinkForm refresh={this.refresh} user={this.props.user} item={this.props.eraGraph.era}/></li>
                <li><ComposerForm refresh={this.refresh} user={this.props.user} era={this.props.eraGraph.era} genre={this.props.eraGraph.genre}/></li>
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
        <li><a href="#" onClick={this.handleEraCLick}>{this.props.era.name}</a></li>
      );
    } else {
      component = this.getEraView();
    }

    return component;
  }
}

export default EraView;
