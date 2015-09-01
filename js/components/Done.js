'use strict';

var AppConstants = require('../constants/AppConstants'),
		AppActions = require('../actions/AppActions'),
    React = require('react-native'),
    ᐱ = require('../utils/Percent');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

var Done = React.createClass({
  getInitialState: function() {
    return {};
  },

  handleDone: function(){
  	AppActions.userReset();
  },

  render: function() {
  	console.log('this.refs', this.refs);
    return(
      <View style={styles.container}>
        <Text style={styles.thanks}>Thanks for participating!</Text>
        
        <TouchableHighlight onPress={this.handleDone} underlayColor="transparent">
        	<Text>Do It Again</Text>
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
	thanks: {
		color: 'white',
    fontSize: ᐱ.percent.h(2.7),
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
    paddingRight: ᐱ.percent.w(8),
    paddingTop: 0,
    marginBottom: ᐱ.percent.h(4),
	} 
});

