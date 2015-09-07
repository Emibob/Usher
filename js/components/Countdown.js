'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    React = require('react-native'),
    ᐱ = require('../utils/Percent'),
    Animated = require('Animated'),
    tweenState = require('react-tween-state'),
    Question = require('./Question');

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

      countdown = (
        <View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.lowerText}>{this.state.user.timeRemaining}</Text>
          <Animated.Text style={{fontWeight: 'bold', backgroundColor: 'transparent', position:'absolute', fontSize: 30, marginTop: this.getTweeningValue('marginTop'), opacity: this.getTweeningValue('opacity'), color: 'white'}}>
            {this.state.user.timeRemaining + 1}
          </Animated.Text>
        </View>
      );

    return(
        <View style={styles.countdown}>
          <View style={styles.circle}>
            {countdown}
          </View>
        </View>
    );
  }
});

var styles = StyleSheet.create({
  lowerText: {
    position: 'absolute', 
    color: 'white', 
    fontSize: 30,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  countdown: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: ᐱ.percent.w(60),
    height: ᐱ.percent.w(60),
  },
  countdownNumbers: {
    color: 'white',
    fontFamily: 'BrownStd-Bold',
    fontSize: ᐱ.percent.h(40),
    backgroundColor: 'transparent',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: 'white',
    width: ᐱ.percent.w(30),
    height: ᐱ.percent.w(30),
    borderRadius: ᐱ.percent.w(15),
  }
});

module.exports = Countdown;

