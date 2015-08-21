'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
} = React;

var Countdown = React.createClass({
  getInitialState: function() {
    return {
      user: this.props.user,
      promptTitle: this.props.promptTitle,
      promptText: this.props.promptText,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    AppAction.startCountdown(4);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get(),
    });
  },

  render: function() {
    return(
      <View style={styles.container}>
        <View style={styles.countdown}>
          <Text style={styles.countdownNumbers}>{this.state.user.timeRemaining}</Text>
        </View>
        <Text style={styles.promptTitle}>{this.state.promptTitle}</Text>
        <Text style={styles.promptText}>{this.state.promptText}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#699A97', //TODO: Need image background
    height: AppConstants.HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  countdown: {
    width: AppConstants.WIDTH / 2,
    height: 200,
    backgroundColor: '#FC569B',
    marginLeft: (AppConstants.WIDTH / 2) / 2,
  },
  countdownNumbers: {
    color: 'white',
  },
  promptTitle: {
    color: 'white',
  },
  promptText: {
    color: 'white',
  }
});

module.exports = Countdown;

