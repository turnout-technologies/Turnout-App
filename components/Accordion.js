import React, {Component} from "react";
import { Animated, View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import PropTypes from 'prop-types';

import List, { List as ListModel } from "./List";

export default class Accordion extends Component {

  static propTypes = {
    questions: PropTypes.array,
    onSubmitResponses: PropTypes.func
  }

  constructor (props) {
     super(props);
     this.questionResponses = Array(props.questions.length).fill(null);
     this.state = {
       openQuestion: -1,
     };
     this.ballotHandleAnswerPressed = this.ballotHandleAnswerPressed.bind(this);
     this.ballotHandleQuestionPressed = this.ballotHandleQuestionPressed.bind(this);
     this.handleContentReady = this.handleContentReady.bind(this);

     this.submitContainerHeightAnimationVal = new Animated.Value(74);
     this.submitButtonInterpolationAnimationVal = new Animated.Value(0);
     this.submitButtonFontSizeAnimationVal = new Animated.Value(16);

     this.submitButtonScaleInterpolation = this.submitButtonInterpolationAnimationVal.interpolate({inputRange:[0,1], outputRange:[1,3.07]});
     this.submitButtonColorInterpolation = this.submitButtonInterpolationAnimationVal.interpolate({inputRange:[0,1], outputRange:[global.CURRENT_THEME.colors.accent,global.CURRENT_THEME.colors.primary]});
     this.submitButtonFontColorInterpolation = this.submitButtonInterpolationAnimationVal.interpolate({inputRange:[0,1], outputRange:[global.CURRENT_THEME.colors.primary,global.CURRENT_THEME.colors.accent]});
  }

  toggleSubmitCard(open) {
    Animated.parallel([
      Animated.timing(this.submitContainerHeightAnimationVal, {
        toValue: open ? 488 : 74,
        duration: 150
      }),
      Animated.timing(this.submitButtonInterpolationAnimationVal,{toValue:open ? 1 : 0}),
      Animated.timing(this.submitButtonFontSizeAnimationVal, {
        toValue: open ? 10 : 16,
        duration: 150
      })
    ]).start();
    if (open) {
      setTimeout(() => {this.questionScrollView.scrollToEnd({animated: true, duration: 150});}, 200);
    }
  }


  ballotHandleAnswerPressed(questionId, questionIndex, answerId) {
    this.questionResponses[questionIndex] = {[questionId]: answerId};
    var nextOpenQuestion = questionIndex+1;
    var allQuestionsAnswered = true;
    for (var i = 0; i < this.questionResponses.length && allQuestionsAnswered; i++) {
      if (!this.questionResponses[i]) {
        allQuestionsAnswered = false;
      }
    }
    if (allQuestionsAnswered) {
      nextOpenQuestion = this.questionResponses.length;
    }
    if (nextOpenQuestion == this.questionResponses.length) {
      this.toggleSubmitCard(true);
    }
    this.setState({openQuestion: nextOpenQuestion});
  }

  ballotHandleQuestionPressed(questionIndex) {
    if (this.state.openQuestion == this.questionResponses.length) {
      this.toggleSubmitCard(false);
    }
    this.setState({openQuestion: questionIndex});
  }

  handleContentReady(questionIndex) {
    if (questionIndex == 0) {
      this.setState({openQuestion: 0});
    }
  }

  handleSubmitPressed() {
    this.props.onSubmitResponses(this.questionResponses);
  }

  render() {
    const { questions } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollviewStyle} contentContainerStyle={{flexGrow: 1}} ref={(ref) => this.questionScrollView = ref}>
          {questions.map((item, index) => (
              <List key={item.id} question={item} questionIndex={index} openQuestion={this.state.openQuestion} questionResponseId={this.questionResponses[index]} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} onContentReady={this.handleContentReady} />
          ))}
        <Animated.View style={[styles.submitContainer, {height: this.submitContainerHeightAnimationVal}]}>
          <Animated.View style={[styles.submitButtonContainer, {transform:[{scale: this.submitButtonScaleInterpolation}], backgroundColor: this.submitButtonColorInterpolation}]}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress = { () => this.handleSubmitPressed()}>
                <Animated.Text style={[styles.submitButtonText, {fontSize: this.submitButtonFontSizeAnimationVal, color:this.submitButtonFontColorInterpolation}]}>Send It</Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        </ScrollView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.CURRENT_THEME.colors.primary
  },
  scrollviewStyle: {
    flex: 1,
    paddingHorizontal: 10,
  },
  submitContainer: {
    flex: 1,
    width:"100%",
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: global.CURRENT_THEME.colors.background,
    borderTopLeftRadius: global.CURRENT_THEME.roundness,
    borderTopRightRadius: global.CURRENT_THEME.roundness,
  },
  submitButtonContainer: {
    width:82,
    height: 34,
    alignSelf:'center',
    borderRadius: global.CURRENT_THEME.roundness,
    borderColor: global.CURRENT_THEME.colors.primary,
    borderWidth: 1,
  },
  submitButton: {
    flex: 1,
    justifyContent: "center",
  },

  submitButtonText: {
    color: global.CURRENT_THEME.colors.primary,
    textAlign: "center",
    fontSize: 16
  },
});