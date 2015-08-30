'use strict';

var AppConstants = require('../constants/AppConstants'),
    React = require('react-native'),
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
      var text = <Text style={styles.promptText}>{this.props.copy.toUpperCase()}</Text>;
    } else {
       var text = (
        <View style={{backgroundColor: 'transparent'}}>
          <Text style={styles.promptTitle}>{this.props.promptTitle.toUpperCase()}</Text>
          <Text style={styles.promptText}>{this.props.promptText.toUpperCase()}</Text>
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

var styles = StyleSheet.create({
  promptTitle: {
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
  },
  promptText: {
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
});

