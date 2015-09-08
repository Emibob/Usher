'use strict';

var AppConstants = require('../constants/AppConstants'),
    AppActions = require('../actions/AppActions'),
    React = require('react-native'),
    Recorder  = require('react-native-screcorder'),
    RNFS = require('react-native-fs'),
    Parse = require('parse').Parse,
    Video = require('react-native-video'),
    ᐱ = require('../utils/Percent'),
    SharedStyles = require('./SharedStyles'),
    Animated = require('Animated'),
    tweenState = require('react-tween-state'),
    SetIntervalMixin = require('../mixins/SetIntervalMixin'),
    UserStore = require('../stores/UserStore'),
    Countdown = require('./Countdown'),
    Copy = require('./Copy'),
    Legal = require('./Legal');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
} = React;

var secondsRemaining = 45,
    videoTimeout;

Parse.initialize("XR6QEwB3uUOhxCCT1jGigHQc9YO1vQHceRjrwAgN", "oGY2hPgTLoJJACeuV3CJTihOMDlmE04UCUqq0ABb");


var Question = React.createClass({
  mixins: [SetIntervalMixin, tweenState.Mixin],

  getInitialState: function() {
    return {
      done: false,
      file: null,
      recording: false,
      user: this.props.user,
      legal: false,
      videoTime: secondsRemaining * 1000,
      secondsRemaining: secondsRemaining,
      showTimeRemaining: true,
      remainingText: `YOU'LL HAVE ${secondsRemaining} SECONDS`,
      width: 0,
      saveInProgress: false,
      remainingTextOpacity: 0,
      doneButtonOpacity: 0,
      doneButtonRemoved: false,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    this.animateInRemainingText();
    this.handleReady();
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  tick: function() {
    if (this.state.done) { return; }
    var w = (this.state.secondsRemaining - 1) / secondsRemaining * AppConstants.WIDTH;

    if ( w <= 0 ) {
      this.setState({remainingText: "DONE"});
    }

    this.setState({ secondsRemaining: this.state.secondsRemaining - 1});
    if( this.state.secondsRemaining <= 0 ) {
      this.setState({
        showTimeRemaining: false,
        doneButtonRemoved: true,
      });
      this.handleDoneButton(0);
    }
  },

  animateBar: function() {
    var secs = secondsRemaining * 1000;

    this.state.width = 0;

    this.tweenState('width', {
      easing: tweenState.easingTypes.linear,
      duration: secs,
      endValue: ᐱ.percent.w(60),
    });
  },

  animateInRemainingText: function() {
    this.tweenState('remainingTextOpacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      duration: 500,
      endValue: this.state.remainingTextOpacity === 0 ? 1 : 0,
    });
  },

  handleDoneButton: function(delay) {
    this.tweenState('doneButtonOpacity', {
      easing: tweenState.easingTypes.easeOutQuint,
      delay: delay,
      duration: 700,
      endValue: (this.state.doneButtonOpacity === 0 && !this.state.doneButtonRemoved) ? 1 : 0,
    });
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get(),
    });

    if(this.state.user.startRecord && !this.state.user.recordInProgress) {
      this.record();
    }

    if(this.state.user.info && !this.state.saveInProgress) {
      this.save();
    }
  },

  record: function() {
    var secs = secondsRemaining * 1000;

    AppActions.setRecordInProgress(); //Don't let it record again
    this.handleDoneButton(3000);

    this.refs.recorder.record();
    this.setState({
      recording: true,
      remainingText: ' SECONDS LEFT',
    });
    videoTimeout = setTimeout(this.pause, secs);

   this.setInterval(this.tick, 1000);
   this.animateBar();
  },

  pause: function() {
    this.refs.recorder.pause();
    this.setState({recording: false});
    setTimeout(this.review, 1000);
  },

  review: function(){
    this.refs.recorder.save((err, url) => {

      console.log(url);
      this.setState({
        done: true,
        file: url
      });
    });
  },

  keep: function(){
    this.setState({
      legal: true,
    });
  },

  save: function() {
    this.setState({
      saveInProgress: true,
    });

    var goToDone = this.goToDone;

    this.refs.recorder.saveToCameraRoll(`${this.state.user.info.name} (${this.state.user.info.email})`, (err, url) => {
      this.refs.recorder.removeAllSegments();
      setTimeout(goToDone, 500);
    });
  },

  goToDone: function(){
    if(!this.state.user.videoIsSaved){
      AppActions.VideoIsSaved(true);
    }
  },

  handleReady: function(){
    AppActions.userReady(true);
  },

  handleDone: function(){
    clearTimeout(videoTimeout);
    this.pause();

    this.setState({
      showTimeRemaining: false,
      doneButtonRemoved: true,
    });

    this.handleDoneButton();
  },

  resetUser: function(){
    this.refs.recorder.removeAllSegments();
    AppActions.userReset();
  },

  render: function() {
    var component, button, countdown, copy, legal, remaining, background, footer;

    //VIDEO
    if (this.state.done) {
      component = (<Video source={{uri: this.state.file}} // Can be a URL or a local file.
       rate={1.0}                   // 0 is paused, 1 is normal.
       volume={1.0}                 // 0 is muted, 1 is normal.
       muted={true}                // Mutes the audio entirely.
       paused={false}               // Pauses playback entirely.
       resizeMode="cover"           // Fill the whole screen at aspect ratio.
       repeat={true}                // Repeat forever.
       style={styles.playVideo} />);
    } else {
      component = <View />;
    }

    //BUTTONS & COPY
    if(this.state.done) { //Video has been recorded & is playing back
      button = (
        <View style={styles.row}>
          <TouchableHighlight onPress={this.keep} style={[SharedStyles.buttonContainer, styles.rowButton]} underlayColor="transparent">
            <Text style={SharedStyles.buttonText}>YES</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.resetUser} style={[SharedStyles.buttonContainer, styles.rowButton]} underlayColor="transparent">
            <Text style={SharedStyles.buttonText}>NO</Text>
          </TouchableHighlight>
        </View>
      );
      copy = (
        <View style={styles.doneCopy}>
          <Text style={[SharedStyles.titleText, {marginTop: 20, marginBottom: 10}]}>CAN WE FEATURE YOUR THOUGHTS IN A REFINERY29 VIDEO?</Text>
        </View>
      );
    } else if(this.state.user.startRecord) { //User has started recording video
      button = (
        <TouchableHighlight onPress={this.handleDone} style={[SharedStyles.buttonContainer, styles.doneButton, {opacity: this.getTweeningValue('doneButtonOpacity')}]} underlayColor="transparent">
          <Text style={SharedStyles.buttonText}>I'M DONE!</Text>
        </TouchableHighlight>
      );
      copy = <View />;
    } else { //Countdown is occuring before recording
      button = (
        <View style={[SharedStyles.buttonContainer, styles.doneButton, {opacity: 0}]} />
      );
      copy = <View />;
    }

    //COUNTDOWN
    if(this.state.user.ready) {
      countdown = (
        <View style={styles.countdown}>
          <Countdown style={styles.countdownNumbers} {...this.state} {...this.props} />
        </View>
      );
    } else {
      countdown = <View style={styles.none} />
    }

    //LEGAL
    if (this.state.legal) {
      legal = (
        <View style={styles.legal}>
          <Legal {...this.state} {...this.props} />
        </View>);
    } else {
      legal = <View style={styles.none} />;
    }

    //TIME REMAINING
    if (this.state.showTimeRemaining) {
      var secs = this.state.recording === true ?  this.state.secondsRemaining : '';
      remaining = (
        <View style={styles.remainingContainer}>
          <Text style={[styles.remainingCount, styles.remainingUnderneath]}>{secs}{this.state.remainingText}</Text>
          <Animated.View style={[styles.remainingBar, {width: this.getTweeningValue('width')}]}>
            <View style={styles.remainingBarTextWrap}>
            <Animated.Text style={[styles.remainingCount, {opacity: this.getTweeningValue('remainingTextOpacity')}]}><Text style={{fontWeight: 'bold'}}>{secs}</Text>{this.state.remainingText}</Animated.Text>
            </View>
          </Animated.View>
        </View>
      );
    } else {
      remaining = <View />;
    }

    //BACKGROUND
    if(this.state.done && !this.state.legal) {
      background = <Image style={styles.patternPrimary} source={{uri: 'circles', isStatic: true}} />;
      footer = <Image style={styles.patternSecondaryShort} source={{uri: 'pinkstripes', isStatic: true}} />;
    } else if(this.state.legal) {
      background = <Image style={styles.patternPrimary} source={{uri: 'diagonal', isStatic: true}} />;
      footer = <Image style={styles.patternSecondaryShort} source={{uri: 'pinkstripes', isStatic: true}} />;
    } else {
      background = <Image style={styles.patternPrimary} source={{uri: 'stars', isStatic: true}} />;
      footer = <Image style={styles.patternSecondary} source={{uri: 'pinkstripes', isStatic: true}} />;
    }


    return (
      <View style={styles.container}>
      {background}

          <View style={styles.recorder}>
            <Recorder
              ref="recorder"
              config={config}
              device="front"
              style={styles.camera}>
            </Recorder>
            {countdown}
            {remaining}
          </View>
          {component}

          {copy}
          {button}

          {legal}
          {footer}
          
      </View>
    );
  },
});

module.exports = Question;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#1d3586',
    flex: 1,
    height: ᐱ.percent.h(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternPrimary: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(100),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  camera: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ᐱ.percent.w(60),
    height: ᐱ.percent.w(60),
    flex: 1,
    backgroundColor:'transparent',
  },
  countdown: {
    backgroundColor: 'transparent',
    position: 'absolute',
    marginTop: ᐱ.percent.w(-60),
  },
  countdownNumbers: {
    backgroundColor:'transparent',
  },
  recorder: {
    height: ᐱ.percent.w(60),
    width: ᐱ.percent.w(60),
  },
  playVideo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ᐱ.percent.w(60),
    width: ᐱ.percent.w(60),
    backgroundColor:'transparent',
    position: 'absolute',
    marginTop: ᐱ.percent.w(-60),
    marginLeft: ᐱ.percent.w(20)
  },
  none: {
    width: 0,
    height: 0,
  },
  copy: {
    backgroundColor: 'transparent',
    width: ᐱ.percent.w(100),
  },
  legal: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  rowButton: {
    marginTop: 20,
    marginLeft: 12,
    marginRight: 12,
  },
  doneCopy: {
    marginTop: ᐱ.percent.h(3),
    backgroundColor: 'transparent',
  },


  remainingContainer: {
    position: 'absolute',
    width: ᐱ.percent.w(60),
    height: ᐱ.percent.h(5),
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  remainingBar: {
    backgroundColor: '#facbcb',
    height: ᐱ.percent.h(5),
    width: ᐱ.percent.w(60)/ 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  remainingBarTextWrap: {
    width: ᐱ.percent.w(60),
    overflow: 'hidden',
    height: ᐱ.percent.h(5),
    justifyContent: 'center',
  },
  remainingCount: {
    color: 'white',
    fontSize: 15,
    position: 'absolute',
    top: 15,
    left: 25,
    fontFamily: 'BrownStd-Regular',
    letterSpacing: 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  remainingUnderneath: {
    width: ᐱ.percent.w(60),
    color: '#1d3586',
    letterSpacing: 2,
  },


  doneButton: {
    marginTop: ᐱ.percent.h(10),
  },
  patternSecondary: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(5),
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  patternSecondaryShort: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(5),
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
    quality: "HighestQuality" // HighestQuality || MediumQuality || LowQuality
  },
  audio: {
    enabled: true,
    bitrate: 128000, // 128kbit/s
    channelsCount: 2, // Mono output
    format: "MPEG4AAC",
    quality: "HighestQuality" // HighestQuality || MediumQuality || LowQuality
  },
};

