'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    AppAction = require('../actions/AppActions'),
    Recorder  = require('react-native-screcorder'),
    React = require('react-native'),
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
  getInitialState: function() {
    return {
      user: this.props.user,
      promptTitle: this.props.promptTitle,
      promptText: this.props.promptText,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get()
    });
  },

  handleAppInit: function(){
    AppAction.initApp();
  },

  render: function() {
    var countdown, logo, button, readyText, copy;

      logo = <Image style={styles.logo} source={require('image!diamonLogo')} />;
      readyText = <Text style={styles.bringIt}>READY TO BRING IT?</Text>;
      button = (
        <TouchableHighlight onPress={this.handleAppInit}>
          <View style={styles.readyButton}>
            <Text style={styles.readyText}>IM READY</Text>
          </View>
        </TouchableHighlight>
      );

    return(
      <View style={styles.container}>

        <Image style={styles.pattern} source={require('image!pattern')} />
        {logo}
        {readyText}
        <Copy {...this.state} {...this.props} />

        <View style={styles.center}>
          {button}
        </View>
        <View style={styles.cameraContainer}>
        <Image style={styles.frameLeft} source={require('image!cameraFrame')} />
        <Image style={styles.frameRight} source={require('image!cameraFrame')} />
          <Recorder
              ref="recorder"
              config={config}
              device="front"
              style={styles.camera}>
          </Recorder>
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
  frameLeft: {
    width: 94,
    height: 94,
    position: 'absolute',
    bottom: -15,
    left: 270,
  },
  frameRight: {
    width: 94,
    height: 94,
    position: 'absolute',
    top: 5,
    right: 270,
  },
  camera: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  container: {
    backgroundColor: '#00eae7',
    height: AppConstants.HEIGHT,
    width: AppConstants.WIDTH,
    flexDirection: 'column',
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
  logo: {
    width: ᐱ.percent.h(15),
    height: ᐱ.percent.h(14),
    backgroundColor: 'transparent',
    marginLeft: ᐱ.percent.w(2),
    marginBottom: ᐱ.percent.h(2),
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
  // triangles: { //<Image style={styles.triangles} source={require('image!triangles')} />
  //   width: ᐱ.percent.w(60),
  //   flex: 1,
  //   backgroundColor: 'transparent',
  // }
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

