import React, { Component } from 'react';

import {
  Row, Col, Grid, Panel
} from 'react-bootstrap';

import GenreForm from './GenreForm.js';

class GenreView extends Component {
  constructor(props) {
    super(props);
    this.state = {main: true, genres: []};
    this.onItemClick = this.onItemClick.bind(this);
    this.onGenreMainClick = this.onGenreMainClick.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:8080/media-items/genre')
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      this.setState({genres: result.mediaItems})
    });
  }

  onItemClick(tree, type, slugs) {
    fetch('http://localhost:8080/genre-tree/' + tree + '/' + type + '/' + slugs)
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      this.setState({
        main: false,
        tree: tree,
        item: result.mediaItem,
        children: result.children,
        breadCrumbs: result.breadCrumbs})
    });
  }

  onGenreMainClick() {
    this.setState({main: true});
  }

  render() {
      let page;
      if(this.state.main) {
        page = (<GenreMain genres={this.state.genres} onItemClick={this.onItemClick}/>);
      } else {
        page = (<GenreTree tree={this.state.tree} item={this.state.item} children={this.state.children} breadCrumbs={this.state.breadCrumbs} onItemClick={this.onItemClick} onGenreMainClick={this.onGenreMainClick}/>)
      }
    return (page);
  }
}

class GenreMain extends Component {
  constructor(props) {
    super(props);
    this.makeGenreRow = this.makeGenreRow.bind(this);
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
      return (<Col md={4}>
        <GenrePanel onItemClick={this.props.onItemClick} genre={genre}/>
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
      genreGroups = (this.createGroupedArray(this.props.genres, 3).map(this.makeGenreRow));
    }

    return(
      <Grid>
        {genreGroups}
        <Row>
          <Col md={4}>
            <GenreForm/>
            </Col>
          <Col md={8}></Col>
        </Row>
      </Grid>
    );
  }
}

class GenrePanel extends Component {
  constructor(props) {
    super(props);
    this.handleArtistClick = this.handleArtistClick.bind(this);
    this.handleComposerClick = this.handleComposerClick.bind(this);
  }

  handleArtistClick(e) {
    e.preventDefault();
    this.props.onItemClick('artist', 'genre', this.props.genre.slugs);
  }

  handleComposerClick(e) {
    e.preventDefault();
    this.props.onItemClick('composer', 'genre', this.props.genre.slugs);
  }

  render() {
    return(<Panel>
      <h2>{this.props.genre.name}</h2>
      <ul className="list-unstyled">
        <li><a href="#" onClick={this.handleArtistClick}>Artists</a></li>
        {this.props.genre.slugs === 'classical' &&
        <li><a href="#" onClick={this.handleComposerClick}>Composers</a></li>
        }
      </ul>
    </Panel>);
  }
}

class GenreTree extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="container">
        <BreadCrumbsItems tree={this.props.tree} breadCrumbs={this.props.breadCrumbs} item={this.props.item} onItemClick={this.props.onItemClick} onGenreMainClick={this.props.onGenreMainClick}/>
        <CurrentItem tree={this.props.tree} item={this.props.item} onItemClick={this.props.onItemClick}/>
        <ChildrenItem tree={this.props.tree} children={this.props.children} onItemClick={this.props.onItemClick}/>
      </div>
    );
  }
}

class CurrentItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      this.props.onItemClick(this.props.tree, this.props.item.types[0].slug, this.props.item.slugs);
    }
  }

  render() {
    let item;

    if(this.props.item) {
      item = (
        <h1><small>{this.props.item.types[0].name}</small> {this.props.item.name}</h1>
      );
    }

    return(
      <div className="row">
        {item}
      </div>
    );
  }
}

class BreadCrumbItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      this.props.onItemClick(this.props.tree, this.props.item.theType.slug, this.props.item.slugs);
    }
  }

  render() {
    return(
      <li><a href="#" onClick={this.handleClick}>{this.props.item.name}</a></li>
    );
  }
}

class BreadCrumbsItems extends Component {

  render() {
    let breadCrumbs;

    breadCrumbs = (this.props.breadCrumbs.links.map((crumb) =>
      <BreadCrumbItem tree={this.props.tree} item={crumb} onItemClick={this.props.onItemClick}/>
    ));

    let currentItem;
    if(this.props.item) {
      currentItem = (<li className="active">{this.props.item.name}</li>);
    }

    return (
      <div className="row">
        <ol className="breadcrumb">
          <li><a href="#" onClick={this.props.onGenreMainClick}>All genres</a></li>
          {breadCrumbs}
          {currentItem}
        </ol>
      </div>
    );
  }
}

class ChildItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      console.log(this.props.item);
      this.props.onItemClick(this.props.tree, this.props.item.theType.slug, this.props.item.slugs);
    }
  }

  render() {
    return(
      <div>
        <dt><a href="#" onClick={this.handleClick}>{this.props.item.name}</a></dt>
        <dd>{this.props.item.theType.name}</dd>
      </div>
    );
  }
}

class ChildrenItem extends Component {

  render() {
    let childrenItems;
    if(this.props.children) {
      childrenItems = (this.props.children.children.map((childItem) =>
        <ChildItem tree={this.props.tree} item={childItem} onItemClick={this.props.onItemClick}/>
      ));
    }

    return(
      <div className="row">
        <dl>
          {childrenItems}
        </dl>
      </div>
    );
  }
}

export default GenreView;
