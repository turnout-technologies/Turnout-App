import React, {Component} from "react";
import { StyleSheet, Text, ScrollView } from "react-native";

import List, { List as ListModel } from "./List";

const list: ListModel = {
  items: [
    { id: 0, text: "This is the first answer to the question" },
    { id: 1, text: "This is the second answer to the question" },
    { id: 2, text: "This is the third answer to the question" },
    { id: 3, text: "This is the fourth answer to the question" }
  ]
};

export default class Accordion extends Component {

  constructor (props) {
     super(props)
     this.state = {
       openQuestion: 0,
     }
     this.ballotHandleAnswerPressed = this.ballotHandleAnswerPressed.bind(this);
     this.ballotHandleQuestionPressed = this.ballotHandleQuestionPressed.bind(this);
  }

  questionAnswers= [-1, -1, -1, -1];

  ballotHandleAnswerPressed(questionId, answerId) {
    this.setState({openQuestion: questionId+1});
    this.questionAnswers[questionId] = answerId;
  }
  ballotHandleQuestionPressed(questionId) {
    this.setState({openQuestion: questionId});
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <List {...{ list }} questionId={0} openQuestion={this.state.openQuestion} questionAnswers={this.questionAnswers} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} />
        <List {...{ list }} questionId={1} openQuestion={this.state.openQuestion} questionAnswers={this.questionAnswers} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed}  />
        <List {...{ list }} questionId={2} openQuestion={this.state.openQuestion} questionAnswers={this.questionAnswers} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} />
        <List {...{ list }} questionId={3} openQuestion={this.state.openQuestion} questionAnswers={this.questionAnswers} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} />
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