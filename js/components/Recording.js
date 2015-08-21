'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    React = require('react-native'),
    Recorder  = require('react-native-screcorder'),
    RNFS = require('react-native-fs'),
    Video = require('react-native-video'),
    Camera = require('react-native-camera');

var {
  View,
  StyleSheet,
  Text,
} = React;

var Recording = React.createClass({
  getInitialState: function() {
    return {
      start: false,
      user: UserStore.get(),
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({user: UserStore.get()});
  },

  render: function() {
    return(
      <View>
        <Text>Recording</Text>
      </View>
    );
  }
});

module.exports = Recording;

