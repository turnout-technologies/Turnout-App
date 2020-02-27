import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, Button } from 'react-native';
import * as firebase from 'firebase';

import {GlobalStyles} from '../Globals';

export default class DebugOptionsScreen extends Component {

  static navigationOptions = {
    title: 'Debug',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
     super(props);
  }

  signOut = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer}>
          <Button style={{position: 'absolute', bottom: 0}} title="Sign Out" onPress={this.signOut} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});