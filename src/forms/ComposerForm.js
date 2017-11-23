import React, { Component } from 'react';

import {
  Button, Modal, FormGroup, ControlLabel, FormControl, Checkbox
} from 'react-bootstrap';
import Builders from '../services/Builders'
import { connect } from 'react-redux'
import {
  Typeahead, AsyncTypeahead
} from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';

var slug = require('slug');
slug.defaults.mode = 'rfc3986';


class ComposerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      slug: '',
      spotifyUri: '',
      showModal: false,
      isArtist: false,
      instruments: [],
      isLoading: false
    }

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleIsArtistChange = this.handleIsArtistChange.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.createComposer = this.createComposer.bind(this)
    this.selectComposer = this.selectComposer.bind(this)
    this.selectInstruments = this.selectInstruments.bind(this)
    this.remoteSearch = this.remoteSearch.bind(this)
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
      slug: slug(e.target.value)
    })
  }

  handleIsArtistChange(event) {
    event.preventDefault()
    this.setState({
      isArtist: event.target.checked
    })
  }

  close() {
    this.setState({
      showModal: false,
      name: '',
      slug: '',
      spotifyUri: '',
      isArtist: false,
      instruments: []
    })
  }


  open() {
    this.setState({
      showModal: true
    })
  }

  createComposer(event) {
    event.preventDefault()

    let types;
    if(this.state.isArtist) {
      types = ['composer', 'artist']
    } else {
      types = ['composer']
    }

    let newComposerMediaItem = {
      slugs: this.state.slug,
      name: this.state.name,
      types: types,
      uris: {
        spotifyUri: [this.state.spotifyUri]
      },
      tags: {
        genre: [this.props.genre.slugs],
        era: [this.props.era.slugs],
        instrument: this.state.instruments
      }
    }

    console.log("newComposerMediaItem", newComposerMediaItem)
    this.props.mediaItemHandler.addMediaItem(newComposerMediaItem)

    this.close()
  }

  getLastUrl(images) {
    if(images && images.length) {
      return images.slice(-1)[0].url
    } else {
      return ''
    }
  }

  remoteSearch(query) {
    this.setState({
      isLoading: true
    })
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
      const composerChoises = searchResult.artists.items.map(composer => {
        return {
          uri: composer.uri,
          name: composer.name,
          imageUrl: this.getLastUrl(composer.images)
        }
      })
      this.setState({
        isLoading: false,
        options: composerChoises
      })
    }).catch(error => {
      if(error.status === 401) {
          this.handlelogin()
      }
    })
  }

  selectComposer(artist) {
    if(artist[0]) {
      this.setState({
        name: artist[0].name,
        slug: slug(artist[0].name),
        spotifyUri: artist[0].uri
      })
    }
  }

  selectInstruments(instruments) {
    let instrumentSlugs = instruments.map(instrument => instrument.slugs)
    this.setState({
      instruments: instrumentSlugs
    })
  }

  render() {
    return (
      <div>
          <Button bsStyle="link" onClick={this.open}>Add Composer</Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>New Composer for {this.props.era.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Create new Composer</h1>
              <form onSubmit={this.createComposer}>
                <FormGroup controlId="searchField">
                  <ControlLabel>Search</ControlLabel>
                  <AsyncTypeahead
                    {...this.state}
                    isLoading={this.state.isLoading}
                    onChange={this.selectComposer}
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

                <FormGroup controlId="isArtistField">
                  <ControlLabel>Artist</ControlLabel>
                  <Checkbox checked={this.state.isArtist} onChange={this.handleIsArtistChange}>Is also artist?</Checkbox>
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
    )
  }
}

const getInstruments = (mediaItems, graphType, eraSlugs) => {

  if(graphType === 'era') {
    const eraMediaItem = mediaItems.find(mediaItem => mediaItem.slugs === eraSlugs)
    const genreSlugs = Builders.getTagHead(eraMediaItem, 'genre')
    return mediaItems.filter(mediaItem =>
      mediaItem.types.includes('instrument') &&
      Builders.hasTag(mediaItem, 'genre', genreSlugs))
  } else {
    return []
  }
}

const mapStateToProps = state => {
  const instruments = getInstruments(state.mediaItemReducers,
                                     state.mediaItemGraphReducers.graphType,
                                     state.mediaItemGraphReducers.slugs)
  return {
    instrumentChoises: instruments,
    spotifyUser: state.spotifyStateReducers.spotifyUser
  }
}

export default connect(mapStateToProps)(ComposerForm)
