'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
} = React;

var Quit = React.createClass({
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
        <Text>Quit</Text>
      </View>
    );
  }
});

module.exports = Quit;

