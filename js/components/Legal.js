'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    React = require('react-native'),
    AppActions = require('../actions/AppActions'),
    SharedStyles = require('./SharedStyles'),
    ᐱ = require('../utils/Percent');

var {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
} = React;

var Legal = React.createClass({
  getInitialState: function() {
    return {
      start: false,
      user: UserStore.get(),
      bumpedUp: 0,
      loading: false,
      error: false,
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({user: UserStore.get()});
  },

  handleAccept: function() {

    this.refs.name.blur();
    this.refs.email.blur();

    var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    
    if(emailRegex.test(this.state.email)) {
      this.setState({
        loading: true,
        error: false,
      });

      AppActions.saveUserInfo({
        email: this.state.email,
        name: this.state.name
      });
    } else {
      console.log('setting the error');
      this.setState({
        error: "Please enter a valid email address",
      });
    }
  },

  handleCancel: function() {
    AppActions.userReset();
  },

  shiftFocus: function() {
    this.setState({
      bumpedUp: 1,
    });
  },

  render: function() {
    var legalCopy;

    if (this.state.bumpedUp && !this.state.loading && !this.state.error) {
      legalCopy = <View style={styles.halfScreen} />
    } else if (this.state.loading) {
      legalCopy = <Text style={[styles.halfScreen, SharedStyles.titleText]}>Saving...</Text>
    } else if (this.state.error) {
      legalCopy = <Text style={[styles.halfScreen, SharedStyles.titleText]}>{this.state.error}</Text>
    } else {
      legalCopy = <Text style={styles.legalCopy}>PHOTO/VIDEO RELEASE: For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, I hereby grant to Refinery 29 Inc. (“Company”) and its assigns, licensees, sublicensees, successors-in-interest, legal representatives, and heirs the absolute, irrevocable right and retroactive (if applicable), unrestricted permission to use photograph(s), video, audio, and audio-visual recordings, as well as results and proceeds thereof of my likeness and voice taken of me by or on behalf of the Company (collectively, the “Content”) in all forms, in all medium, in any manner, for any commercial, editorial or any other lawful purposes in connection with photos or videos designated by Refinery29. I hereby waive any right to royalties or other compensation arising from or related to the use of the Content. I also hereby agree to release, defend, and hold harmless the Company and its agents or employees, from and against any claims or liability arising from or related to the rights granted herein. It is the discretion of the Company to decide whether and how to use the Content. I agree to execute in the future any further documents that may be necessary to perfect Company’s ownership of all rights in the Content or other works containing the Content. I acknowledge that I will not have any rights or interest in the assets containing the Content whatsoever. Nothing herein will be construed to obligate Company to produce, distribute or use any of the rights granted herein. This agreement will be construed according to the laws of the State of New York applicable to agreements which are executed and fully performed within said State. This agreement contains the entire understanding of the parties relating to the subject matter, and this agreement cannot be changed except by written agreement executed by the Party to be bound. I hereby warrant that I am at least 18 years old or that I am the parent or guardian of the participant. This release will be binding upon me and my heirs, legal representatives, and assigns. Prior to checking the box, I have read the above authorization, release, and agreement, prior to its execution, and I am fully familiar with the contents thereof.</Text>;
    }

    return(
      <View style={styles.container}>

      {legalCopy}
        
        <TextInput
          ref="name"
          style={styles.inputs}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          onFocus={this.shiftFocus}
          enablesReturnKeyAutomatically={true}
          autoCorrect={true}
          defaultValue={"Name"}
          clearTextOnFocus={true}
        />

        <TextInput
          ref="email"
          style={styles.inputs}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          onFocus={this.shiftFocus}
          enablesReturnKeyAutomatically={true}
          autoCorrect={true}
          defaultValue={"Email"}
          clearTextOnFocus={true}
        />

        <View style={styles.buttons}>
          <TouchableHighlight onPress={this.handleAccept} style={[styles.rowButton, SharedStyles.buttonContainer]} underlayColor="transparent">
            <Text style={SharedStyles.buttonText}>ACCEPT</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.handleCancel} style={[styles.rowButton, SharedStyles.buttonContainer]} underlayColor="transparent">
            <Text style={SharedStyles.buttonText}>CANCEL</Text>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
});

module.exports = Legal;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#00eae7',
    width: AppConstants.WIDTH,
    height: AppConstants.HEIGHT,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalCopy: {
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
    paddingTop: ᐱ.percent.w(8),
    marginBottom: ᐱ.percent.h(4),
    width: ᐱ.percent.w(100),
    flex: 4,
  },
  buttons: {
    flexDirection: 'row',
    flex: 1,
  },
  inputs: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    margin: 10,
    color: 'white',
    padding: 4,
    marginLeft: ᐱ.percent.w(8),
    marginRight: ᐱ.percent.w(8),
    fontFamily: 'BrownStd-Bold',
  },
  halfScreen: {
    flex: 0.5,
  },
  rowButton: {
    margin: 12,
  },
});
