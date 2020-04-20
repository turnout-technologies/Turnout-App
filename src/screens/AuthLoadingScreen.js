import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

import * as API from '../APIClient';
import {getPushNotificationsTokenAsync, setupNotificationChannels} from '../Notifications';
import {getUser, setUser, getLastRefreshUserTimestamp, setLastRefreshUserTimestamp, getLastNoteVersionOpened} from '../AsyncStorage';

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setupUpdateListener();
    setupNotificationChannels();
    this.checkIfLoggedIn();
  }

  async setupUpdateListener() {
    this.updateEventHandler = Updates.addListener(event => {
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        Alert.alert(
          "Update Available",
          "Reload the app to get the latest updates!",
          [
            { text: "Reload", onPress: () => { Updates.reloadAsync()}
            },
          ],
          { cancelable: false }
        );
      }
    });
  }

  componentWillUnmount() {
  this.updateEventHandler && this.updateEventHandler.remove();
}

  async checkForNewNote() {
    /*try {
      var lastVersionOpened = await getLastNoteVersionOpened();
      return !lastVersionOpened || lastVersionOpened != Constants.manifest.extra.noteVersion;
    } catch (error) {
      return false;
    }*/
    //NOTE TURNED OFF FOR BETA
    return false;
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