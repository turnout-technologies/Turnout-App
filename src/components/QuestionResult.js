import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { bInterpolate, useTimingTransition } from "react-native-redash";
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialDialog } from 'react-native-material-dialog';

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

export default ({ question, questionIndex, aggregate, winningAnswers, response, navigation }: QuestionResultProps) => {
  const [contentReady, setContentReady] = useState(false);
  var totalCount = 0;
  for (var key in aggregate) {
    totalCount += aggregate[key];
  }
  const [autocorrectDialogVisible, setAutocorrectDialogVisible] = useState(false);
  const [noAutocorrectsDialogVisible, setNoAutocorrectsDialogVisible] = useState(false);
  const isCorrect = winningAnswers.includes(response);
  const hasAutocorrects = global.user.powerups.hacks > 0;

  function useAutocorrect() {
    console.log("hocus pocus");
    setAutocorrectDialogVisible(false);
  }

  function inviteFriends() {
    navigation.navigate('Invite');
    setNoAutocorrectsDialogVisible(false);
  }

  return (
    <>
      <View style={styles.container}>
        <Text>
          <Text style={[GlobalStyles.headerText, styles.questionHeader]}>Q{questionIndex+1} </Text>
          <Text style={[GlobalStyles.titleText, styles.questionTitle]}>{question.title}</Text>
        </Text>
        { !isCorrect &&
          <TouchableOpacity style={styles.debugButton} onPress={() => hasAutocorrects ? setAutocorrectDialogVisible(true) : setNoAutocorrectsDialogVisible(true)}>
            <SimpleLineIcons name="magic-wand" size={25} color={hasAutocorrects > 0 ? global.CURRENT_THEME.colors.primary : global.CURRENT_THEME.colors.text_opacity5} />
          </TouchableOpacity>
        }
      </View>
      <View style={[styles.items, {paddingBottom: LIST_PADDING_BOTTOM, marginBottom: 10}]}>
        <View>
          {question.answers.map((item, key) => (
            <AnswerResult {...{key, item}} answer={item} count={aggregate[item.id]} totalCount={totalCount} isCorrectAnswer={winningAnswers.includes(item.id)} isUserResponse={item.id===response} />
          ))}
        </View>
      </View>
      <MaterialDialog
        visible={autocorrectDialogVisible}
        onOk={() => useAutocorrect()}
        onCancel={() => setAutocorrectDialogVisible(false)}
        okLabel="Use It"
        cancelLabel="Cancel"
        colorAccent={global.CURRENT_THEME.colors.primary}
        backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
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
          <Text style={[GlobalStyles.headerText, styles.autocorrectDialogText]}> {global.user.powerups.hacks}</Text>
          <Text style={[GlobalStyles.bodyText, styles.autocorrectDialogText]}> remaining.</Text>
        </Text>
      </MaterialDialog>
      <MaterialDialog
        visible={noAutocorrectsDialogVisible}
        onOk={() => inviteFriends()}
        onCancel={() => setNoAutocorrectsDialogVisible(false)}
        okLabel="Invite Friends"
        cancelLabel="Cancel"
        colorAccent={global.CURRENT_THEME.colors.primary}
        backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
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
      </MaterialDialog>
    </>
  );
};