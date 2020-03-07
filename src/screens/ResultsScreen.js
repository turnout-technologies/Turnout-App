import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';
import QuestionResult from '../components/QuestionResult';
import * as API from '../APIClient';
import {setLastBallotTimestamp} from '../AsyncStorage';

const RESULTS_HELP_TITLE = "About Scoring";
const RESULTS_HELP_MESSAGE = "Remember, you only get points for choosing the most popular answer! Point values increase by 1 for each question you get right. For example, if you get 3 questions right, you score 1+2+3 = 6 points."

export default class ResultsScreen extends Component {

  constructor (props) {
     super(props);
     this.state = {ballotResult: null, numCorrect: 0, score: 0};
  }

  componentDidMount() {
    var _this = this;
    API.getLatestBallotResults()
      .then(function(response) {
        var headerTitle = "Results for " + moment.unix(response.data.date).tz("America/New_York").format("MMMM Do");
        _this.props.navigation.setParams({headerTitle: headerTitle});
        const {numCorrect, score} = _this.calculateScore(response.data.response, response.data.winningAnswers);
        _this.setState({ballotResult: response.data, numCorrect, score });
        this.didVote = response.data.response != null;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    if (state.params != undefined){
      return {
        title: navigation.state.params.headerTitle,
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
        headerRight: (
          <TouchableOpacity style={{marginRight: 20}} onPress={() => Alert.alert(RESULTS_HELP_TITLE, RESULTS_HELP_MESSAGE)}>
            <Ionicons name="md-help-circle" size={25} color={global.CURRENT_THEME.colors.accent} />
          </TouchableOpacity>
        )
      }
    } else {
      return {
        title: 'Results',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      }
    }
  };

  calculateScore(responses, winningAnswers) {
    if (responses == null) {
      return {numCorrect: 0, score: 0};
    }
    var numCorrect = 0;
    var score = 0;
    for (var questionId in winningAnswers) {
      if (winningAnswers[questionId].includes(responses[questionId])) {
        numCorrect += 1;
        score += numCorrect;
      }
    }
    return {numCorrect, score};
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
            <Text style={styles.helloTitleContainer}>
              <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>Hey {global.user.name.split(" ")[0]}, </Text>
              { this.didVote &&
                <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>you were in the majority for {this.state.numCorrect} question{this.state.numCorrect != 1 ? "s" : null}, earning you {this.state.score}  point{this.state.score != 1 ? "s" : null}.</Text>
              }
              { !this.didVote &&
                <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>make sure you turn out next time to get on the board!</Text>
              }
            </Text>
            {this.state.ballotResult.questions.map((item, index) => (
              <QuestionResult
                key={item.id}
                question={item}
                questionIndex={index}
                aggregate={this.state.ballotResult.aggregate[item.id]}
                winningAnswers={this.state.ballotResult.winningAnswers[item.id]}
                response={this.state.ballotResult.response ? this.state.ballotResult.response[item.id] : null} />
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
  helloTitleContainer: {
    marginBottom: 20
  },
  helloTitleText: {
    fontSize: 22,
    color: global.CURRENT_THEME.colors.accent
  },
});