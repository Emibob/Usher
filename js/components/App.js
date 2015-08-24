'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    QuestionStore = require('../stores/QuestionStore'),
    Prompt = require('../components/Prompt'),
    Countdown = require('../components/Countdown'),
    Recording = require('../components/Recording'),
    Legal = require('../components/Legal'),
    Share = require('../components/Share'),
    Quit = require('../components/Quit'),
    Error = require('../components/Error'),
    Question = require('../components/Question'),
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
      question: QuestionStore.get(),
      user: UserStore.get(),
      promptTitle: 'Lion Face, Lemon Face!', //TODO: PARSE
      promptText: 'Show us your acting chops fierce to sad and back.', //TODO: PARSE
    };
  },

  componentDidMount: function() {
    QuestionStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    QuestionStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      user: UserStore.get()
    });
  },

  render: function() {
    var component;


      component = <Prompt {...this.state} {...this.props} />;

    return(
      <View>
        {component}
      </View>
    );
  }
});

module.exports = App;

