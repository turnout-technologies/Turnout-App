import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {GlobalStyles} from '../Globals';
import Accordion from '../components/Accordion';

export default class QuestionScreen extends Component {

  static navigationOptions = {
    title: 'Ballot',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
     super(props)
     this.state = {
     }
  }

  submitResponsesHandler(questionResponses) {
    console.log("Received responses submission");
    console.log(questionResponses);
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
      <Accordion questions={global.SAMPLE_QUESTIONS} onSubmitResponses={this.submitResponsesHandler}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});