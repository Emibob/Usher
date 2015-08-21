'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    AppConstants = require('../constants/AppConstants');

var AppActions = {
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
};

module.exports = AppActions;
