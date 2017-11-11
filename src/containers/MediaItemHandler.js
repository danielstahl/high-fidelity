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
    })

    mediaItemsRef.on('child_changed', function(data) {
      that.props.dispatch(actions.updateMediaItem(data.val))
    })

    mediaItemsRef.on('child_removed', function(data) {
      that.props.dispatch(actions.removeMediaItem(data.key))
    })
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
    mediaItems: state.mediaItemReducers
  }
}

export default connect(mapStateToProps)(MediaItemHandler)
