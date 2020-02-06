import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, TouchableOpacity } from 'react-native';

import {GlobalStyles} from '../Globals';
import Accordion from '../components/Accordion';
import * as API from '../APIClient';

export default class QuestionScreen extends Component {

  static navigationOptions = {
    title: 'Ballot',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
     super(props)
     this.state = {ballot: null}
  }

  componentDidMount() {
    var _this = this;
    API.getBallotToday()
      .then(function(response) {
        _this.setState({ballot: response.data});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  submitResponsesHandler(questionResponses) {
    console.log("Received responses submission");
    console.log(questionResponses);
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
      {!!this.state.ballot && <Accordion questions={this.state.ballot.questions} onSubmitResponses={this.submitResponsesHandler}/>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});