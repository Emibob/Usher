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
      user: UserStore.get(),
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
    this.setState({user: UserStore.get()});
  },

  handleReady: function(){
    AppAction.userReady(true);
  },

  render: function() {
    return(
      <View style={styles.container}>
        <Text style={styles.bringIt}>Ready to bring it?</Text>
        <Text style={styles.promptTitle}>{this.state.promptTitle}</Text>
        <Text style={styles.promptText}>{this.state.promptText}</Text>
        
        <View style={styles.center}>
          <TouchableHighlight onPress={this.handleReady}>
            <Text style={styles.ready}>IM READY</Text>
          </TouchableHighlight>
        </View>
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
  bringIt: {
    color: 'white',
    fontSize: 15,
  },
  promptTitle: {
    color: 'white',
    marginTop: 30,
    fontSize: 30,
  },
  promptText: {
    color: 'white',
    fontSize: 20,
  },
  ready: { //TODO: THIS WILL BE AN IMAGE 
    width: AppConstants.WIDTH / 5,
    height: 30,
    backgroundColor: 'white',
    color: 'purple',
    borderWidth: 1,
    borderColor: 'purple',
  },
  center: {
    alignItems: 'center',
    paddingTop: 50
  },
});

module.exports = Prompt;

