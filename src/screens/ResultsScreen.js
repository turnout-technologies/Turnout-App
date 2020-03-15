import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';
import QuestionResult from '../components/QuestionResult';

const RESULTS_HELP_TITLE = "About Scoring";
const RESULTS_HELP_MESSAGE = "Remember, you only get points for choosing the most popular answer! Point values increase by 1 for each question you get right. For example, if you get 3 questions right, you score 1+2+3 = 6 points."

export default class ResultsScreen extends Component {

  constructor (props) {
     super(props);
     this.state = {isLoading: true, ballotResult: null, numCorrect: 0, score: 0};
  }

  componentDidMount() {
    var resultsResponse = this.props.navigation.state.params.resultsResponse;
    var dateStr = this.props.navigation.state.params.resultsDateStr;
    var headerTitle = "Results for " + dateStr;
    this.props.navigation.setParams({headerTitle: headerTitle});
    const numCorrect = this.calculateNumCorrect(resultsResponse.response, resultsResponse.winningAnswers);
    this.setState({isLoading: false, ballotResult: resultsResponse, numCorrect, score: resultsResponse.userPoints });
    this.didVote = resultsResponse.response != null;
  }

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    if (state.params != undefined){
      return {
        title: navigation.state.params.headerTitle,
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
        headerRight: () => (
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

  calculateNumCorrect(responses, winningAnswers) {
    if (responses == null) {
      return 0;
    }
    var numCorrect = 0;
    for (var questionId in winningAnswers) {
      if (winningAnswers[questionId].includes(responses[questionId])) {
        numCorrect += 1;
      }
    }
    return numCorrect;
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        { !this.state.ballotResult && this.state.isLoading &&
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.accent} />
          </View>
        }
        { !this.state.ballotResult && !this.state.isLoading &&
          <View style={styles.errorContainer}>
            <Ionicons name="md-warning" size={75} color={global.CURRENT_THEME.colors.accent} />
            <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>Error getting ballot results</Text>
          </View>
        }
        { !!this.state.ballotResult &&
          <ScrollView style={styles.scrollviewStyle} contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <Text style={styles.helloTitleContainer}>
              <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>Hey {global.user.name.split(" ")[0]}, </Text>
              { this.didVote &&
                <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>you were in the majority for {this.state.numCorrect} question{this.state.numCorrect != 1 ? "s" : null}, earning you {this.state.score} point{this.state.score != 1 ? "s" : null}.</Text>
              }
              { !this.didVote &&
                <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>you didn't participate in the last poll. Make sure you turn out next time to earn points!</Text>
              }
            </Text>
            <SafeAreaView>
              {this.state.ballotResult.questions.map((item, index) => (
                <QuestionResult
                  key={item.id}
                  question={item}
                  questionIndex={index}
                  aggregate={this.state.ballotResult.aggregate[item.id]}
                  winningAnswers={this.state.ballotResult.winningAnswers[item.id]}
                  response={this.state.ballotResult.response ? this.state.ballotResult.response[item.id] : null} />
              ))}
            </SafeAreaView>
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
    marginTop: 10,
    marginBottom: 30
  },
  helloTitleText: {
    fontSize: 22,
    color: global.CURRENT_THEME.colors.accent
  },
  errorContainer: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
});