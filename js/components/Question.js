'use strict';

var AppConstants = require('../constants/AppConstants'),
    AppActions = require('../actions/AppActions'),
    React = require('react-native'),
    Recorder  = require('react-native-screcorder'),
    RNFS = require('react-native-fs'),
    Parse = require('parse').Parse,
    Video = require('react-native-video'),
    ᐱ = require('../utils/Percent'),
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

var secondsRemaining = 5;
var videoTimeout;

Parse.initialize("XR6QEwB3uUOhxCCT1jGigHQc9YO1vQHceRjrwAgN", "oGY2hPgTLoJJACeuV3CJTihOMDlmE04UCUqq0ABb");


var Question = React.createClass({
  mixins: [SetIntervalMixin],

  getInitialState: function() {
    return {
      done: false,
      file: null,
      recording: false,
      user: this.props.user,
      legal: false,
      videoTime: 5000,
      secondsRemaining: secondsRemaining,
      showTimeRemaining: true,
      remainingText: `You'll have ${secondsRemaining} seconds`,
      remainingWidth: AppConstants.WIDTH,
      saveInProgress: false,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    this.handleReady();
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  tick: function() {
    var w = (this.state.secondsRemaining - 1) / secondsRemaining * AppConstants.WIDTH;

    if ( w <= 0 ) {
      this.setState({remainingText: "Done"});
    }

    this.setState({ secondsRemaining: this.state.secondsRemaining - 1, remainingWidth: w });
    if( this.state.secondsRemaining <= 0 ) {
      this.setState({showTimeRemaining: false});
    }
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get(),
    });

    if(this.state.user.startRecord && !this.state.user.recordInProgress){
      this.record();
    }

    if(this.state.user.info && !this.state.saveInProgress){
      this.save();
    }
  },

  record: function() {
    AppActions.setRecordInProgress(); //Don't let it record again

    this.refs.recorder.record();
    this.setState({
      recording: true,
      remainingText: ' seconds left',
    });
    setTimeout(this.pause, 5000);

    this.setInterval(this.tick, 1000);
  },

  pause: function() {
    this.refs.recorder.pause();
    this.setState({recording: false});
    setTimeout(this.review, 2000);
  },

  review: function(){
    this.refs.recorder.save((err, url) => {

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

    //USER EMAIL: this.state.user.info.email
    //USER NAME: this.state.user.info.name

    var id = this.props.user.id; //TODO: Remove?
    var goToDone = this.goToDone;

    this.refs.recorder.save((err, url) => {

      RNFS.readFile(url.split('file:///private')[1], false)
      .then(function(contents){

        var parseFile, NewAsset, AssetData;

        parseFile = new Parse.File('video.mp4', {base64: contents});
        parseFile.save().then(function(data){

          AssetData = Parse.Object.extend("Assets");
          NewAsset = new AssetData();
          NewAsset.set("account_id", id); //TODO: Change to Email?
          NewAsset.set("asset", parseFile);
          NewAsset.save({
            success: function(data){
              goToDone();
              console.log('SUCCESS');
            },
            error: function(data){
             console.log('ERROR CONNECTING TO PARSE');
            }
          });

        }, function(error) {
          // The file either could not be read, or could not be saved to Parse.
          console.log(error);
        });
      });
    });

    this.refs.recorder.removeAllSegments();
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
  },

  resetUser: function(){
    this.refs.recorder.removeAllSegments();
    AppActions.userReset();
  },

  render: function() {
    var component, button, countdown, copy, legal, remaining;

    //VIDEO
    if (this.state.done) {
      component = (<Video source={{uri: this.state.file}} // Can be a URL or a local file.
       rate={1.0}                   // 0 is paused, 1 is normal.
       volume={1.0}                 // 0 is muted, 1 is normal.
       muted={false}                // Mutes the audio entirely.
       paused={false}               // Pauses playback entirely.
       resizeMode="cover"           // Fill the whole screen at aspect ratio.
       repeat={false}                // Repeat forever.
       style={styles.playVideo} />);
    } else {
      component = <View />;
    }

    //BUTTONS & COPY
    if(this.state.done) { //Video has been recorded & is playing back
      button = (
        <View style={styles.row}>
        <TouchableHighlight onPress={this.resetUser} underlayColor="transparent">
          <View style={[styles.readyButton, styles.rowButton]}>
            <Text style={styles.readyText}>TRASH IT</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.keep} underlayColor="transparent">
          <View style={[styles.readyButton, styles.rowButton]}>
            <Text style={styles.readyText}>SAVE IT</Text>
          </View>
        </TouchableHighlight>
        </View>
      );
      copy = (
        <View style={styles.doneCopy}>
          <Copy {...this.state} {...this.props} copy={"Yay, you did it! What do you want to do with the video?"}/>
        </View>
      );
    } else if(this.state.user.startRecord){ //User has started recording video
      button = (
        <TouchableHighlight onPress={this.handleDone} underlayColor="transparent">
          <View style={styles.readyButton}>
            <Text style={styles.readyText}>IM DONE</Text>
          </View>
        </TouchableHighlight>
      );
      copy = (
        <View style={styles.copy}>
          <Copy {...this.state} {...this.props} />
        </View>
      );
    } else { //Countdown is occuring before recording
      button = (
        <View style={styles.none} />
      );
      copy = (
        <View style={styles.copy}>
          <Copy {...this.state} {...this.props} />
        </View>
      );
    }

    //COUNTDOWN TODO: Countdown transparent background isn't happening...
    if(this.state.user.ready) {
      countdown = (
        <View style={styles.countdown}>
          <View style={styles.cameraFilter} />
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
      var secs = this.state.recording === true?  this.state.secondsRemaining : '';
      remaining = (
        <View style={styles.remainingContainer}>
          <Text style={[styles.remainingCount, styles.remainingUnderneath]}>{secs}{this.state.remainingText}</Text>
          <View style={[styles.remainingBar, {width: this.state.remainingWidth}]}>
            <View style={styles.remainingBarTextWrap}>
            <Text style={styles.remainingCount}>{secs}{this.state.remainingText}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      remaining = <View />;
    }


    return (
      <View style={styles.container}>
      <Image style={styles.pattern} source={require('image!pattern')} />

        <View style={styles.recorder}>
          <Recorder
            ref="recorder"
            config={config}
            device="front"
            style={styles.camera}>
          </Recorder>
          {countdown}
        </View>

          {component}

          {copy}
          {button}

          {legal}
          {remaining}
      </View>
    );
  },
});

module.exports = Question;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#00eae7',
    flex: 1,
    height: ᐱ.percent.h(100),
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    height: ᐱ.percent.w(60),
    width: ᐱ.percent.w(60),
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
  cameraFilter:{
    width: ᐱ.percent.w(60),
    height: ᐱ.percent.w(60),
    backgroundColor: '#ff3e9d',
    opacity: 0.7,
    position: 'absolute',
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
    margin: 12,
  },
  doneCopy: {
    marginTop: ᐱ.percent.h(3),
    backgroundColor: 'transparent',
  },
  remainingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: AppConstants.WIDTH,
    height: 100,
    backgroundColor: '#FFFF5A',
  },
  remainingBar: {
    backgroundColor: '#DD4199',
    height: 100,
    width: AppConstants.WIDTH / 2,
    overflow: 'hidden',

  },
  remainingBarTextWrap: {
    width: AppConstants.WIDTH,
    overflow: 'hidden',
    height: 100,
  },
  remainingCount: {
    color: '#ffffff',
    fontSize: 36,
    position: 'absolute',
    top: 25,
    left: 10,
  },
  remainingUnderneath: {
    color: '#DD4199',
  }
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
  },
};

