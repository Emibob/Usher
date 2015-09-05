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
  Image,
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
        <Image style={styles.patternPrimary} source={require('image!bluestripes')} />
        <Image style={styles.check} source={require('image!check')} />

        <Text style={[SharedStyles.titleText, {color: 'white'}]}>THANKS FOR SPENDING SOME TIME AND VOTING YOUR VALUES!</Text>
        <Text style={[SharedStyles.messageText, {color: '#facbcb'}]}>ENJOY THE REST OF THE 29 ROOMS!</Text>
        
        <TouchableHighlight onPress={this.handleDone} style={[SharedStyles.buttonContainer, styles.againButton]} underlayColor="transparent">
        	<Text style={SharedStyles.buttonText}>DO IT AGAIN</Text>
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
  },
  patternPrimary: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(100),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  check: {
    backgroundColor: 'transparent',
  },
});

