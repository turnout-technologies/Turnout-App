import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, Button, TouchableOpacity, DeviceEventEmitter, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';
import Accordion from '../components/Accordion';
import * as API from '../APIClient';
import {setLastBallotTimestamp} from '../AsyncStorage';

export default class QuestionScreen extends Component {

  static navigationOptions = {
    title: 'Ballot',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  /**
  * Shuffles array in place. Used to shuffle the answer choices for the question.
  * @param {Array} arr An array containing the items.
  */
  shuffle(arr) {
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
  }

  constructor (props) {
     super(props);
     this.state = {isLoading: true, ballot: null};
     this.submitResponsesHandler = this.submitResponsesHandler.bind(this);
  }

  componentDidMount() {
    var _this = this;
    API.getBallotToday()
      .then(function(response) {
        response.data.questions.forEach(function(element) {
          _this.shuffle(element.answers);
        });
        _this.setState({ballot: response.data});
      })
      .catch(function (error) {
        _this.setState({isLoading: false});
        console.log(error);
      });
  }

  updateLastBallotTimestamp() {
    setLastBallotTimestamp(moment().unix().toString())
      .then(function() {
        DeviceEventEmitter.emit('ballotSubmittedListener',  {});
        this.props.navigation.goBack();
      }.bind(this))
      .catch(function (error) {
        console.log(error);
        this.props.navigation.goBack();
      });
  }

  submitResponsesHandler(questionResponseObject) {
    console.log("Received responses submission");
    console.log(questionResponseObject);
    API.submitBallot(this.state.ballot.id, global.user.id, questionResponseObject)
      .then(function(response) {
        this.updateLastBallotTimestamp();
      })
      .catch(function (error) {
        Alert.alert("Error submitting ballot", "We ran into an issue submitting your ballot 😔");
        console.log(error);
      });
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        { !this.state.ballot && this.state.isLoading &&
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.accent} />
          </View>
        }
        { !this.state.ballot && !this.state.isLoading &&
          <View style={styles.errorContainer}>
            <Ionicons name="md-warning" size={75} color={global.CURRENT_THEME.colors.accent} />
            <Text style={[GlobalStyles.bodyText, styles.errorText]}>Error getting ballot</Text>
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
  },
  errorContainer: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  errorText: {
    fontSize: 22,
    color: global.CURRENT_THEME.colors.accent
  },
});