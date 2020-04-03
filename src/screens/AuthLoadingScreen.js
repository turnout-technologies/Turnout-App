import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

import * as API from '../APIClient';
import {getPushNotificationsTokenAsync, setupNotificationChannels} from '../Notifications';
import {getUser, setUser, getLastRefreshUserTimestamp, setLastRefreshUserTimestamp, getLastNoteVersionOpened} from '../AsyncStorage';

(async function(){
  if (Constants.appOwnership === 'standalone') {
    const ExpoBranch = await import('expo-branch');
    const Branch = ExpoBranch.default;
      Branch.subscribe((bundle) => {
        if (bundle) {
          if (bundle.params) {
            console.log(bundle.params);
          } else if (bundle.error) {
            console.log(bundle.error);
            Sentry.captureException(bundle.error);
          } else {
            Sentry.withScope(function(scope) {
              scope.setExtra("branchBundle", bundle);
              Sentry.captureException(new Error("Branch params null"));
            });
          }
        } else {
          Sentry.withScope(function(scope) {
            Sentry.captureException(new Error("Branch bundle null"));
          });
       }
     });
  }
})()

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkIfLoggedIn();
    setupNotificationChannels();
  }

  advance() {
    var _this = this;
    getLastNoteVersionOpened()
      .then(function(lastVersionOpened) {
        if (!lastVersionOpened || lastVersionOpened != Constants.manifest.extra.noteVersion) {
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

  alreadySignedIn = true;

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (!!user && this.alreadySignedIn) {
          Sentry.setUser({"id": user.uid, "email": user.email});
          var _this = this;
          getUser()
            .then(function(user) {
              global.user   = JSON.parse(user);
              console.log(global.user);
              _this.advance();
            })
            .catch(function (error) {
              firebase.auth().signOut();
              Alert.alert("Error", "There was a problem reading your user info. Please sign in again.");
              console.log(error);
            });
        } else {
          this.alreadySignedIn = false;
          this.props.navigation.navigate('Auth');
        }
      }.bind(this)
    );
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.loadingSpinnerContainer}>
        <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.primary} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingSpinnerContainer: {
    flex: 1,
    justifyContent: "center"
  }
});

module.exports= AuthLoadingScreen