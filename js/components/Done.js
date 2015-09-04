'use strict';

var AppConstants = require('../constants/AppConstants'),
		AppActions = require('../actions/AppActions'),
    React = require('react-native'),
    SharedStyles = require('./SharedStyles'),
    ᐱ = require('../utils/Percent');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

var doneTimeout;

var Done = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    doneTimeout = setTimeout(this.handleDone, 2000);
  },

  handleDone: function(){
    clearTimeout(doneTimeout);
  	AppActions.userReset();
  },

  render: function() {
    return(
      <View style={styles.container}>
        <Text style={SharedStyles.titleText}>Thanks for participating!</Text>
        
        <TouchableHighlight onPress={this.handleDone} style={[SharedStyles.buttonContainer, styles.againButton]} underlayColor="transparent">
        	<Text style={SharedStyles.buttonText}>Do It Again</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

module.exports = Done;

var styles = StyleSheet.create({
	container: {
    backgroundColor: '#00eae7',
    width: AppConstants.WIDTH,
    height: AppConstants.HEIGHT,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  againButton: {
    marginTop: ᐱ.percent.h(4),
  }
});

