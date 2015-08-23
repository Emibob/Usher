'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    AppConstants = require('../constants/AppConstants'),
    {EventEmitter} = require('events'),
    _ = require('lodash');

var CHANGE_EVENT = 'change';

var _user = {
  timeRemaining: 3,
  recording: false,
};

/**
 * handleUserReady()
 * @param  {bool}
 */
function handleUserReady(bool) {
  _user.ready = bool;
}

/**
 * handleCountdown()
 * @param  {number} seconds
 */
function handleCountdown(seconds){

  if (seconds > 0){

    setTimeout(function(){
      handleCountdown(_user.timeRemaining)
    }, 1500);

    _user.timeRemaining--;

    UserStore.emitChange();
  } else if (_user.timeRemaining === 0){
    _user.recording = true;
    //_user.ready = false; TODO: uncomment when done styling the countdown
    UserStore.emitChange();
  }
}



var UserStore = _.extend({}, EventEmitter.prototype, {
  /**
   * Get the user
   * @return {obj}
   */
  get: function() {
    return _user;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.ActionTypes.USER_READY:
      handleUserReady(action.ready);
      UserStore.emitChange();
      break;
    case AppConstants.ActionTypes.START_COUNTDOWN:
      handleCountdown(action.seconds);
      UserStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = UserStore;

