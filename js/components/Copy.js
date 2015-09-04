'use strict';

var AppConstants = require('../constants/AppConstants'),
    React = require('react-native'),
    SharedStyles = require('./SharedStyles'),
    ᐱ = require('../utils/Percent');

var {
  View,
  StyleSheet,
  Text,
} = React;

var Copy = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var text;

    if(this.props.copy) {
      var text = <Text style={SharedStyles.messageText}>{this.props.copy.toUpperCase()}</Text>;
    } else {
       var text = (
        <View style={{backgroundColor: 'transparent'}}>
          <Text style={SharedStyles.titleText}>{this.props.promptTitle.toUpperCase()}</Text>
          <Text style={SharedStyles.messageText}>{this.props.promptText.toUpperCase()}</Text>
        </View>
      );
    }

    return(
      <View style={{backgroundColor: 'transparent'}}>
        {text}
      </View>
    );
  }
});

module.exports = Copy;

