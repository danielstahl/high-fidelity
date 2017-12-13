import React, { Component } from 'react';
import {
  Button, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
import {
  Typeahead, asyncContainer
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Builders from '../services/Builders'
import Utils from '../services/Utils'
import { connect } from 'react-redux'

const AsyncTypeahead = asyncContainer(Typeahead)

class ArtistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      slug: '',
      spotifyUri: '',
      showModal: false,
      isLoading: false,
      options: [],
      instruments: []
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.createArtist = this.createArtist.bind(this)
    this.selectArtist = this.selectArtist.bind(this)
    this.selectInstruments = this.selectInstruments.bind(this)
    this.remoteSearch = this.remoteSearch.bind(this)
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
      slug: Utils.slug(e.target.value)
    })
  }

  close() {
    this.setState({
      showModal: false,
      name: '',
      slug: '',
      spotifyUri: '',
      isLoading: false,
      options: [],
      instruments: []
    })
  }

  open() {
    this.setState({ showModal: true });
  }

  createArtist(event) {
    event.preventDefault()

    const newArtistMediaItem = {
      slugs: this.state.slug,
      name: this.state.name,
      types: ['artist'],
      uris: {
        spotifyUri: [this.state.spotifyUri]
      },
      tags: {
        genre: [this.props.genre.slugs],
        instrument: this.state.instruments
      }
    }
    console.log("newArtistMediaItem", newArtistMediaItem)
    this.props.mediaItemHandler.addMediaItem(newArtistMediaItem)
    this.close()
  }

  remoteSearch(query) {
    this.setState({isLoading: true})
    var accessToken = this.props.spotifyUser.accessToken

    fetch("https://api.spotify.com/v1/search?q=" + query + "*&market=SE&type=artist&limit=50", {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }).then(result => {
      if (!result.ok) {
        throw result
      }
      return result.json()
    }).then(searchResult => {
      const artistChoises = searchResult.artists.items.map(artist => {
        return {
          uri: artist.uri,
          name: artist.name,
          imageUrl: Utils.getLastUrl(artist.images)
        }
      })
      this.setState({isLoading: false, options: artistChoises})
    }).catch(error => {
      if(error.status === 401) {
          this.handlelogin()
      }
    })
  }

  selectArtist(artist) {
    if(artist[0]) {
      this.setState({
        name: artist[0].name,
        slug: Utils.slug(artist[0].name),
        spotifyUri: artist[0].uri
      })
    }
  }

  selectInstruments(instruments) {
    let instrumentSlugs = instruments.map(instrument => instrument.slugs)
    this.setState({
      instruments: instrumentSlugs
    });
  }

  render() {
    return (
      <div>
          <Button bsStyle="link" onClick={this.open}>Add Artist</Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New {this.props.genre.name} Artist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Create new Artist</h1>
              <form onSubmit={this.createArtist}>
                <FormGroup controlId="searchField">
                  <ControlLabel>Search</ControlLabel>
                  <AsyncTypeahead
                    {...this.state}
                    isLoading={this.state.isLoading}
                    onChange={this.selectArtist}
                    onSearch={this.remoteSearch}
                    labelKey={option => `${option.name}`}
                    options={this.state.options}
                  />
                </FormGroup>
                <FormGroup controlId="slugsField">
                  <ControlLabel>Slugs</ControlLabel>
                  <FormControl type="text" value={this.state.slug}></FormControl>
                </FormGroup>
                <FormGroup controlId="nameField">
                  <ControlLabel>Name</ControlLabel>
                  <FormControl type="text" onChange={this.handleNameChange} value={this.state.name}></FormControl>
                </FormGroup>
                <FormGroup controlId="instrumentsField">
                  <ControlLabel>Instruments</ControlLabel>
                  <Typeahead multiple
                    onChange={this.selectInstruments}
                    options={this.props.instrumentChoises}
                    labelKey={option => `${option.name}`}
                  />
                </FormGroup>
                <Button type="submit">Create</Button>
              </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    instrumentChoises: Builders.getInstruments(state.mediaItemReducers,
                                               state.mediaItemGraphReducers.graphType,
                                               state.mediaItemGraphReducers.slugs),
    spotifyUser: state.spotifyStateReducers.spotifyUser
  }
}

export default connect(mapStateToProps)(ArtistForm)
