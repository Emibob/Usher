'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    React = require('react-native'),
    ᐱ = require('../utils/Percent'),
    Animated = require('Animated'),
    Camera = require('react-native-camera'),
    tweenState = require('react-tween-state');

var {
  View,
  StyleSheet,
  Text,
} = React;

var seconds = 3;

var Countdown = React.createClass({
  mixins: [tweenState.Mixin],

  getInitialState: function() {
    return {
      user: this.props.user,
      promptTitle: this.props.promptTitle,
      promptText: this.props.promptText,
      marginTop: 0,
      opacity: 1,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    AppAction.startCountdown(3);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  handleDone: function(){
    //TODO: START RECORDING
    console.log('handleDone');
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get(),
    });

    if(seconds !== this.state.user.timeRemaining){
      this.animateOpacity();
      seconds = this.state.user.timeRemaining;
    }
  },

  animateOpacity: function(){

    this.state.marginTop = 0;
    this.state.opacity = 1;

    this.tweenState('marginTop', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 1000,
      endValue: this.state.marginTop === -40 ? 0 : -40,
    });
    this.tweenState('opacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 1000,
      endValue: this.state.opacity === 0 ? 1 : 0,
    });
  },

  render: function() {
    var countdown;

    if(this.state.user.ready){
      countdown = (
        <View style={{backgroundColor: 'transparent'}}>
        <Text style={styles.lowerText}>{this.state.user.timeRemaining}</Text>
        <Animated.Text style={{fontWeight: 'bold', backgroundColor: 'transparent', position:'absolute', fontSize: 30, marginTop: this.getTweeningValue('marginTop'), opacity: this.getTweeningValue('opacity'), color: 'white'}}>
          {this.state.user.timeRemaining + 1}
        </Animated.Text>
        </View>
      );
    }

    return(
        <View style={styles.countdown}>
          <Camera 
            ref="camera"
            style={styles.camera}
            type={Camera.constants.Type.front}>
            
            {countdown}
          
          </Camera>

          <View style={styles.cameraFilter}></View>
        </View>
    );
  }
});

var styles = StyleSheet.create({
  lowerText: {
    position:'absolute', 
    color: 'white', 
    fontSize: 30,
    fontWeight: 'bold',
  },
  countdown: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  countdownNumbers: {
    color: 'white',
    fontFamily: 'BrownStd-Bold',
    fontSize: ᐱ.percent.h(40),
    backgroundColor: 'transparent',
  },
  camera: {
    width: ᐱ.percent.w(60),
    height: ᐱ.percent.w(60),
    backgroundColor: 'white',
    marginLeft: (ᐱ.percent.w(100) - ᐱ.percent.w(60)) /2,
    position: 'absolute',
    marginTop: ᐱ.percent.h(-10),
  },
  cameraFilter:{
    width: ᐱ.percent.w(60),
    height: ᐱ.percent.w(60),
    backgroundColor: '#ff3e9d',
    marginLeft: (ᐱ.percent.w(100) - ᐱ.percent.w(60)) /2,
    opacity: 0.7,
    position: 'absolute',
    marginTop: ᐱ.percent.h(-10),
  },
});

module.exports = Countdown;

