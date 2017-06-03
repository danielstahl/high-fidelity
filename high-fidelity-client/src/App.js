import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {
  Label,
  FormGroup, ControlLabel, FormControl,
  Table, Button, Modal, Glyphicon,
  Row, Col, Grid, Panel
} from 'react-bootstrap';
import {
  Typeahead
} from 'react-bootstrap-typeahead';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';

class TreeTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onItemClick = this.onItemClick.bind(this);
  }

  componentDidMount() {
    this.onItemClick("genre", "classical");
  }

  onItemClick(type, slugs) {
    fetch('http://localhost:8080/composer/' + type + '/' + slugs)
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      this.setState({item: result.currentItem, children: result.children, parent: result.parent})
    });
  }

  render() {
    return(
      <div className="container">
        <ParentItem parent={this.state.parent} item={this.state.item} onItemClick={this.onItemClick}/>
        <CurrentItem item={this.state.item} onItemClick={this.onItemClick}/>
        <ChildrenItem children={this.state.children} onItemClick={this.onItemClick}/>
      </div>
    );
  }
}

class GenreForm extends Component {

  constructor(props) {
    super(props);
    this.state = { text: '', slug: '', showModal: false };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.createGenre = this.createGenre.bind(this);
  }

  handleNameChange(e) {
    this.setState({ text: e.target.value, slug: slug(e.target.value) });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  createGenre(event) {
    event.preventDefault();
    this.close();
  }

  render() {
    return(
      <div>
          <h2><small>Add Genre</small></h2>
          <Button bsStyle="link" onClick={this.open}><Glyphicon glyph="plus" /></Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New Genre</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Create new Genre</h1>
              <form onSubmit={this.createGenre}>
                <FormGroup controlId="slugsField">
                  <ControlLabel>Slugs</ControlLabel>
                  <FormControl type="text" value={this.state.slug}></FormControl>
                </FormGroup>
                <FormGroup controlId="nameField">
                  <ControlLabel>Name</ControlLabel>
                  <FormControl type="text" onChange={this.handleNameChange} value={this.state.text}></FormControl>
                </FormGroup>
                <Button type="submit">Create</Button>
              </form>
          </Modal.Body>

        </Modal>
    </div>

    );
  }
}

class MainTest extends Component {
  render() {
    return(
      <Grid>
        <Row>
          <Col md={10}></Col>
          <Col md={2}>Player</Col>
        </Row>
        <Row>
          <Col md={10}>
              <Row>
                <Col md={4}>
                  <Panel>
                    <h2>Classical</h2>
                    <ul className="list-unstyled">
                      <li><a href="#">Artists</a></li>
                      <li><a href="#">Composers</a></li>
                    </ul>
                  </Panel>
                </Col>
                <Col md={4}>
                  <Panel>
                    <h2>Jazz</h2>
                    <ul className="list-unstyled">
                      <li><a href="#">Artists</a></li>
                    </ul>
                  </Panel>
                </Col>
                <Col md={4}>
                  <Panel>
                    <h2>Ambient</h2>
                    <ul className="list-unstyled">
                      <li><a href="#">Artists</a></li>
                    </ul>
                  </Panel>
                </Col>
              </Row>
          </Col>
          <Col md={2}></Col>
        </Row>
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

class CurrentItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      this.props.onItemClick(this.props.item.tags.type[0], this.props.item.slugs);
    }
  }

  render() {
    let item;

    if(this.props.item) {
      item = (
        <h1><small>{this.props.item.tags.type[0]}</small> {this.props.item.name}</h1>
      );
    }

    return(
      <div className="row">
        {item}
      </div>
    );
  }
}

class ParentItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if(this.props.item) {
      this.props.onItemClick(this.props.parent.tags.type[0], this.props.parent.slugs);
    }
  }

  render() {
    let parent;
    let currentItem;

    if(this.props.parent) {
      parent = (<li><a href="#" onClick={this.handleClick}>{this.props.parent.name}</a></li>);
    }

    if(this.props.item) {
      currentItem = (<li className="active">{this.props.item.name}</li>);
    }

    return (
      <div className="row">
        <ol className="breadcrumb">
          {parent}
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
      this.props.onItemClick(this.props.item.tags.type[0], this.props.item.slugs);
    }
  }

  render() {
    return(
      <div>
        <dt><a href="#" onClick={this.handleClick}>{this.props.item.name}</a></dt>
        <dd>{this.props.item.tags.type[0]}</dd>
      </div>
    );
  }
}

class ChildrenItem extends Component {

  render() {
    let childrenItems;
    if(this.props.children) {
      childrenItems = (this.props.children.map((childItem) =>
        <ChildItem item={childItem} onItemClick={this.props.onItemClick}/>
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

class Home extends Component {
  render() {
    return (
        <div className="container">
          <div>
            <h2>Welcome to High Fidelity</h2>
            <div>Click the button to logg in</div>
            <button onClick={this.handlelogin}>login</button>
          </div>
        </div>
    );
  }

  handlelogin() {
    var ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';
    var CLIENT_ID = '1b24de0b94324459b855aa136d301949';
    var REDIRECT_URI = 'http://localhost:8080/spotify-login-callback';

    var scopes = [];
    var url = ACCOUNTS_BASE_URL + '/authorize?client_id=' + CLIENT_ID
           + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
           + '&scope=' + encodeURIComponent(scopes.join(' '))
           + '&response_type=code';

    var w = window.location.href = url;
    return false;
  };
}

const LoggedInHome = ({match}) => (
    <div className="container">
      <h2>Welcome to High Fidelity</h2>
      <div>You are logged in as {match.params.userid}</div>
    </div>
)

const MainRouter = () => (
  <Router>
    <div className="containter">
      <Route exact path="/" component={Home}/>
      <Route path="/logged-in/:userid" component={LoggedInHome}/>
      <Route path="/tree-test" component={TreeTest}/>
      <Route path="/main" component={MainTest}/>
    </div>
  </Router>
)


export default MainRouter;
