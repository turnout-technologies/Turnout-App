import React, {Component} from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, SafeAreaView, YellowBox } from 'react-native';
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { SplashScreen } from 'expo';

var moment = require('moment-timezone');

import getEnvVars from '../Environment';
import * as API from '../APIClient';
import StatusBarBackground from '../components/StatusBarBackground';
import {getPushNotificationsTokenAsync} from '../Notifications';
import {setUser, setLastRefreshUserTimestamp, getLastVersionOpened} from '../AsyncStorage';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = { ...console };
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class SignInScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {user: null};
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  advance() {
    var curVersion = Constants.nativeAppVersion;
    var _this = this;
    getLastVersionOpened()
      .then(function(lastVersionOpened) {
        if (!lastVersionOpened || lastVersionOpened != curVersion) {
          _this.props.navigation.navigate('Note');
        } else {
          _this.props.navigation.navigate('Main');
        }
      })
      .catch(function (error) {
        console.log(error);
        _this.props.navigation.navigate('Main');
      });
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.user.id) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = googleUser => {
    //console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          var _this = this;
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              console.log('user signed in ');
              getPushNotificationsTokenAsync()
              .then(function(token) {
                if (result.additionalUserInfo.isNewUser) {
                  console.log("NEW USER! Adding to DB...")
                  API.addUser(result.user.displayName, result.user.email, result.user.photoURL, token)
                    .then(function(response) {
                      console.log(response.data);
                      if (response.data) {
                        global.user = response.data;
                        console.log(global.user);
                        setUser();
                        setLastRefreshUserTimestamp(moment().unix());
                        _this.advance();
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                      firebase.auth().signOut();
                      alert("Error signing in. Please try again")
                    });
                } else {
                  API.getUser(result.user.uid)
                    .then(function(response) {
                      if (response.data) {
                        global.user = response.data;
                        console.log(global.user)
                        setUser();
                        setLastRefreshUserTimestamp(moment().unix());
                        _this.advance();
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                      firebase.auth().signOut();
                      alert("Error getting user data. Please sign in again.")
                    });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  signInAsyncWeb = async () => {
    try {
      const result = await Google.logInAsync(Constants.manifest.extra.googleLogInConfig);

      if (result.type === 'success') {
        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return null;
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  onPress = () => {
    this.signInAsyncWeb();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBarBackground backgroundColor="white"/>
        <SafeAreaView style={styles.topContainer}>
          <Image source={require('../../assets/images/logo_text.png')} style={styles.logoText} />
          <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Carousel goes here</Text>
          </View>
        </SafeAreaView>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomContainerTitle}>Let's get started.</Text>
          <View style={styles.signInButtonContainer}>
            <TouchableOpacity style={styles.signInButton} onPress={this.onPress}>
              <Image source={require('../../assets/images/google_logo.png')} style={styles.signInButtonLogo} />
              <Text style={[styles.signInButtonText]}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: global.CURRENT_THEME.colors.background
  },
  logoText: {
    alignSelf: "center",
    height: '10%',
    resizeMode: 'contain',
    marginTop: 20
  },
  topContainer: {
    flex:1
  },
  bottomContainer: {
    flex:.4,
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderTopLeftRadius: global.CURRENT_THEME.roundness,
    borderTopRightRadius: global.CURRENT_THEME.roundness
  },
  bottomContainerTitle: {
    fontFamily: 'circularstd-book',
    color: global.CURRENT_THEME.colors.accent,
    fontSize: 30,
    paddingTop: 20,
    paddingLeft: 20,
    //position: 'absolute'
  },
  signInButtonContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    //paddingTop: 30
  },
  signInButton: {
    width:275,
    height: 55,
    justifyContent: "space-evenly",
    backgroundColor: global.CURRENT_THEME.colors.accent,
    borderRadius: global.CURRENT_THEME.roundness,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal:20,
  },
  signInButtonText: {
    fontFamily: 'circularstd-book',
    color: global.CURRENT_THEME.colors.text,
    textAlign: "center",
    fontSize: 18
  },
  signInButtonLogo: {
    height: '45%',
    resizeMode: 'contain',
  },
});

module.exports= SignInScreen