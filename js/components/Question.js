'use strict';

var AppConstants = require('../constants/AppConstants'),
    AppActions = require('../actions/AppActions'),
    React = require('react-native'),
    Recorder  = require('react-native-screcorder'),
    RNFS = require('react-native-fs'),
    Parse = require('parse').Parse,
    Video = require('react-native-video'),
    ᐱ = require('../utils/Percent');

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
    };
  },
  componentDidMount: function() {
    setTimeout(this.record, 1000);
  },

  record: function() {
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
    setTimeout(this.save, 2000);
  },

  save: function() {
    var id = this.props.user.id;

    this.refs.recorder.save((err, url) => {
      // Playing with the generated video

      console.log(url);
      this.setState({
        done: true,
        file: url
      });

      RNFS.readFile(url.split('file:///private')[1], false)
      .then(function(contents){
        var parseFile, NewAsset, AssetData;

        parseFile = new Parse.File('video.mp4', {base64: contents});
        parseFile.save().then(function(data){
          console.log(Object.keys(data));
          AssetData = Parse.Object.extend("Assets");

          NewAsset = new AssetData();
          NewAsset.set("account_id", id);
          NewAsset.set("asset", parseFile);
          NewAsset.save({
            success: function(data){
              console.log('yaaa', data);
            },
            error: function(data){
             console.log('damn');
            }
          });

        }, function(error) {
          // The file either could not be read, or could not be saved to Parse.
          console.log(error);
        });
      });
    });
  },

  render: function() {
    var component;

    if (this.state.done) {
      component = <Video source={{uri: this.state.file}} // Can be a URL or a local file.
       rate={1.0}                   // 0 is paused, 1 is normal.
       volume={1.0}                 // 0 is muted, 1 is normal.
       muted={false}                // Mutes the audio entirely.
       paused={false}               // Pauses playback entirely.
       resizeMode="cover"           // Fill the whole screen at aspect ratio.
       repeat={true}                // Repeat forever.
       style={styles.backgroundVideo} />;
    } else {
      component = <View />;
    }

    return (
      <View>
          <Recorder
            ref="recorder"
            config={config}
            device="front"
            style={styles.camera}>
          </Recorder>
          {component}

          <TouchableHighlight onPress={this.capture}>
          <View style={styles.readyButton}>
            <Text style={styles.readyText}>IM DONE</Text>
          </View>
        </TouchableHighlight>

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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
    //   {
    //   "CIfilter": "CIColorControls",
    //   "animations": [{
    //     "name": "inputSaturation",
    //     "startValue": 50,
    //     "endValue": 0,
    //     "startTime": 0,
    //     "duration": 1
    //   }]
    // },
    //{"CIfilter":"CIHueAdjust", "inputAngle": 0.7}
    //{"CIfilter":"CIVibrance", "inputAmount": 0.7}
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

