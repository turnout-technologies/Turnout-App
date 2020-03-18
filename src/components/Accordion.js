import React, {Component} from "react";
import { Animated, View, StyleSheet, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import PropTypes from 'prop-types';

import List, { List as ListModel } from "./List";
import {GlobalStyles} from '../Globals';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedActivityIndicator = Animated.createAnimatedComponent(ActivityIndicator);

export default class Accordion extends Component {

  static propTypes = {
    questions: PropTypes.array,
    onSubmitResponses: PropTypes.func
  }

  constructor (props) {
     super(props);
     this.numQuestions = props.questions.length;
     this.questionResponses = Array(this.numQuestions).fill(false);
     this.questionResponseObject = {};
     this.state = {
       openQuestion: -1,
       submitButtonDisabled: false
     };
     this.ballotHandleAnswerPressed = this.ballotHandleAnswerPressed.bind(this);
     this.ballotHandleQuestionPressed = this.ballotHandleQuestionPressed.bind(this);
     this.handleContentReady = this.handleContentReady.bind(this);

     this.submitContainerHeightAnimationVal = new Animated.Value(74);
     this.submitButtonInterpolationAnimationVal = new Animated.Value(0);
     this.submitButtonFontSizeAnimationVal = new Animated.Value(16);

     this.submitButtonBorderWidthInterpolation = this.submitButtonInterpolationAnimationVal.interpolate({inputRange:[0,1], outputRange:[1,0]});
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
        toValue: open ? 35 : 16,
        duration: 300
      })
    ]).start();
    if (open) {
      setTimeout(() => {this.questionScrollView.scrollToEnd({animated: true, duration: 150});}, 200);
    }
  }


  ballotHandleAnswerPressed(questionId, questionIndex, answerId) {
    this.questionResponses[questionIndex] = true;
    this.questionResponseObject[questionId] = answerId;
    console.log(this.questionResponseObject);
    var nextOpenQuestion = questionIndex+1;
    var allQuestionsAnswered = true;
    for (var i = 0; i < this.numQuestions && allQuestionsAnswered; i++) {
      if (!this.questionResponses[i]) {
        allQuestionsAnswered = false;
      }
    }
    if (allQuestionsAnswered) {
      nextOpenQuestion = this.numQuestions;
    }
    if (nextOpenQuestion == this.numQuestions) {
      this.toggleSubmitCard(true);
    }
    this.setState({openQuestion: nextOpenQuestion});
  }

  ballotHandleQuestionPressed(questionIndex) {
    var isSubmitOpen = this.state.openQuestion == this.numQuestions;
    // if submit card is open, close it
    if (isSubmitOpen) {
      this.toggleSubmitCard(false);
    }
    //set open question to the one pressed
    this.setState({openQuestion: questionIndex});
    //if the submit card is the one pressed, open it
    if (questionIndex == this.numQuestions) {
      this.toggleSubmitCard(true);
    }
  }

  handleContentReady(questionIndex) {
    if (questionIndex == 0) {
      this.setState({openQuestion: 0});
    }
  }

  handleSubmitPressed() {
    this.setState({submitButtonDisabled: true});
    this.props.onSubmitResponses(this.questionResponseObject)
      .then(function(response) {
        this.setState({submitButtonDisabled: false});
      }.bind(this));
  }

  render() {
    const { questions } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollviewStyle} contentContainerStyle={{flexGrow: 1}} ref={(ref) => this.questionScrollView = ref} showsVerticalScrollIndicator={false}>
          {questions.map((item, index) => (
              <List key={item.id} question={item} questionIndex={index} openQuestion={this.state.openQuestion} questionResponseId={this.questionResponseObject[item.id]} onAnswerPressed={this.ballotHandleAnswerPressed} onQuestionPressed={this.ballotHandleQuestionPressed} onContentReady={this.handleContentReady} />
          ))}
        <TouchableWithoutFeedback onPress={() => this.ballotHandleQuestionPressed(this.numQuestions)}>
          <Animated.View style={[styles.submitContainer, {height: this.submitContainerHeightAnimationVal}]}>
            <Animated.View style={{transform:[{scale: this.submitButtonScaleInterpolation}]}}>
              <AnimatedTouchableOpacity
                style={[styles.submitButton, {backgroundColor: this.submitButtonColorInterpolation, borderWidth: this.submitButtonBorderWidthInterpolation}]}
                onPress = { () => this.handleSubmitPressed()}
                disabled={this.state.submitButtonDisabled} >
              </AnimatedTouchableOpacity>
            </Animated.View>
            <View pointerEvents="none" style={{position: "absolute"}}>
              {this.state.submitButtonDisabled && <AnimatedActivityIndicator color={this.submitButtonFontColorInterpolation} animating={this.state.submitButtonDisabled} />}
              {!this.state.submitButtonDisabled && <Animated.Text style={[GlobalStyles.bodyText, styles.submitButtonText, {fontSize: this.submitButtonFontSizeAnimationVal, color:this.submitButtonFontColorInterpolation}]}>Send It</Animated.Text>}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
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
  submitButton: {
    width:82,
    height: 34,
    alignSelf:'center',
    borderRadius: global.CURRENT_THEME.roundness,
    borderColor: global.CURRENT_THEME.colors.primary,
    justifyContent: "center",
  },
  submitButtonText: {
    color: global.CURRENT_THEME.colors.primary,
    textAlign: "center",
    fontSize: 16
  },
});