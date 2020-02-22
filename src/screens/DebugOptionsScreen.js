import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import {GlobalStyles} from '../Globals';

export default class DebugOptionsScreen extends Component {

  static navigationOptions = {
    title: 'Debug',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
     super(props);
     //this.state = {ballot: null};
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer}>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});