import React from 'react';
import { View, Button, Text, Image } from 'react-native';
import Constants from 'expo-constants';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { YellowBox } from 'react-native';

import getEnvVars from '../auth/environment';

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
    this.checkIfLoggedIn();
    if (!isInClient) {
      this.initAsyncNative();
    }
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          console.log("LOGGED IN");
          this.setState({user});
        } else {
          console.log("NOT LOGGED IN");
        }
      }.bind(this)
    );
  };

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
    console.log('Google Auth Response', googleUser);
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
            .then(function(user) {
              console.log('user signed in ');
              /*if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(function(snapshot) {
                    console.log('Snapshot', snapshot);
                  });
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }*/
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

  initFirebase() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "<YOUR-API-KEY>",
      authDomain: "<YOUR-AUTH-DOMAIN>",
      databaseURL: "<YOUR-DATABASE-URL>",
      storageBucket: "<YOUR-STORAGE-BUCKET>"
    };
    firebase.initializeApp(firebaseConfig);

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((result) => {
      if (result != null) {
        console.log("We are authenticated now!");
      }
      //Do other things
    });
  }

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
        <Text>Email: {this.state.user ? this.state.user.email : "loading"}</Text>
        <Text>Name: {this.state.user ? this.state.user.displayName : "loading"}</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: this.state.user ? this.state.user.photoURL : "https://www.argentum.org/wp-content/uploads/2018/12/blank-profile-picture-973460_6404.png" }}
        />
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