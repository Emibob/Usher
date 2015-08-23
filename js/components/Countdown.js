'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    React = require('react-native'),
    ᐱ = require('../utils/Percent'),
    Animated = require('Animated'),
    tweenState = require('react-tween-state');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

var test = 4;

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
    AppAction.startCountdown(4);
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

    if(test !== this.state.user.timeRemaining){
      this.animateOpacity();
      test = this.state.user.timeRemaining;
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
    return(
      <View style={styles.container}>

        <View style={styles.countdown}>
          <Text style={styles.lowerText}>{this.state.user.timeRemaining}</Text>
          <Animated.Text style={{backgroundColor: 'transparent', position:'absolute', marginLeft: 70, fontSize: 30, marginTop: this.getTweeningValue('marginTop'), opacity: this.getTweeningValue('opacity'), color: 'white'}}>{this.state.user.timeRemaining + 1}</Animated.Text>
        </View>

        <Text style={styles.promptTitle}>{this.state.promptTitle}</Text>
        <Text style={styles.promptText}>{this.state.promptText}</Text>

        <View style={styles.center}>
          <TouchableHighlight onPress={this.handleDone}>
            <View style={styles.doneButton}>
            <Text style={styles.doneText}>IM DONE</Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#00eae7',
    height: AppConstants.HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  lowerText: {
    position:'absolute', 
    marginLeft: 70, 
    color: 'red', 
    fontSize: 30,
  },
  countdown: {
    width: AppConstants.WIDTH / 2,
    height: AppConstants.WIDTH / 2,
    backgroundColor: '#FC569B',
    marginLeft: (AppConstants.WIDTH / 2) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumbers: {
    color: 'white',
    fontFamily: 'BrownStd-Bold',
    fontSize: ᐱ.percent.h(40),
  },
  promptTitle: {
    color: 'white',
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
  },
  promptText: {
    color: 'white',
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
  },
  doneButton: {
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
  doneText: {
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
});

module.exports = Countdown;

