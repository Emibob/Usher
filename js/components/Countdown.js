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
      marginTop: ᐱ.percent.h(-6),
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
    this.state.marginTop = ᐱ.percent.h(-6);
    this.state.opacity = 1;

    this.tweenState('marginTop', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 1000,
      endValue: this.state.marginTop === ᐱ.percent.h(-7) ? ᐱ.percent.h(-6) : ᐱ.percent.h(-7),
    });
    this.tweenState('opacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 1000,
      endValue: this.state.opacity === 0 ? 1 : 0,
    });
  },

  render: function() {
    return(
        <View style={styles.countdown}>
          <View style={styles.circle}>
            <Text style={styles.numbers}>{this.state.user.timeRemaining}</Text>
            <Animated.Text style={[styles.numbers, {marginTop: this.getTweeningValue('marginTop'), opacity: this.getTweeningValue('opacity')}]}>{this.state.user.timeRemaining + 1}</Animated.Text>
          </View>
        </View>
    );
  }
});

var styles = StyleSheet.create({
  numbers: {
    position: 'absolute', 
    color: 'white', 
    fontSize: ᐱ.percent.w(10), //30
    backgroundColor: 'transparent',
    marginLeft: ᐱ.percent.w(10),
    marginTop: ᐱ.percent.h(-6),
    fontFamily: 'BrownStd-Light',
  },
  countdown: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: ᐱ.percent.w(60),
    height: ᐱ.percent.w(60),
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'white',
    width: ᐱ.percent.w(25),
    height: ᐱ.percent.w(25),
    borderRadius: ᐱ.percent.w(15),
  },
});

module.exports = Countdown;

