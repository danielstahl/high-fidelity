import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl, Alert
} from 'react-bootstrap'
import * as firebase from 'firebase'
import * as actions from '../actions/index'

class LoginHandler extends Component {

  constructor(props) {
    super(props)
    this.state = { showModal: false, errorMessage: undefined, email: '', password: ''}
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
  }

  componentDidMount() {
    var that = this
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {
        that.props.dispatch(actions.setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          loggedIn: true,
          firebaseUser: firebaseUser
        }))
      } else {
        that.props.dispatch({
          type: 'UNSET_USER'
        })
      }
    })
  }

  close() {
    this.setState({ showModal: false })
  }

  open() {
    this.setState({ showModal: true })
  }

  onLogin(event) {
    event.preventDefault()
    firebase.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        user => {
          this.setState({showModal: false});
        },
        error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          this.setState({errorCode: errorCode, errorMessage: errorMessage})
        })
    }

    onLogout(event) {
      event.preventDefault()
      firebase.auth().signOut()
    }

    handleEmail(event) {
      this.setState({email: event.target.value})
    }

    handlePassword(event) {
      this.setState({password: event.target.value})
    }

  render() {
    let errorAlert
    if(this.state.errorMessage) {
      errorAlert = (<Alert bsStyle="danger">{this.state.errorMessage}</Alert>);
    }

    let theComponent;
    if(this.props.loggedIn) {
      theComponent = (
        <Button bsStyle="link" onClick={this.onLogout}>{this.props.user.email} <Glyphicon glyph="log-out" /></Button>
      )
    } else {
      theComponent = (<div>
        <Button bsStyle="link" onClick={this.open}>Login <Glyphicon glyph="log-in" /></Button>

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
    </div>)
    }
    return (theComponent)
  }
}

const mapStateToProps = state => {
  return {
    user: state.userStateReducers.user,
    loggedIn: state.userStateReducers.loggedIn
  }
}

export default connect(mapStateToProps)(LoginHandler)
