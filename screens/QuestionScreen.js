import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, Button, TouchableOpacity } from 'react-native';

import {GlobalStyles} from '../Globals';
import Accordion from '../components/Accordion';
import * as API from '../APIClient';
import {getUser} from '../Globals';

export default class QuestionScreen extends Component {

  static navigationOptions = {
    title: 'Ballot',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
     super(props);
     this.state = {ballot: null};
     this.submitResponsesHandler = this.submitResponsesHandler.bind(this);
  }

  componentDidMount() {
    var _this = this;
    API.getBallotToday()
      .then(function(response) {
        _this.setState({ballot: response.data});
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  submitResponsesHandler(questionResponseObject) {
    console.log("Received responses submission");
    console.log(questionResponseObject);
    API.submitBallot(this.state.ballot.id, getUser().uid, questionResponseObject)
      .then(function(response) {
        console.log(response.status);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.response);
      });;
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
      { !this.state.ballot &&
        <View style={styles.loadingSpinnerContainer}>
          <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.accent} animating={!this.state.leaderboardData} />
        </View>
      }
      {!!this.state.ballot && <Accordion questions={this.state.ballot.questions} onSubmitResponses={this.submitResponsesHandler}/>}
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