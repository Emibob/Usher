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
    fontFamily: 'BrownStd-Regular',
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(6),
    paddingRight: ᐱ.percent.w(6),
    paddingBottom: 0,
    width: ᐱ.percent.w(100),
    textAlign: 'center',
    lineHeight: ᐱ.percent.h(7),
    letterSpacing: 2,
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
    width: ᐱ.percent.w(17),
    height: ᐱ.percent.h(5),
    backgroundColor: 'white',
    borderRadius: ᐱ.percent.h(5) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    width: ᐱ.percent.w(20),
    textAlign: 'center',
    color: '#1d3586',
    fontFamily: 'BrownStd-Bold',
    fontSize: ᐱ.percent.h(1.5),
    backgroundColor: 'transparent',
    padding: ᐱ.percent.w(2),
  },
});

module.exports = SharedStyles;
