import React, {Component} from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
var moment = require('moment-timezone');

import * as API from '../APIClient';
import {getPushNotificationsTokenAsync, setupNotificationChannels} from '../Notifications';
import {getUser, setUser, getLastRefreshUserTimestamp, setLastRefreshUserTimestamp} from '../AsyncStorage';

class AuthLoadingScreen extends Component {

  componentDidMount() {
    this.checkIfLoggedIn();
    setupNotificationChannels();
  }

  alreadySignedIn = true;

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (!!user && this.alreadySignedIn) {
          getLastRefreshUserTimestamp()
            .then(function(lastRefreshUserTimestamp) {
              var shouldRefreshUser = !lastRefreshUserTimestamp || !moment.unix(lastRefreshUserTimestamp).tz("America/New_York").isSame(moment().tz("America/New_York"), 'day');
              if (shouldRefreshUser) {
                API.getUser(user.uid)
                .then(function(response) {
                  if (response.data) {
                    global.user = response.data;
                    console.log(global.user)
                    setUser();
                    setLastRefreshUserTimestamp(moment().unix());
                  }
                })
                .catch(function (error) {
                  console.log(error);
                  firebase.auth().signOut();
                  alert("Error getting user data. Please sign in again.")
                });
              } else {
                getUser()
                  .then(function(user) {
                    global.user = JSON.parse(user);
                    console.log(global.user);
                  }.bind(this))
                  .catch(function (error) {
                    console.log(error);
                  });
              }
              Sentry.setUser({"id": user.uid});
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          this.alreadySignedIn = false;
        }
        this.props.navigation.navigate(!!user ? 'Main' : 'Auth');
      }.bind(this)
    );
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

module.exports= AuthLoadingScreen