import React, { useState } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import Animated from "react-native-reanimated";
import { bInterpolate, useTimingTransition } from "react-native-redash";
import { MaterialIcons, Octicons } from '@expo/vector-icons';

import Item, { LIST_ITEM_HEIGHT, ListItem } from "./ListItem";

const LIST_PADDING_BOTTOM=25;
const { interpolate } = Animated;
const styles = StyleSheet.create({
  container: {
    backgroundColor: global.CURRENT_THEME.colors.background,
    padding: 16,
    borderTopLeftRadius: global.CURRENT_THEME.roundness,
    borderTopRightRadius: global.CURRENT_THEME.roundness,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  questionHeader: {
    fontSize: 25,
    fontWeight: "bold",
    color: global.CURRENT_THEME.colors.text
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: "normal",
    color: global.CURRENT_THEME.colors.text
  },
  items: {
    overflow: "hidden",
    backgroundColor: global.CURRENT_THEME.colors.background,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 5
  }
});

export interface List {
  name: string;
  items: ListItem[];
}

export default ({ question, openQuestion, questionResponseId, onAnswerPressed, onQuestionPressed }: ListProps) => {
  var questionId = question.questionId;
  var isOpen = openQuestion == questionId;
  const transition = useTimingTransition(isOpen, { duration: 150 });
  const height = bInterpolate(
    transition,
    0,
    LIST_ITEM_HEIGHT * question.questionAnswers.length+LIST_PADDING_BOTTOM
  );
  const bottomRadius = interpolate(transition, {
    inputRange: [0, 16 / 400],
    outputRange: [global.CURRENT_THEME.roundness, 0]
  });
  const questionHandleAnswerPressed = (answerId) => {
    onAnswerPressed(questionId, answerId);
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={() => onQuestionPressed(questionId)}>
        <Animated.View
          style={[
            styles.container,
            {
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius
            }
          ]}
        >
          <Text>
          	<Text style={styles.questionHeader}>Q{questionId+1} </Text>
          	{isOpen && <Text style={styles.questionTitle}>{question.questionText}</Text>}
          </Text>
          {!isOpen && questionResponseId > -1 && <MaterialIcons name="check-circle" size={30} color="#3EB93E" />}
          {!isOpen && questionResponseId == -1 && <Octicons name="dash" size={30} color={global.CURRENT_THEME.colors.text} />}
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.items, { height }]}>
        {question.questionAnswers.map((item, key) => (
          <Item {...{key, item}} answerSelected={questionResponseId == item.answerId} onAnswerPressed={questionHandleAnswerPressed} />
        ))}
      </Animated.View>
    </>
  );
};