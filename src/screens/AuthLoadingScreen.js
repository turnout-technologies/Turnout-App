import React, {Component} from 'react';
import { ActivityIndicator, StatusBar, View, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
var moment = require('moment-timezone');

import * as API from '../APIClient';
import {getPushNotificationsTokenAsync, setupNotificationChannels} from '../Notifications';
import {getUser, setUser, getLastRefreshUserTimestamp, setLastRefreshUserTimestamp, getLastVersionOpened} from '../AsyncStorage';

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkIfLoggedIn();
    setupNotificationChannels();
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

  alreadySignedIn = true;

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (!!user && this.alreadySignedIn) {
          var _this = this;
          getLastRefreshUserTimestamp()
            .then(function(lastRefreshUserTimestamp) {
              var shouldRefreshUser = !lastRefreshUserTimestamp || !moment.unix(lastRefreshUserTimestamp).tz("America/New_York").isSame(moment().tz("America/New_York"), 'day');
              if (shouldRefreshUser) {
                API.getUser(user.uid)
                  .then(function(response) {
                    console.log(response);
                    if (response.data) {
                      global.user = response.data;
                      console.log(global.user)
                      setUser();
                      setLastRefreshUserTimestamp(moment().unix());
                      _this.advance()
                    }
                  })
                  .catch(function (error) {
                    firebase.auth().signOut();
                    Alert.alert("Error", "There was a problem fetching your user info. Please sign in again.");
                    console.log(error);
                  });
              } else {
                getUser()
                  .then(function(user) {
                    global.user = JSON.parse(user);
                    console.log(global.user);
                    _this.advance();
                  })
                  .catch(function (error) {
                    firebase.auth().signOut();
                    Alert.alert("Error", "There was a problem reading your user info. Please sign in again.");
                    console.log(error);
                  });
              }
              Sentry.setUser({"id": user.uid});
            })
            .catch(function (error) {
              firebase.auth().signOut();
              Alert.alert("Error", "There was a problem reading the last refresh timestamp. Please sign in again.");
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