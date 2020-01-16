import React, {Component} from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import PropTypes from 'prop-types';

import List, { List as ListModel } from "./List";

export default class Accordion extends Component {

  static propTypes = {
    questions: PropTypes.array,
    onSubmitResponses: PropTypes.func
  }

  questionResponses = [-1, -1, -1, -1];

  constructor (props) {
     super(props)
     this.state = {
       openQuestion: 0,
     }
     this.ballotHandleAnswerPressed = this.ballotHandleAnswerPressed.bind(this);
     this.ballotHandleQuestionPressed = this.ballotHandleQuestionPressed.bind(this);
  }

  ballotHandleAnswerPressed(questionId, answerId) {
    this.questionResponses[questionId] = answerId;
    var nextOpenQuestion = questionId+1;
    var allQuestionsAnswered = true;
    for (var i = 0; i < this.questionResponses.length && allQuestionsAnswered; i++) {
      if (this.questionResponses[i] == -1) {
        allQuestionsAnswered = false;
      }
    }
    if (allQuestionsAnswered) {
      nextOpenQuestion = 5;
      this.props.onSubmitResponses(this.questionResponses);
    }
    this.setState({openQuestion: nextOpenQuestion});
  }
  ballotHandleQuestionPressed(questionId) {
    this.setState({openQuestion: questionId});
  }

  render() {
    const { questions } = this.props;
    return (
      <ScrollView style={styles.container}>
        <List question={questions[0]} openQuestion={this.state.openQuestion} questionResponseId={this.questionResponses[0]} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} />
        <List question={questions[1]} openQuestion={this.state.openQuestion} questionResponseId={this.questionResponses[1]} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} />
        <List question={questions[2]} openQuestion={this.state.openQuestion} questionResponseId={this.questionResponses[2]} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} />
        <List question={questions[3]} openQuestion={this.state.openQuestion} questionResponseId={this.questionResponses[3]} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} />
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.CURRENT_THEME.colors.primary,
    paddingHorizontal: 10
  }
});