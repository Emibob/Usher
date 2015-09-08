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
  Image,
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

  focusEmail: function() {
    this.refs.email.focus();
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
      legalCopy = (
        <View style={{backgroundColor: 'transparent', flex: 3, marginTop: 60}}>
          <Text style={[SharedStyles.messageText, {color: '#facbcb', marginBottom: 0, paddingTop: ᐱ.percent.w(4), fontSize: ᐱ.percent.h(2.5)}]}>Can we feature your thoughts in a Refinery29 video?</Text>
          <Text style={styles.legalCopy}>PHOTO/VIDEO RELEASE: For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, I hereby grant to Refinery 29 Inc. (“Company”) and its assigns, licensees, sublicensees, successors-in-interest, legal representatives, and heirs the absolute, irrevocable right and retroactive (if applicable), unrestricted permission to use photograph(s), video, audio, and audio-visual recordings, as well as results and proceeds thereof of my likeness and voice taken of me by or on behalf of the Company (collectively, the “Content”) in all forms, in all medium, in any manner, for any commercial, editorial or any other lawful purposes in connection with photos or videos designated by Refinery29. I hereby waive any right to royalties or other compensation arising from or related to the use of the Content. I also hereby agree to release, defend, and hold harmless the Company and its agents or employees, from and against any claims or liability arising from or related to the rights granted herein. It is the discretion of the Company to decide whether and how to use the Content. I agree to execute in the future any further documents that may be necessary to perfect Company’s ownership of all rights in the Content or other works containing the Content. I acknowledge that I will not have any rights or interest in the assets containing the Content whatsoever. Nothing herein will be construed to obligate Company to produce, distribute or use any of the rights granted herein. This agreement will be construed according to the laws of the State of New York applicable to agreements which are executed and fully performed within said State. This agreement contains the entire understanding of the parties relating to the subject matter, and this agreement cannot be changed except by written agreement executed by the Party to be bound. I hereby warrant that I am at least 18 years old or that I am the parent or guardian of the participant. This release will be binding upon me and my heirs, legal representatives, and assigns. Prior to checking the box, I have read the above authorization, release, and agreement, prior to its execution, and I am fully familiar with the contents thereof.</Text>
        </View>
      );
    }

    return(
      <View style={styles.container}>
      <Image style={styles.patternPrimary} source={require('image!diagonal')} />

      {legalCopy}

        <TextInput
          ref="name"
          style={styles.inputs}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          onFocus={this.shiftFocus}
          enablesReturnKeyAutomatically={true}
          autoCorrect={true}
          placeholder="NAME"
          clearButtonMode="while-editing"
          returnKeyType="next"
          clearTextOnFocus={false}
          onSubmitEditing={this.focusEmail}
        />

        <TextInput
          ref="email"
          style={styles.inputs}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          onFocus={this.shiftFocus}
          enablesReturnKeyAutomatically={true}
          keyboardType="email-address"
          autoCorrect={true}
          placeholder="EMAIL ADDRESS"
          clearButtonMode="while-editing"
          onSubmitEditing={this.handleAccept}
          returnKeyType="done"
          clearTextOnFocus={false}
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
    fontSize: 14,
    fontFamily: 'BrownStd-Regular',
    backgroundColor: 'transparent',
    paddingLeft: ᐱ.percent.w(8),
    paddingRight: ᐱ.percent.w(8),
    paddingTop: ᐱ.percent.w(4),
    marginBottom: ᐱ.percent.h(6),
    width: ᐱ.percent.w(100),
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent',
  },
  inputs: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    margin: 10,
    color: '#b3b3b3',
    padding: 4,
    marginLeft: ᐱ.percent.w(8),
    marginRight: ᐱ.percent.w(8),
    fontFamily: 'BrownStd-Bold',
    backgroundColor: 'white',
    paddingLeft: 10,
  },
  halfScreen: {
    flex: 0.5,
    backgroundColor: 'transparent',
  },
  rowButton: {
    margin: 12,
    backgroundColor: 'transparent',
  },
  patternPrimary: {
    width: ᐱ.percent.w(100),
    height: ᐱ.percent.h(100),
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
