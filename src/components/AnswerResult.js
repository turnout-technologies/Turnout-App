import React, {useEffect} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';

const CORRECT_ANSWER_COLOR='#9fdf9f';
const INCORRECT_ANSWER_COLOR='#f58a8b';
const NORMAL_ANSWER_COLOR="#e6e6e6";

export const LIST_ITEM_HEIGHT = 60;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    minHeight: LIST_ITEM_HEIGHT,
    minWidth: 200,
  },

  answerContainer: {
    flex: 1,
    minHeight: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    borderColor: global.CURRENT_THEME.colors.text_opacity3,
    borderRadius: global.CURRENT_THEME.roundness,
    borderWidth: 1,
    zIndex: -1
  },
  answerContentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  answerText: {
    fontSize: 16,
    flex: 1,
    padding: 5
  },
  answerResultRightContainer: {
    flexDirection: "row",
  },
  percentageText: {
    fontSize: 16,
  },
  answerColorContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: global.CURRENT_THEME.roundness
  },
   profileImage: {
    width: 25,
    height: 25,
    borderRadius: 25/2
  },
});

export default ({ answer, count, totalCount, isCorrectAnswer, isUserResponse }: ListItemProps) => {
  var isIncorrectAnswer = !isCorrectAnswer && isUserResponse;
  var percentageDecimal = count/totalCount;
  var percentageStr = Math.round(percentageDecimal*100);
  var color = isCorrectAnswer ? CORRECT_ANSWER_COLOR : (isIncorrectAnswer ? INCORRECT_ANSWER_COLOR : NORMAL_ANSWER_COLOR);

  return (
    <View style={styles.container}>
      <View style={styles.answerContainer}>
        {<LinearGradient colors={[color, color, 'rgba(0,0,0,0)']} start={[0, 0]} end={[1, 0]} locations={[0, percentageDecimal, percentageDecimal]} style={styles.answerColorContainer}/>}
        <View style={styles.answerContentContainer}>
          <Text style={[GlobalStyles.titleText, styles.answerText]}>{answer.text}</Text>
          <View style={styles.answerResultRightContainer}>
            {isUserResponse && <Image style={styles.profileImage} source={{uri: global.user.avatarURL.replace("s96-c", "s384-c")}}/>}
            <Text style={[GlobalStyles.titleText, styles.percentageText]}> {percentageStr}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};