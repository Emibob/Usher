/**
 * USHER: R29 Confessions
 * Emily O'Brien & Ilana Sufrin
 */
'use strict';

var React = require('react-native'),
    App = require('./js/components/App');

var {
  AppRegistry,
  View,
  Text
} = React;

var Usher = React.createClass({
  render: function() {
    return (
      <App />
    );
  }
});

AppRegistry.registerComponent('Usher', () => Usher);

