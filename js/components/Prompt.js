'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

var Prompt = React.createClass({
  getInitialState: function() {
    return {
      user: this.props.user,
      promptTitle: this.props.promptTitle,
      promptText: this.props.promptText,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get()
    });
  },

  handleReady: function(){
    AppAction.userReady(true);
  },

  render: function() {
    return(
      <View style={styles.container}>
        <Text style={styles.bringIt}>READY TO BRING IT?</Text>
        <Text style={styles.promptTitle}>{this.state.promptTitle.toUpperCase()}</Text>
        <Text style={styles.promptText}>{this.state.promptText.toUpperCase()}</Text>
        
        <View style={styles.center}>
          <TouchableHighlight onPress={this.handleReady}>
            <View style={styles.readyButton}>
            <Text style={styles.readyText}>I'M READY</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.arrowUp}>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#00eae7', //TODO: Need image background
    height: AppConstants.HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bringIt: {
    color: '#0072ff',
    fontSize: 15,
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 3, height: -3},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
  },
  promptTitle: {
    color: '#0072ff',
    marginTop: 30,
    fontSize: 30,
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 3, height: -3},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
  },
  promptText: {
    color: '#0072ff',
    fontSize: 20,
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 3, height: -3},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
  },
  readyButton: {
    width: AppConstants.WIDTH / 3,
    height: 35,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#0072ff',
    shadowRadius: 0,
    shadowOffset: {width: 3, height: -3},
    shadowColor: 'white',
    shadowOpacity: 1,
  },
  readyText: {
    color: '#0072ff',
    fontFamily: 'BrownStd-Bold',
    fontSize: 20,
    marginLeft: 10,
  },
  center: {
    alignItems: 'center',
    paddingTop: 50
  },
  arrowUp: {
    width: 55,
    height: 55,
    backgroundColor: 'red',
    //borderTopLeftRadius: 55,
    borderLeftColor: 'transparent',
    //borderTopRightRadius: 55,
    //borderRightColor: 'transparent',
    //borderBottomLeftRadius: 55,
    //borderBottomColor: 'black',
    transform: {rotate: 'right'}
  }
});

module.exports = Prompt;

