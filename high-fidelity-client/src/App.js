import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import MediaItemGraphView from './mediaitem_graph/MediaItemGraphView.js';
import LoginHandler from './LoginHandler.js';
import SpotifyLoginHandler from './SpotifyLoginHandler.js';
import SpotifyPlaybackStatus from './SpotifyPlaybackStatus.js';

import {
  Row, Col, Grid
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
      this.state = {user: undefined, loggedIn: false};
      this.setUser = this.setUser.bind(this);
      this.setPlaybackStatus = this.setPlaybackStatus.bind(this);
      this.play = this.play.bind(this);
      this.pause = this.pause.bind(this);
      this.next = this.next.bind(this);
      this.previous = this.previous.bind(this);
  }

  setUser(user) {
    this.setState({user: user, loggedIn: user.loggedIn});
  }

  setPlaybackStatus(playbackStatus) {
    this.setState({playbackStatus: playbackStatus});
  }

  play(uris) {
    let playRequest;
    if(uris) {
      playRequest = { uris: uris };
    } else {
      playRequest = {};
    }
    let that = this;
    this.state.user.firebaseUser.getIdToken(false)
      .then((token) => {

        fetch('http://localhost:8080/playback/play/' + token, {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(playRequest)
        }).then(res => {
          return res.json();
        }).then(json => {
          that.setPlaybackStatus(json);
        });
      });
  }

  pause() {
    let that = this;
    this.state.user.firebaseUser.getIdToken(false)
      .then((token) => {

        fetch('http://localhost:8080/playback/pause/' + token, {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }).then(res => {
          return res.json();
        }).then(json => {
          that.setPlaybackStatus(json);
        });
      });
  }

  next() {
    let that = this;
    this.state.user.firebaseUser.getIdToken(false)
      .then((token) => {

        fetch('http://localhost:8080/playback/next/' + token, {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }).then(res => {
          return res.json();
        }).then(json => {
          that.setPlaybackStatus(json);
        });
      });
  }

  previous() {
    let that = this;
    this.state.user.firebaseUser.getIdToken(false)
      .then((token) => {

        fetch('http://localhost:8080/playback/previous/' + token, {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }).then(res => {
          return res.json();
        }).then(json => {
          that.setPlaybackStatus(json);
        });
      });
  }

  render() {
    let mainView;

    if(this.state.loggedIn) {
      mainView = (<MediaItemGraphView play={this.play} user={this.state.user}/>)
    } else {
      mainView = (<NotLoggedInView/>);
    }
    return(
      <div className="container">
        <Grid>
          <Row>
            <Col md={6}/>
            <Col md={2}>
              <LoginHandler setUser={this.setUser} loggedIn={this.state.loggedIn} user={this.state.user}/>
            </Col>
            <Col md={1}>
              <SpotifyLoginHandler user={this.state.user}/>
            </Col>
            <Col md={3}>
              <SpotifyPlaybackStatus play={this.play} pause={this.pause} next={this.next} previous={this.previous} user={this.state.user} playbackStatus={this.state.playbackStatus} setPlaybackStatus={this.setPlaybackStatus}/>
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
