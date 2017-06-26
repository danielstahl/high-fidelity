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

import * as firebase from 'firebase';

import {
  Row, Col, Grid, Panel, Jumbotron
} from 'react-bootstrap';

class Home2 extends Component {
  render() {
    return(
      <div className="container">
        <div>
          <LoginHandler/>
        </div>
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
            <div>Click the button to login</div>
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
        <Row>
          <Col md={10}/>
          <Col md={2}>
            <LoginHandler setUser={this.setUser} loggedIn={this.state.loggedIn} user={this.state.user}/>
          </Col>
        </Row>
        {mainView}
      </div>
    );
  }
}

const MainRouter = () => (
  <Router>
    <div className="containter">
      <Route exact path="/" component={Main}/>
      <Route path="/logged-in/:userid" component={LoggedInHome}/>
    </div>
  </Router>
)

export default MainRouter;
