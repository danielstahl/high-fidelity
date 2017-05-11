import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
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

    var w = window.open(url);
    return false;
  };
}



export default App;
