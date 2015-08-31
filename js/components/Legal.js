'use strict';

var AppConstants = require('../constants/AppConstants'),
    UserStore = require('../stores/UserStore'),
    React = require('react-native'),
    AppActions = require('../actions/AppActions'),
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

  handleAccept: function(){

    this.refs.name.blur();
    this.refs.email.blur();

    this.setState({
      loading: true,
    });

    AppActions.saveUserInfo({
      email: this.state.email,
      name: this.state.name
    });
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

    if (this.state.bumpedUp && !this.state.loading) {
      legalCopy = <View style={styles.halfScreen} />
    } else if (this.state.loading) {
      legalCopy = <Text style={styles.legalCopy}>Loading...</Text>
    } else {
      legalCopy = <Text style={styles.legalCopy}>Do you agree to everything? If so please give us your email & hit accept.  Blood cats theyll tell you. Football helmet some indie record thats much cooler than. Mine nasty scar traffic lights brave and wild darling. Im a nightmare dressed like a daydream Kanye big black cars. Fuck sewing machines operation hummingbird. Twin sized bed fades in time Country Music Hall of. Fame in the blink of an eye long list of. Ex-lovers rhode island gravity lose. It all even now banjo people say everybody. Loves pretty state of grace upstate my. Next mistake madison square I know places upstate cafe. Shellback dear John my ex-man.</Text>;
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
          onFocus={this.test}
          enablesReturnKeyAutomatically={true}
          autoCorrect={true}
          defaultValue={"Email"}
          clearTextOnFocus={true}
        />

        <View style={styles.buttons}>
          <TouchableHighlight onPress={this.handleAccept} underlayColor="transparent">
            <View style={styles.readyButton}>
              <Text style={styles.readyText}>ACCEPT</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.handleCancel} underlayColor="transparent">
            <View style={styles.readyButton}>
              <Text style={styles.readyText}>CANCEL</Text>
            </View>
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
  readyButton: {
    width: AppConstants.WIDTH / 3,
    height: ᐱ.percent.h(4.8),
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#0072ff',
    shadowRadius: 0,
    shadowOffset: {width: 3, height: -3},
    shadowColor: 'white',
    shadowOpacity: 1,
    margin: 12,
  },
  readyText: {
    color: '#0072ff',
    fontFamily: 'BrownStd-Bold',
    fontSize: ᐱ.percent.h(3),
    marginLeft: ᐱ.percent.w(3),
    backgroundColor: 'transparent',
  },
  inputs: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    margin: 10,
    color: 'white',
    padding: 4,
  },
  halfScreen: {
    flex: 0.5,
  }
});

