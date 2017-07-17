import React, { Component } from 'react';

import {
  Image, Button
} from 'react-bootstrap';

import spotifyBlack from './images/Spotify_Icon_RGB_Black.png';
import spotifyGreen from './images/Spotify_Icon_RGB_Green.png';

class SpotifyLoginHandler extends Component {

  constructor(props) {
    super(props);
    this.handlelogin = this.handlelogin.bind(this);
  }

  handlelogin() {
    this.props.user.firebaseUser.getIdToken(false)
      .then((token) => {
        var ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';
        var CLIENT_ID = '1b24de0b94324459b855aa136d301949';
        var REDIRECT_URI = 'http://localhost:8080/spotify-login-callback';

        var scopes = ['user-read-playback-state', 'user-modify-playback-state'];
        var url = ACCOUNTS_BASE_URL + '/authorize?client_id=' + CLIENT_ID
               + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
               + '&scope=' + encodeURIComponent(scopes.join(' '))
               + '&state=' + token
               + '&response_type=code';

        window.location.href = url;
        return false;
      });
  };

  render() {
    let theComponent;
    if(this.props.user) {
      if(this.props.user.spotify) {
        theComponent = (
            <Button bsStyle="link" disabled><Image src={spotifyGreen} height="24" width="24"/></Button>
        );
      } else {
        theComponent = (
          <Button bsStyle="link" onClick={this.handlelogin}><Image src={spotifyBlack} height="24" width="24"/> Login</Button>
        );
      }
    }
    return (
      <div>{theComponent}</div>
    );
  }
}

export default SpotifyLoginHandler;
