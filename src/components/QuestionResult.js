import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import Animated from "react-native-reanimated";
import { bInterpolate, useTimingTransition } from "react-native-redash";
import { MaterialIcons, Octicons } from '@expo/vector-icons';

import AnswerResult, { LIST_ITEM_HEIGHT } from "./AnswerResult";
import {GlobalStyles} from '../Globals';

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
  },
  questionTitle: {
    fontSize: 20,
  },
  items: {
    overflow: "hidden",
    backgroundColor: global.CURRENT_THEME.colors.background,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 5
  }
});

export default ({ question, questionIndex, aggregate, winningAnswers, response }: QuestionResultProps) => {
  const [contentReady, setContentReady] = useState(false);
  var totalCount = 0;
  for (var key in aggregate) {
    totalCount += aggregate[key];
  }

  return (
    <>
        <View style={styles.container}>
          <Text>
            <Text style={[GlobalStyles.headerText, styles.questionHeader]}>Q{questionIndex+1} </Text>
            <Text style={[GlobalStyles.titleText, styles.questionTitle]}>{question.title}</Text>
          </Text>
        </View>
      <View style={[styles.items, {paddingBottom: LIST_PADDING_BOTTOM}]}>
        <View>
          {question.answers.map((item, key) => (
            <AnswerResult {...{key, item}} answer={item} count={aggregate[item.id]} totalCount={totalCount} isCorrectAnswer={winningAnswers.includes(item.id)} isUserResponse={item.id===response} />
          ))}
        </View>
      </View>
    </>
  );
};