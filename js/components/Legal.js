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
} = React;

var Legal = React.createClass({
  getInitialState: function() {
    return {
      start: false,
      user: UserStore.get(),
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
    console.log('grab the email and associate it to the user & remove legal component');
  },

  handleCancel: function() {
    AppActions.userReset();
  },

  render: function() {
    return(
      <View style={styles.container}>

        <Text style={styles.legalCopy}>Do you agree to everything? If so please give us your email & hit accept.  Blood cats they'll tell you. Football helmet some indie record that's much cooler than. Mine nasty scar traffic lights brave and wild darling. I'm a nightmare dressed like a daydream Kanye big black cars. Fuck sewing machines operation hummingbird. Twin sized bed fades in time Country Music Hall of. Fame in the blink of an eye long list of. Ex-lovers rhode island gravity lose. It all even now banjo people say everybody. Loves pretty state of grace upstate my. Next mistake madison square I know places upstate cafe. Shellback dear John my ex-man.</Text>
        
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
});

