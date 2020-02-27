import React, {useEffect} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';

//const CORRECT_ANSWER_COLOR='rgba(62, 185, 62, 1)';
//const INCORRECT_ANSWER_COLOR='rgba(238, 55, 57, 1)';
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
    minWidth: 200
  },

  answerContainer: {
    flex: 1,
    minHeight: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    borderRadius: global.CURRENT_THEME.roundness,
  },

  answerContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15
  },

  answerText: {
    flex:1,
    textAlign: "left",
    fontSize: 16,
  },

  rightContainer:{
    position: 'absolute',
      width:'100%',
      height: '100%',
      backgroundColor: 'white',
      borderColor: global.CURRENT_THEME.colors.text_opacity3,
      borderRadius: global.CURRENT_THEME.roundness,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      zIndex: -1
  },
   profileImage: {
    width: 25,
    height: 25,
    borderRadius: 25/2
  },
});

function getLeftContainerStyle(isCorrectAnswer, isIncorrectAnswer, percentage) {

  var color = isCorrectAnswer ? CORRECT_ANSWER_COLOR : (isIncorrectAnswer ? INCORRECT_ANSWER_COLOR : NORMAL_ANSWER_COLOR);
  var percentageStr = percentage+'%';

  return ({
    position: 'absolute',
    width: percentageStr,
    height: '100%',
    backgroundColor: color,
    borderColor: color,
    borderTopLeftRadius: global.CURRENT_THEME.roundness,
    borderBottomLeftRadius: global.CURRENT_THEME.roundness,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  });
}

export default ({ answer, count, totalCount, isCorrectAnswer, isUserResponse }: ListItemProps) => {
  var isIncorrectAnswer = !isCorrectAnswer && isUserResponse;
  var percentage = count/totalCount*100;

  return (
    <View style={styles.container}>
      <View style={[styles.answerContainer]}>
        <View style={getLeftContainerStyle(isCorrectAnswer, isIncorrectAnswer, percentage)}/>
        <View style={styles.rightContainer}/>
        <View style={styles.answerContentContainer}>
          <Text style={[GlobalStyles.titleText, styles.answerText]}>{answer.text}</Text>
          {isUserResponse && <Image style={styles.profileImage} source={{uri: global.user.avatarURL.replace("s96-c", "s384-c")}}/>}
          {isUserResponse && isCorrectAnswer && <MaterialIcons style={{marginLeft: 10}} name="check" size={25} color={CORRECT_ANSWER_COLOR} />}
          {isIncorrectAnswer && <MaterialIcons style={{marginLeft: 10}} name="close" size={25} color={INCORRECT_ANSWER_COLOR} />}
        </View>
        </View>
    </View>
  );
};