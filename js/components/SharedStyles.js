'use strict';

var React = require('react-native'),
		AppConstants = require('../constants/AppConstants'),
		ᐱ = require('../utils/Percent');

var {
  StyleSheet,
} = React;

var SharedStyles = StyleSheet.create({
	titleText: {
    color: 'white',
    marginTop: 30,
    fontSize: ᐱ.percent.h(3.9),
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
    paddingBottom: 0,
    width: ᐱ.percent.w(100),
  },
  messageText: {
    color: 'white',
    fontSize: ᐱ.percent.h(2.7),
    fontFamily: 'BrownStd-Bold',
    shadowRadius: 0,
    shadowOffset: {width: 2},
    shadowColor: '#00eae7',
    shadowOpacity: 1,
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
    paddingRight: ᐱ.percent.w(8),
    paddingTop: 0,
    marginBottom: ᐱ.percent.h(4),
  },
  buttonContainer: {
    width: ᐱ.percent.w(35),
    height: ᐱ.percent.h(4.8),
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#0072ff',
    shadowRadius: 0,
    shadowOffset: {width: 3, height: -3},
    shadowColor: 'white',
    shadowOpacity: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0072ff',
    fontFamily: 'BrownStd-Bold',
    fontSize: ᐱ.percent.h(3),
    backgroundColor: 'transparent',
  },
});

module.exports = SharedStyles;