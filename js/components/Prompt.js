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
      stripesHeight: ᐱ.percent.h(27),
      buttonOpacity: 1,
      fakeRemainingBarOpacity: 0,
      infoOpacity: 1,
      recorderPosition: ᐱ.percent.h(6),
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
    this.animatePage();
    setTimeout(AppAction.initApp, 1400)
  },

  animatePage: function(){
    //BAR
    this.tweenState('stripesHeight', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 500,
      endValue: this.state.stripesHeight === ᐱ.percent.h(27) ? ᐱ.percent.h(10) : ᐱ.percent.h(27),
    });
    this.tweenState('fakeRemainingBarOpacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 500,
      endValue: this.state.fakeRemainingBarOpacity === 1 ? 0 : 1,
    });
    this.tweenState('buttonOpacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 200,
      endValue: this.state.buttonOpacity === 0 ? 1 : 0,
    });

    //TEXT & LOGO
    this.tweenState('infoOpacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      delay: 500,
      duration: 700,
      endValue: this.state.infoOpacity === 1 ? 0 : 1,
    });

    //REC
    this.tweenState('recorderPosition', {
      easing: tweenState.easingTypes.easeOutQuint,
      delay: 1200,
      duration: 900,
      endValue: this.state.recorderPosition === ᐱ.percent.h(6) ? ᐱ.percent.h(39) : ᐱ.percent.h(6),
    });
  },

  render: function() {
    return(
      <View style={styles.container}>

        <Image style={styles.patternPrimary} source={require('image!stars')} />

        <Image style={[styles.logo, {opacity: this.getTweeningValue('infoOpacity')}]} source={require('image!whitelogo')} />

        <Text style={[SharedStyles.titleText, {marginTop: 20, opacity: this.getTweeningValue('infoOpacity')}]}>IF YOU HAD 45 SECONDS,{'\n'} WHAT WOULD YOU{'\n'} TELL THE PRESIDENT?</Text>

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
          <View style={[styles.cameraBorder, {marginTop: this.getTweeningValue('recorderPosition')}]}>
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
    width: ᐱ.percent.w(22),
    height: ᐱ.percent.w(22),
  },
  cameraBorder: {
    marginTop: ᐱ.percent.h(6),
    width: ᐱ.percent.w(27),
    height: ᐱ.percent.w(27),
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
    height: ᐱ.percent.h(27),
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  patternSecondary: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(27),
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
  },
  logo: {
    width: ᐱ.percent.h(12),
    height: ᐱ.percent.h(12),
    marginTop: -20,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  center: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
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
    bitrate: 127000, // 127kbit/s
    channelsCount: 1, // Mono output
    format: "MPEG4AAC",
    quality: "HighestQuality" // HighestQuality || MediumQuality || LowQuality
  }
};

module.exports = Prompt;

