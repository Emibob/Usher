'use strict';

var AppConstants = require('../constants/AppConstants'),
    React = require('react-native'),
    ᐱ = require('../utils/Percent');

var {
  View,
  StyleSheet,
  Text,
} = React;

var Done = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return(
      <View>
        <Text style={styles.done}>Yous Done, yo!</Text>
      </View>
    );
  }
});

module.exports = Done;

var styles = StyleSheet.create({
	done: {
		color: 'red'
	} 
});

