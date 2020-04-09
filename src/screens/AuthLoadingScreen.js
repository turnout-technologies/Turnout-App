import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

import * as API from '../APIClient';
import {getPushNotificationsTokenAsync, setupNotificationChannels} from '../Notifications';
import {getUser, setUser, getLastRefreshUserTimestamp, setLastRefreshUserTimestamp, getLastNoteVersionOpened} from '../AsyncStorage';

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkIfLoggedIn();
    setupNotificationChannels();
  }

  async checkForNewNote() {
    try {
      var lastVersionOpened = await getLastNoteVersionOpened();
      return !lastVersionOpened || lastVersionOpened != Constants.manifest.extra.noteVersion;
    } catch (error) {
      return false;
    }
  }

  alreadySignedIn = true;

  async checkIfLoggedIn() {
    if (await this.checkForNewNote()) {
      this.props.navigation.navigate('Note');
      return;
    }

    firebase.auth().onAuthStateChanged(async firebaseUser => {
      if (!!firebaseUser && this.alreadySignedIn) {
        Sentry.setUser({"id": firebaseUser.uid, "email": firebaseUser.email});
        try {
          var user = await getUser();
          if (!user) {
            throw "Retrieved user was null";
          }
          global.user = JSON.parse(user);
          console.log(global.user);
          this.props.navigation.navigate('Main');
        } catch (error) {
          firebase.auth().signOut();
          Alert.alert("Error", "There was a problem reading your user info. Please sign in again.");
          console.log(error);
        }
      } else {
        this.alreadySignedIn = false;
        this.props.navigation.navigate('Auth');
      }
    });
  }

  // Render any loading content that you like here
  render() {
    return (
      <View/>
    );
  }
}

module.exports= AuthLoadingScreen