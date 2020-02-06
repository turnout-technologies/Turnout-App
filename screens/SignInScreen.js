import React from 'react';
import { View, Button, Text, Image } from 'react-native';
import Constants from 'expo-constants';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { YellowBox } from 'react-native';

import getEnvVars from '../auth/environment';
import * as API from '../APIClient';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = { ...console };
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const isInClient = Constants.appOwnership === 'expo';
if (isInClient) {
  GoogleSignIn.allowInClient();
}

const {googleAuthClientIds} = getEnvVars();
/*
 * Redefine this one with your client ID
 *
 * The iOS value is the one that really matters,
 * on Android this does nothing because the client ID
 * is read from the google-services.json.
 */
const clientIdForUseInStandalone = Platform.select({
  android: googleAuthClientIds.androidStandaloneClientId,
  ios: googleAuthClientIds.iOSStandaloneClientId,
});

class SignInScreen extends React.Component {

  state = {
    user: null
  };

  componentDidMount() {
    if (!isInClient) {
      this.initAsyncNative();
    }
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
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              console.log('user signed in ');
              if (result.additionalUserInfo.isNewUser) {
                console.log("NEW USER! Adding to DB...")
                console.log("NAME: " + result.user.displayName);
                console.log("Email: " + result.user.email);
                API.addUser(result.user.displayName, result.user.email, "")
                  .then(function(response) {
                    console.log(response.status);
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  initAsyncNative = async () => {
    try {
      await GoogleSignIn.initAsync({
        isPromptEnabled: true,
        clientIdForUseInStandalone,
      });
      this._syncUserWithStateAsync();
    } catch ({ message }) {
      alert('GoogleSignIn.initAsyncNative(): ' + message);
    }
  };

  _syncUserWithStateAsyncNative = async () => {
    const data = await GoogleSignIn.signInSilentlyAsync();
    console.log('_syncUserWithStateAsync', { user });
    if (data) {
      const photoURL = await GoogleSignIn.getPhotoAsync(256);
      const user = await GoogleSignIn.getCurrentUserAsync();
      this.setState({
        user: {
          ...user.toJSON(),
          photoURL: photoURL || user.photoURL,
        },
      });
    } else {
      this.setState({ user: null });
    }
  };

  signOutAsyncNative = async () => {
    try {
      await GoogleSignIn.signOutAsync();
      this.setState({ user: null });
    } catch ({ message }) {
      alert('signOutAsyncNative: ' + message);
    } finally {
      this.setState({ user: null });
    }
  };

  signInAsyncNative = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  signInAsyncWeb = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: googleAuthClientIds.iOSExpoClientId,
        androidClientId: googleAuthClientIds.androidExpoClientId,
        iosStandaloneAppClientId: googleAuthClientIds.iOSStandaloneClientId,
        androidStandaloneAppClientId: googleAuthClientIds.androidStandaloneClientId,
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
        this.onSignIn(result);
        return result.accessToken;
        //this.setState({accessToken});
      } else {
        return null;
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  onPress = () => {
    if (isInClient) {
      this.signInAsyncWeb();
    } else {
      if (this.state.user) {
        this.signOutAsyncNative();
      } else {
        this.signInAsyncNative();
      }
      this.setState({user: userData});
    }
  };

  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View>
        <Button title="Sign in!" onPress={this.onPress}/*onPress={this._signInAsync}*/ />
        <View style={{height: 50}}/>
        <Button title="Skip Auth" onPress={ () => this.props.navigation.navigate('Main')}/*onPress={this._signInAsync}*/ />
      </View>
    );
  }

  /*_signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };*/
}

module.exports= SignInScreen