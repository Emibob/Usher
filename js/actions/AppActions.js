'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    AppConstants = require('../constants/AppConstants');

var AppActions = {
  initApp: function(){
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.INIT_APP,
    });
  },
  userReady: function(bool) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.USER_READY,
      ready: bool,
    });
  },
  startCountdown: function(seconds){
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.START_COUNTDOWN,
      seconds: seconds,
    });
  },
  setRecordInProgress: function(){
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.RECORD_IN_PROGRESS,
    });
  },
  userReset: function(){
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.USER_RESET,
    });
  },
  saveUserInfo: function(userInfo){
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.SAVE_USER_INFO,
      userInfo: userInfo,
    });
  },
  VideoIsSaved: function(bool){
    AppDispatcher.dispatch({
      actionType: AppConstants.ActionTypes.VIDEO_IS_SAVED,
      videoIsSaved: bool,
    });
  },
};

module.exports = AppActions;