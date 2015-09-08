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
    doneTimeout = setTimeout(this.handleDone, 5000);
  },

  handleDone: function(){
    clearTimeout(doneTimeout);
  	AppActions.userReset();
  },

  render: function() {
    return(
      <View style={styles.container}>
        <Image style={styles.patternPrimary} source={{uri: 'bluestripes', isStatic: true}} />
        <Image style={styles.check} source={{uri: 'check', isStatic: true}} />

        <Text style={[SharedStyles.titleText, {color: 'white', marginBottom: 40}]}>THANKS FOR SPENDING{'\n'} SOME TIME AND VOTING{'\n'} YOUR VALUES!</Text>
        <Text style={[SharedStyles.messageText, {color: '#facbcb'}]}>ENJOY THE REST OF #29ROOMS!</Text>
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
    width: ᐱ.percent.w(30),
    height: ᐱ.percent.w(30), 
    backgroundColor: 'transparent',
  },
});

