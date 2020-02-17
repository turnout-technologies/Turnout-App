import React, {Component} from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import firebase from 'firebase';

import {setUser} from '../Globals';

class AuthLoadingScreen extends Component {

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        setUser(user);
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