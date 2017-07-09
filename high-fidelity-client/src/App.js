import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import {
  Typeahead
} from 'react-bootstrap-typeahead';


import GenreView from './GenreView.js';

import LoginHandler from './LoginHandler.js';

import SpotifyLoginHandler from './SpotifyLoginHandler.js';

import * as firebase from 'firebase';

import {
  Row, Col, Grid, Panel, Jumbotron
} from 'react-bootstrap';


class NotLoggedInView extends Component {
  render() {
    return(
      <Row>
        <h1>Welcome to High Fidelity</h1>
        <p>Please login to continue.</p>
      </Row>
    );
  }
}

class Main extends Component {

  constructor(props) {
      super(props);
      // uid, email, spotify, loggedin
      this.state = {user: undefined, loggedIn: false};
      this.setUser = this.setUser.bind(this);
  }

  setUser(user) {
    this.setState({user: user, loggedIn: user.loggedIn});
  }

  render() {
    let mainView;

    if(this.state.loggedIn) {
      mainView = (<GenreView user={this.state.user}/>)
    } else {
      mainView = (<NotLoggedInView/>);
    }
    return(
      <div className="container">
        <Grid>
          <Row>
            <Col md={8}/>
            <Col md={2}>
              <LoginHandler setUser={this.setUser} loggedIn={this.state.loggedIn} user={this.state.user}/>
            </Col>
            <Col md={2}>
              <SpotifyLoginHandler user={this.state.user}/>
            </Col>
          </Row>
        </Grid>
        {mainView}
      </div>
    );
  }
}

const MainRouter = () => (
  <Router>
    <div className="containter">
      <Route exact path="/" component={Main}/>
    </div>
  </Router>
)

export default MainRouter;
