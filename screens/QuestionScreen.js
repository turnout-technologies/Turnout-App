import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {GlobalStyles} from '../Globals';
import Accordion from '../components/Accordion';

export default class QuestionScreen extends Component {

  static navigationOptions = {
    title: 'Ballot',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent,
  };

  constructor (props) {
     super(props)
     this.state = {
     }
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
      <Accordion/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});