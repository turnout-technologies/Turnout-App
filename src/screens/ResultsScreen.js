import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, ScrollView } from 'react-native';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';
import QuestionResult from '../components/QuestionResult';
import * as API from '../APIClient';
import {getUser} from '../Globals';
import {setLastBallotTimestamp} from '../AsyncStorage';

export default class ResultsScreen extends Component {

  static navigationOptions = {
    title: 'Results',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
     super(props);
     this.state = {ballotResult: null};
  }

  componentDidMount() {
    var _this = this;
    API.getLatestBallotResults()
      .then(function(response) {
        console.log(response.data)
        _this.setState({ballotResult: response.data})
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        { !this.state.ballotResult &&
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.accent} animating={!this.state.leaderboardData} />
          </View>
        }
        {!!this.state.ballotResult &&
          <ScrollView style={styles.scrollviewStyle} contentContainerStyle={{flexGrow: 1}}>
            {this.state.ballotResult.questions.map((item, index) => (
              <QuestionResult key={item.id} question={item} questionIndex={index} aggregate={this.state.ballotResult.aggregate[item.id]} winningAnswers={this.state.ballotResult.winningAnswers[item.id]} response={this.state.ballotResult.response[item.id]} />
            ))}
        </ScrollView>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingSpinnerContainer: {
    flex: 1,
    justifyContent: "center"
  },
  scrollviewStyle: {
    flex: 1,
    paddingHorizontal: 10,
  },
});