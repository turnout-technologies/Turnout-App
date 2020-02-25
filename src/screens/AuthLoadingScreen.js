import React, {Component} from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';

import {setUser} from '../Globals';
import * as API from '../APIClient';

class AuthLoadingScreen extends Component {

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  alreadySignedIn = true;

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (!!user && this.alreadySignedIn) {
          API.getUser(user.uid)
            .then(function(response) {
              console.log(response.data);
              if (response.data) {
                setUser(response.data);
              }
            })
            .catch(function (error) {
              console.log(error.response);
              firebase.auth().signOut();
              alert("Error getting user data. Please sign in again.")
            });
          Sentry.setUser({"id": user.uid});
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