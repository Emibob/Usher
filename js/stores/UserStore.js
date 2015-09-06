'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    AppConstants = require('../constants/AppConstants'),
    {EventEmitter} = require('events'),
    _ = require('lodash');

var CHANGE_EVENT = 'change';

var _user = {
  timeRemaining: 3,
  startRecord: false,
  recordInProgress: false,
  init: false,
};

/**
 * handleInit()
 * @param  {bool}
 */
function handleInitApp() {
  _user.init = true;
  UserStore.emitChange();
}

/**
 * handleUserReady()
 * @param  {bool}
 */
function handleUserReady(bool) {
  _user.ready = bool;
  UserStore.emitChange();
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
    _user.startRecord = true;
    _user.ready = false;
    UserStore.emitChange();
  }
}

/**
 * handleSetRecordInProgress()
 */

function handleSetRecordInProgress(){
  _user.recordInProgress = true;
}

/**
 * handleUserReset()
 */

function handleUserReset(){
  //overwrite any falses we changed or added to _user obj
  _user = {
    timeRemaining: 3,
    startRecord: false,
    recordInProgress: false,
    init: false,
  };
}

/**
 * handleSaveUserInfo()
 * @param  {userInfo} email, name
 */

function handleSaveUserInfo(userInfo){
  _user.info = {email: userInfo.email, name: userInfo.name};
}

/**
 * handleVideoIsSaved()
 * @param  {bool} true
 */

function handleVideoIsSaved(bool){
  _user.videoIsSaved = bool;
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
    case AppConstants.ActionTypes.INIT_APP:
      handleInitApp();
      UserStore.emitChange();
      break;
    case AppConstants.ActionTypes.USER_READY:
      handleUserReady(action.ready);
      UserStore.emitChange();
      break;
    case AppConstants.ActionTypes.START_COUNTDOWN:
      handleCountdown(action.seconds);
      UserStore.emitChange();
      break;
    case AppConstants.ActionTypes.RECORD_IN_PROGRESS:
      handleSetRecordInProgress();
      UserStore.emitChange();
      break;
    case AppConstants.ActionTypes.USER_RESET:
      handleUserReset();
      UserStore.emitChange();
      break;
    case AppConstants.ActionTypes.VIDEO_IS_SAVED:
      handleVideoIsSaved(action.videoIsSaved);
      UserStore.emitChange();
      break;
    case AppConstants.ActionTypes.SAVE_USER_INFO:
      handleSaveUserInfo(action.userInfo);
      UserStore.emitChange();
      break;


    default:
      // no op
  }
});

module.exports = UserStore;

