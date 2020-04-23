import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, SafeAreaView, YellowBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialDialog } from 'react-native-material-dialog';
import { SimpleLineIcons } from '@expo/vector-icons';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';
import QuestionResult from '../components/QuestionResult';
import * as API from '../APIClient';
import {getBallotResult, setBallotResult} from '../AsyncStorage';

const RESULTS_HELP_TITLE = "About Scoring";
const RESULTS_HELP_MESSAGE = "Remember, you only get points for choosing the most popular answer! Point values increase by 1 for each question you get right. For example, if you get 3 questions right, you score 1+2+3 = 6 points."

YellowBox.ignoreWarnings(['Warning: Failed prop type: The prop `onCancel`']);
const _console = { ...console };
console.error = message => {
  if (message.indexOf('Warning: Failed prop type: The prop `onCancel`') <= -1) {
    _console.warn(message);
  }
};

export default class ResultsScreen extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isLoading: true,
      ballotResult: null,
      didVote: false,
      numCorrect: 0,
      score: 0,
      autocorrectDialogVisible: false,
      autocorrectLoading: false,
      noAutocorrectsDialogVisible: false,
    };

    this.inviteFriends = this.inviteFriends.bind(this);
    this.autocorrectHandler = this.autocorrectHandler.bind(this);
    this.useAutocorrect = this.useAutocorrect.bind(this);
  }

  componentDidMount() {
    this.retrieveResults();
  }

  async retrieveResults() {
    try {
      var savedBallotResult = await getBallotResult();
      if (savedBallotResult && !(this.props.navigation.state.params && this.props.navigation.state.params.forceRefresh)) {
        var resultsResponse = JSON.parse(savedBallotResult);;
      } else {
        var resultsResponse = (await API.getLatestBallotResults()).data;
        setBallotResult(this.ballotResult);
      }
      var dateStr = moment.unix(resultsResponse.date).tz("America/New_York").format("MMMM Do");
      this.props.navigation.setParams({headerTitle: "Results for " + dateStr});
      this.questionPoints = {};
      this.calculateNumCorrect(resultsResponse);
      this.setState({
        didVote: !!resultsResponse.response,
        ballotResult: resultsResponse,
        isLoading: false
      });
    } catch (error) {
      console.log(error);
    }
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

  calculateNumCorrect(resultsResponse) {
    const questions = resultsResponse.questions;
    const responses = resultsResponse.response;
    const winningAnswers = resultsResponse.winningAnswers;

    if (responses == null) {
      return 0;
    }
    var numCorrect = 0;
    var score = 0;

    for (const question of questions) {
      const questionId = question.id;
      if (winningAnswers[questionId].includes(responses[questionId])) {
        numCorrect += 1;
        score += numCorrect;
        //store number of points earned for this question
        this.questionPoints[questionId] = numCorrect;
      }
    }

    if (!!responses.autocorrect) {
      // add autocorrects
      for (const questionId of responses.autocorrect.questionIds) {
        numCorrect += 1;
        score += numCorrect;
        this.questionPoints[questionId] = numCorrect;
      }
    }
    this.setState({numCorrect, score});
  }

  inviteFriends() {
    this.props.navigation.navigate('Invite');
    this.setState({noAutocorrectsDialogVisible: false});
  }

  autocorrectHandler(questionId) {
    this.curAutocorrectQuestionId = questionId;
    const hasAutocorrects = global.user.powerups.autocorrects > 0;
    if (hasAutocorrects) {
      this.setState({autocorrectDialogVisible: true});
    } else {
      this.setState({noAutocorrectsDialogVisible: true});
    }
  }

  useAutocorrect() {
    this.setState({autocorrectDialogVisible: false, autocorrectLoading: true});
    this.setState(async prevState => {
      const newNumCorrect = prevState.numCorrect + 1;
      try {
        const response = await API.autocorrect({
          questionId: this.curAutocorrectQuestionId,
          pointsToAdd: newNumCorrect
        });
        this.calculateNumCorrect(response.data);
        this.setState({ballotResult: response.data});
        global.user.powerups.autocorrects -= 1;
      } catch (error) {
        console.log(error);
        Alert.alert("Autocorrect Error", "There was a problem applying your autocorrect power-up. Please try again.");
      }
      this.setState({autocorrectLoading: false});
    });
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
              { this.state.didVote &&
                <Text style={[GlobalStyles.bodyText, styles.helloTitleText]}>you were in the majority for {this.state.numCorrect} question{this.state.numCorrect != 1 ? "s" : null}, earning you {this.state.score} point{this.state.score != 1 ? "s" : null}.</Text>
              }
              { !this.state.didVote &&
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
                  response={this.state.ballotResult.response ? this.state.ballotResult.response[item.id] : null}
                  points={this.questionPoints[item.id]}
                  autocorrectHandler={this.autocorrectHandler}
                  isAutocorrected={!!this.state.ballotResult.response && !!this.state.ballotResult.response.autocorrect && this.state.ballotResult.response.autocorrect.questionIds.indexOf(item.id) > -1} />
              ))}
            </SafeAreaView>
        </ScrollView>}
        <MaterialDialog
          visible={this.state.autocorrectDialogVisible}
          onOk={() => this.useAutocorrect()}
          onCancel={() => this.setState({autocorrectDialogVisible: false})}
          okLabel="Use It"
          cancelLabel="Cancel"
          colorAccent={global.CURRENT_THEME.colors.primary}
          backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
          <View>
            <SimpleLineIcons
              name="magic-wand"
              size={75}
              style={{ alignSelf: "center" }}
              color={global.CURRENT_THEME.colors.primary}
            />
            <Text style={[GlobalStyles.headerText, styles.autocorrectDialogTitle]}>Autocorrect</Text>
            <Text>
              <Text style={[GlobalStyles.bodyText, styles.autocorrectDialogText]}>
                The autocorrect power-up corrects a question you got wrong and gives you the points. You have</Text>
              <Text style={[GlobalStyles.headerText, styles.autocorrectDialogText]}> {global.user.powerups.autocorrects}</Text>
              <Text style={[GlobalStyles.bodyText, styles.autocorrectDialogText]}> remaining.</Text>
            </Text>
          </View>
      </MaterialDialog>
      <MaterialDialog
        visible={this.state.autocorrectLoading}
        colorAccent={global.CURRENT_THEME.colors.primary}
        backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
          <View>
            <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.primary} />
            <Text style={[GlobalStyles.bodyText, styles.autocorrectDialogTitle, {textAlign: "center"}]}>Applying Autocorrect</Text>
          </View>
      </MaterialDialog>
      <MaterialDialog
        visible={this.state.noAutocorrectsDialogVisible}
        onOk={() => this.inviteFriends()}
        onCancel={() => this.setState({noAutocorrectsDialogVisible: false})}
        okLabel="Invite Friends"
        cancelLabel="Cancel"
        colorAccent={global.CURRENT_THEME.colors.primary}
        backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
        <View>
          <SimpleLineIcons
            name="magic-wand"
            size={75}
            style={{ alignSelf: "center" }}
            color={global.CURRENT_THEME.colors.text_opacity5}
          />
          <Text style={[GlobalStyles.headerText, styles.autocorrectDialogTitle]}>No autocorrect power-ups remaining</Text>
          <Text style={[GlobalStyles.bodyText, styles.autocorrectDialogText]}>
            You're out of autocorrect power-ups. Invite friends to get more.
          </Text>
        </View>
      </MaterialDialog>
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
  autocorrectDialogText: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "left",
    color: global.CURRENT_THEME.colors.text
  },
  autocorrectDialogTitle: {
    marginTop: 10,
    fontSize: 20,
    textAlign: "left",
    color: global.CURRENT_THEME.colors.text
  }
});