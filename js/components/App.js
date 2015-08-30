'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    Question = require('../components/Question'),
    Prompt = require('../components/Prompt'),
    Error = require('../components/Error'),
    Done = require('../components/Done'),
    React = require('react-native'),
    _ = require('lodash');

var {
  Navigator,
  View,
  StyleSheet,
  Text,
} = React;

var App = React.createClass({
  getInitialState: function() {
    return {
      ready: false,
      user: UserStore.get(),
      promptTitle: 'Lion Face, Lemon Face!', //TODO: PARSE
      promptText: 'Show us your acting chops fierce to sad and back.', //TODO: PARSE
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

  render: function() {
    var component;

    console.log('this.state.user.videoIsSaved', this.state.user.videoIsSaved);

    if(this.state.user.init){
      component = <Question {...this.state} {...this.props} />;
    } else if (this.state.user.videoIsSaved) {
      component = <Done {...this.state} {...this.props} />;
    } else {
      component = <Prompt {...this.state} {...this.props} />;
    }

    return(
      <View>
        {component}
      </View>
    );
  }
});

module.exports = App;

