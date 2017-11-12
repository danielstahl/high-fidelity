import React, { Component } from 'react'

import * as firebase from 'firebase'
import { connect } from 'react-redux'
import * as actions from '../actions/index'
import MediaItemGraphView from './MediaItemGraphView'

class MediaItemHandler extends Component {

  componentDidMount() {
    var that = this
    var mediaItemsRef = firebase.database().ref('media-items/' + this.props.user.uid)

    mediaItemsRef.on('child_added', function(data) {
      that.props.dispatch(actions.addMediaItem(data.val()))
      that.updateMediaItemUriInfo(data.val())
    })

    mediaItemsRef.on('child_changed', function(data) {
      that.props.dispatch(actions.updateMediaItem(data.val))
      that.updateMediaItemUriInfo(data.val())
    })

    mediaItemsRef.on('child_removed', function(data) {
      that.props.dispatch(actions.removeMediaItem(data.key))
    })
  }

  getUrl(uri, uriType) {
    switch(uriType) {
      case 'spotifyUri':
      case 'spotifyPlaylist':
        var uriParts = uri.split(':')
        uriParts.splice(0, 1)
        var joinedUriParts = uriParts.join('/')
        var url = 'https://open.spotify.com/' + joinedUriParts
        return url
      case 'wikipedia':
      case 'youtube':
      default:
        return uri
    }
  }

  getName(uriType, mediaItem) {
    switch(uriType) {
      case 'spotifyUri':
        return mediaItem.name + " at Spotify"
      case 'spotifyPlaylist':
        return mediaItem.name + " Spotify playlist"
      case 'wikipedia':
        return mediaItem.name + " on Wikipedia"
      case 'youtube':
        return mediaItem.name + " on Youtube"
      default:
        return mediaItem.name
    }
  }

  updateMediaItemUriInfo(mediaItem) {
    if(mediaItem.uris) {
      Object.entries(mediaItem.uris).forEach(([uriType, uris]) => {
        uris.forEach((uri) => {
          var url = this.getUrl(uri, uriType)
          var name = this.getName(uriType, mediaItem)
          this.props.dispatch(actions.setUriInfo({
              uriType: uriType,
              uri: uri,
              url: url,
              name: name
          }))
        })
      })
    }
  }

  render() {
    return (
      <MediaItemGraphView mediaItems={this.props.mediaItems}/>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.userStateReducers.user,
    mediaItems: state.mediaItemReducers,
    uriInfos: state.uriInfoReducers 
  }
}

export default connect(mapStateToProps)(MediaItemHandler)
