'use strict';

var React = require('react-native'),
		AppConstants = require('../constants/AppConstants'),
		ᐱ = require('../utils/Percent');

var {
  StyleSheet,
} = React;

var SharedStyles = StyleSheet.create({
	titleText: {
    color: '#facbcb',
    marginTop: 30,
    fontSize: ᐱ.percent.h(4),
    fontFamily: 'BrownStd-Bold',
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(6),
    paddingRight: ᐱ.percent.w(6),
    paddingBottom: 0,
    width: ᐱ.percent.w(100),
    textAlign: 'center',
    lineHeight: ᐱ.percent.h(7),
  },
  messageText: {
    color: 'white',
    fontSize: ᐱ.percent.h(2.7),
    fontFamily: 'BrownStd-Bold',
    backgroundColor: 'transparent',
    paddingTop: 0,
    width: ᐱ.percent.w(100),
    textAlign: 'center',
    marginBottom: ᐱ.percent.h(4),
  },
  buttonContainer: {
    width: ᐱ.percent.w(35),
    height: ᐱ.percent.h(8),
    backgroundColor: 'white',
    borderRadius: ᐱ.percent.h(8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    width: ᐱ.percent.w(35),
    textAlign: 'center',
    color: '#1d3586',
    fontFamily: 'BrownStd-Bold',
    fontSize: ᐱ.percent.h(3),
    backgroundColor: 'transparent',
    padding: ᐱ.percent.w(2),
  },
});

module.exports = SharedStyles;