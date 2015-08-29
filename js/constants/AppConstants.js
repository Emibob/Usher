'use strict';

var Device = require('../utils/Device'),
    Dimensions = require('Dimensions'),
    keyMirror = require('keymirror');

var HEIGHT = Dimensions.get('window').height,
    WIDTH = Dimensions.get('window').width;

module.exports = {
  HEIGHT: HEIGHT,
  WIDTH: WIDTH,

  ActionTypes: keyMirror({
    USER_READY: null,
    START_COUNTDOWN: null,
    RECORD_IN_PROGRESS: null,
    USER_RESET: null,
    INIT_APP: null,
  }),
};
