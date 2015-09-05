'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    Recorder  = require('react-native-screcorder'),
    React = require('react-native'),
    Animated = require('Animated'),
    tweenState = require('react-tween-state'),
    SharedStyles = require('./SharedStyles'),
    ᐱ = require('../utils/Percent'),
    Countdown = require('./Countdown'),
    Copy = require('./Copy');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
} = React;

var Prompt = React.createClass({
  mixins: [tweenState.Mixin],

  getInitialState: function() {
    return {
      user: this.props.user,
      promptTitle: this.props.promptTitle,
      promptText: this.props.promptText,
      stripesHeight: ᐱ.percent.h(20),
      buttonOpacity: 1,
      fakeRemainingBarOpacity: 0,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
    this.refs.recorder.removeAllSegments();
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get()
    });
  },

  handleAppInit: function(){
    this.animateHeight();
    setTimeout(AppAction.initApp, 1000)
  },

  animateHeight: function(){

    this.tweenState('stripesHeight', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 1000,
      endValue: this.state.stripesHeight === ᐱ.percent.h(20) ? ᐱ.percent.h(10) : ᐱ.percent.h(20),
    });
    this.tweenState('fakeRemainingBarOpacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 1000,
      endValue: this.state.fakeRemainingBarOpacity === 1 ? 0 : 1,
    });
    this.tweenState('buttonOpacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 200,
      endValue: this.state.buttonOpacity === 0 ? 1 : 0,
    });
  },

  render: function() {
    return(
      <View style={styles.container}>

        <Image style={styles.patternPrimary} source={require('image!stars')} />

        <Image style={styles.logo} source={require('image!whitelogo')} />

        <Text style={SharedStyles.titleText}>IF YOU HAD 45 SECONDS, WHAT WOULD YOU TELL THE PRESIDENT?</Text>

        <View style={styles.stripesContainer}>
          <Image style={[styles.patternSecondary, {height: this.getTweeningValue('stripesHeight')}]} source={require('image!pinkstripes')} />
          <View style={[styles.fakeRemainingBar, {height: this.getTweeningValue('stripesHeight'), opacity: this.getTweeningValue('fakeRemainingBarOpacity')}]} />

          <View style={styles.center}>
            <TouchableHighlight style={[SharedStyles.buttonContainer, {backgroundColor: '#1d3586', opacity: this.getTweeningValue('buttonOpacity')}]} onPress={this.handleAppInit} underlayColor="transparent">
              <Text style={[SharedStyles.buttonText, {color: 'white'}]}>RECORD</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.cameraContainer}>
          <View style={styles.cameraBorder}>
            <Recorder
                ref="recorder"
                config={config}
                device="front"
                style={styles.camera}>
            </Recorder>
          </View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  cameraContainer: {
    backgroundColor: 'transparent',
    width: AppConstants.WIDTH,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
  },
  camera: {
    width: ᐱ.percent.w(32),
    height: ᐱ.percent.w(32),
  },
  cameraBorder: {
    marginTop: ᐱ.percent.h(8),
    width: ᐱ.percent.w(37),
    height: ᐱ.percent.w(37),
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#00eae7',
    height: AppConstants.HEIGHT,
    width: AppConstants.WIDTH,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  patternPrimary: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(100),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  stripesContainer: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(20),
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  patternSecondary: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(20),
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
  },
  logo: {
    width: ᐱ.percent.h(12),
    height: ᐱ.percent.h(12),
    backgroundColor: 'transparent',
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: ᐱ.percent.h(8),
  },
  bringIt: {
    color: 'white',
    fontSize: ᐱ.percent.h(2.3),
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
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
  fakeRemainingBar: {
    backgroundColor: 'white',
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(10),
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});


var config = {
  autoSetVideoOrientation: false,
  video: {
    enabled: true,
    bitrate: 1800000, // 2Mbit/s
    timescale: 1, // Higher than 1 makes a slow motion, between 0 and 1 makes a timelapse effect
    format: "MPEG4",
    quality: "MediumQuality", // HighestQuality || MediumQuality || LowQuality
    filters: [
      {"CIfilter":"CIColorInvert"}
    ]
  },
  audio: {
    enabled: true,
    bitrate: 128000, // 128kbit/s
    channelsCount: 1, // Mono output
    format: "MPEG4AAC",
    quality: "HighestQuality" // HighestQuality || MediumQuality || LowQuality
  }
};

module.exports = Prompt;

