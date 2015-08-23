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
  Text,
  StatusBarIOS,
} = React;

var Usher = React.createClass({
  render: function() {
    return (
      <App />
    );
  }
});

StatusBarIOS.setHidden(true);

AppRegistry.registerComponent('Usher', () => Usher);

