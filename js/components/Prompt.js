'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    React = require('react-native'),
    ᐱ = require('../utils/Percent');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
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

  render: function() { //TODO: bring in camera
    return(
      <View style={styles.container}>

        <Image style={styles.pattern} source={require('image!pattern')} />
        <View style={styles.greenTriangle}></View>
        <View style={styles.yellowTriangle}></View>
        <View style={styles.weezerPinkTriangle}></View>

        <View style={styles.camera}></View>

        <Image style={styles.logo} source={require('image!diamonLogo')} />

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

      </View>
    );
  }
});

var styles = StyleSheet.create({ //TODO: use more flexbox
  container: {
    backgroundColor: '#00eae7',
    height: AppConstants.HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  pattern:{
    width: ᐱ.percent.w(150),
    height: ᐱ.percent.h(70),
    marginTop: ᐱ.percent.h(-20),
    marginLeft: ᐱ.percent.w(-20),
    position: 'absolute',
    transform: [{rotate: '20deg'}],
    opacity: 0.3,
  },
  camera: {
    width: ᐱ.percent.w(20),
    height: ᐱ.percent.w(20),
    backgroundColor: 'white',
    marginLeft: (ᐱ.percent.w(100) - ᐱ.percent.w(20)) /2,
    position: 'absolute',
    marginTop: ᐱ.percent.h(-23),
  },
  logo: {
    width: ᐱ.percent.h(15),
    height: ᐱ.percent.h(14),
    backgroundColor: 'transparent',
    marginLeft: ᐱ.percent.w(2),
    marginBottom: ᐱ.percent.h(2),
  },
  bringIt: {
    color: '#0072ff',
    fontSize: ᐱ.percent.h(2.3),
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
  },
  promptTitle: {
    color: '#0072ff',
    marginTop: 30,
    fontSize: ᐱ.percent.h(3.9),
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
    paddingBottom: 0,
  },
  promptText: {
    color: '#0072ff',
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
  },
  readyButton: {
    width: AppConstants.WIDTH / 3,
    height: ᐱ.percent.h(4.8),
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
    fontSize: ᐱ.percent.h(3),
    marginLeft: ᐱ.percent.w(3),
    backgroundColor: 'transparent',
  },
  center: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  weezerPinkTriangle: {
    width: ᐱ.percent.w(130),
    height: ᐱ.percent.h(100),
    backgroundColor: '#ffc8d6',
    transform: [{scaleX: 0.8}, {scaleY: 0.5}, {rotate: '30deg'}],
    marginLeft: ᐱ.percent.w(-80),
    marginTop: ᐱ.percent.h(-26),
    position: 'absolute',
    borderWidth: 5,
    borderColor: '#00eae7',
  },
  greenTriangle: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(40),
    backgroundColor: '#1ee735',
    position: 'absolute',
    transform: [{scaleX: 0.8}, {scaleY: 0.5}, {rotate: '40deg'}],
    marginTop: ᐱ.percent.h(-10),
    marginLeft: ᐱ.percent.w(-37),
  },
  yellowTriangle: {
    width: ᐱ.percent.w(140),
    height: ᐱ.percent.h(40),
    backgroundColor: '#ffff47',
    position: 'absolute',
    transform: [{scaleX: 0.8}, {scaleY: 0.5}, {rotate: '-65deg'}],
    marginTop: ᐱ.percent.h(23),
    marginLeft: ᐱ.percent.w(-74),
  }
});

module.exports = Prompt;

