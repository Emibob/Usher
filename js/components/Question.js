'use strict';

var AppConstants = require('../constants/AppConstants'),
    AppActions = require('../actions/AppActions'),
    React = require('react-native'),
    Recorder  = require('react-native-screcorder'),
    RNFS = require('react-native-fs'),
    Parse = require('parse').Parse,
    Video = require('react-native-video'),
    ᐱ = require('../utils/Percent'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
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


Parse.initialize("XR6QEwB3uUOhxCCT1jGigHQc9YO1vQHceRjrwAgN", "oGY2hPgTLoJJACeuV3CJTihOMDlmE04UCUqq0ABb");


var Question = React.createClass({

  getInitialState: function() {
    return {
      done: false,
      file: null,
      recording: false,
      user: this.props.user,
      legal: false,
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

  _onChange: function() {
    this.setState({
      user: UserStore.get(),
    });

    if(this.state.user.startRecord && !this.state.user.recordInProgress){
      this.record();
    }

    //BUG: Called twice...
    if(this.state.user.info && !this.state.saveInProgress){
      this.save();
    }
  },

  record: function() {
    AppAction.setRecordInProgress(); //Don't let it record again

    this.refs.recorder.record();
    this.setState({recording: true});
    setTimeout(this.pause, 5000);
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

    //this.goToDone(); //set VideoSaved & go to Done screen
  },

  goToDone: function(){
    if(!this.state.user.videoIsSaved){
      console.log('goToDone is called!!!!!');
      AppAction.VideoIsSaved(true);
    }
  },

  handleReady: function(){
    AppAction.userReady(true);
  },

  handleDone: function(){
    this.pause();
  },

  resetUser: function(){
    AppAction.userReset();
  },

  render: function() {
    var component, button, countdown, copy, legal;

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
    if(this.state.done){ //Video has been recorded & is playing back
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
  }
};

