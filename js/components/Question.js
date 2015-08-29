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
    Countdown = require('./Countdown');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} = React;


Parse.initialize("XR6QEwB3uUOhxCCT1jGigHQc9YO1vQHceRjrwAgN", "oGY2hPgTLoJJACeuV3CJTihOMDlmE04UCUqq0ABb");


var Question = React.createClass({

  getInitialState: function() {
    return {
      done: false,
      file: null,
      recording: false,
      user: this.props.user,
    };
  },
  
  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    //this.handleReady();
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
  },

  record: function() {
    AppAction.setRecordInProgress(); //Don't let it record again

    this.refs.recorder.record();
    this.setState({recording: true});
    setTimeout(this.pause, 5000);
  },

  capture: function() {
    this.refs.recorder.capture((err, url) => {
      // Playing with the picture
    });
  },

  pause: function() {
    this.refs.recorder.pause();
    this.setState({recording: false});
    //setTimeout(this.save, 2000);
    setTimeout(this.review, 2000);
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

  save: function() {
    var id = this.props.user.id;

    this.refs.recorder.save((err, url) => {
      // Playing with the generated video

      //console.log(url);
      // this.setState({
      //   done: true,
      //   file: url
      // });

      //TODO: Might need to call an action that sets a timeout on the video playback
      //so we can progress on to save/trash

      RNFS.readFile(url.split('file:///private')[1], false)
      .then(function(contents){
        var parseFile, NewAsset, AssetData;

        parseFile = new Parse.File('video.mp4', {base64: contents});
        parseFile.save().then(function(data){
          
          AssetData = Parse.Object.extend("Assets");
          NewAsset = new AssetData();
          NewAsset.set("account_id", id);
          NewAsset.set("asset", parseFile);
          NewAsset.save({
            success: function(data){
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
    var component, button, countdown;

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

    //BUTTONS
    if(this.state.done){
      button = (
        <View>
        <TouchableHighlight onPress={this.resetUser} underlayColor="transparent">
          <View style={styles.readyButton}>
            <Text style={styles.readyText}>TRASH</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.save} underlayColor="transparent">
          <View style={styles.readyButton}>
            <Text style={styles.readyText}>SAVE</Text>
          </View>
        </TouchableHighlight>
        </View>
      );
    } else if(this.state.user.startRecord){
      button = (
        <TouchableHighlight onPress={this.handleDone} underlayColor="transparent">
          <View style={styles.readyButton}>
            <Text style={styles.readyText}>IM DONE</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      button = (
        <TouchableHighlight onPress={this.handleReady} underlayColor="transparent">
          <View style={styles.readyButton}>
            <Text style={styles.readyText}>IM READY</Text>
          </View>
        </TouchableHighlight>
      );
    }

    //COUNTDOWN
    if(this.state.user.ready) {
      countdown = (
        <View style={styles.countdown}>
          <View style={styles.cameraFilter} />
          <Countdown {...this.state} {...this.props}/>
        </View>
      );
    } else {
      countdown = <View style={styles.none}/>
    }


    return (
      <View style={styles.container}>
        
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
          
          {button}
      </View>
    );
  },
});

module.exports = Question;

var styles = StyleSheet.create({
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
  container: {
    backgroundColor: '#00eae7',
    flex: 1,
    height: ᐱ.percent.h(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  none: {
    width: 0,
    height: 0,
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

