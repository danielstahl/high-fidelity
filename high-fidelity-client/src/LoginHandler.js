import React, { Component } from 'react';

import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl, Alert
} from 'react-bootstrap';

import * as firebase from 'firebase';

class LoginHandler extends Component {

  constructor(props) {
    super(props);
    this.state = { showModal: false, errorMessage: undefined, email: '', password: ''};
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  componentDidMount() {
    var that = this;
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {

        firebaseUser.getIdToken(false)
          .then((token) => {
            fetch('http://localhost:8080/firebase-token-login/' + token)
            .then((result) => {
              return result.json();
            })
            .then((resultUser) => {

              var user = {
                email: resultUser.email,
                uid: resultUser.uid,
                spotify: resultUser.spotify,
                loggedIn: resultUser.loggedIn,
                firebaseUser: firebaseUser
              };
              that.props.setUser(user);
            });
          });

      } else {
        // No user is signed in.
      }
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  onLogin(event) {
    event.preventDefault();
    firebase.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        user => {
          this.setState({showModal: false});
        },
        error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          this.setState({errorCode: errorCode, errorMessage: errorMessage});
        });
  }

  handleEmail(event) {
    this.setState({email: event.target.value});
  }

  handlePassword(event) {
    this.setState({password: event.target.value});
  }

  render() {

    let errorAlert;

    if(this.state.errorMessage) {
      errorAlert = (<Alert bsStyle="danger">{this.state.errorMessage}</Alert>);
    }

      let theComponent;
      if(this.props.loggedIn) {
        theComponent = (
          <Button bsStyle="link" disabled>{this.props.user.email}</Button>
        );
      } else {
        theComponent = (<div>
          <Button bsStyle="link" onClick={this.open}><Glyphicon glyph="log-in" /></Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {errorAlert}
              <form onSubmit={this.onLogin}>
                <FormGroup controlId="emailField">
                  <ControlLabel>Email</ControlLabel>
                  <FormControl type="text" value={this.state.email} onChange={this.handleEmail}></FormControl>
                </FormGroup>
                <FormGroup controlId="passwordField">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl type="password" value={this.state.password} onChange={this.handlePassword}></FormControl>
                </FormGroup>
                <Button bsStyle="primary" type="submit">Login</Button>
              </form>
          </Modal.Body>
        </Modal>
      </div>);
    }
    return(theComponent);
  }
}

export default LoginHandler;
