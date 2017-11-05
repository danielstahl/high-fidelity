import React, { Component } from 'react'

import LoginHandler from './LoginHandler'
import SpotifyLoginHandler from './SpotifyLoginHandler'
import { connect } from 'react-redux'

import {
  Row, Col, Grid
} from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import { withRouter } from 'react-router'

class NotLoggedInView extends Component {
  render() {
    return(
      <Row>
        <h1>Welcome to High Fidelity</h1>
        <p>Please login to continue.</p>
      </Row>
    )
  }
}

class LoggedInView extends Component {
    render() {
      return(
        <Row>
          <h1>Welcome to High Fidelity</h1>
          <p>You are logged in.</p>
        </Row>
      )
    }
}

class Main extends Component {

  render() {
    let mainView;

    if(this.props.loggedIn) {
      mainView = (<LoggedInView/>)
    } else {
      mainView = (<NotLoggedInView/>);
    }

    return(
      <div className="container">
        <Grid>
          <Row>
            <Col md={6}/>
            <Col md={2}>
              <LoginHandler/>
            </Col>
            <Col md={1}>
              <SpotifyLoginHandler location={this.props.location}/>
            </Col>
            <Col md={3}>

            </Col>
          </Row>
        </Grid>
        {mainView}
      </div>
    )
  }
}

const MainWithRouter = withRouter(Main)

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={() => <MainWithRouter loggedIn={this.props.loggedIn}/>}/>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userStateReducers.user,
    loggedIn: state.userStateReducers.loggedIn
  }
}

export default connect(mapStateToProps)(App)
