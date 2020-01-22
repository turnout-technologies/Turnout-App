import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export const LIST_ITEM_HEIGHT = 60;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  answerButtonContainer: {
    flex:1,
    alignSelf:'center',
  },

  answerButton: {
    flex: 0,
    minHeight: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: global.CURRENT_THEME.roundness,
    borderColor: global.CURRENT_THEME.colors.text_opacity3,
    borderWidth: 1,
    paddingVertical: 10
  },

  answerContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15
  },

  answerButtonText: {
    flex:1,
    color: global.CURRENT_THEME.colors.text,
    textAlign: "left",
    fontSize: 16
  },

  answerButtonSelected: {
    flex: 0,
    minHeight: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness,
    borderColor: global.CURRENT_THEME.colors.primary,
    borderWidth: 1,
    paddingVertical: 10
  },

  answerButtonTextSelected: {
    flex:1,
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "left",
    fontSize: 16
  }
});

export default ({ item, answerSelected, onAnswerPressed }: ListItemProps) => {
  var answerButtonStyle = answerSelected ? styles.answerButtonSelected : styles.answerButton;
  var answerButtonTextStyle = answerSelected ? styles.answerButtonTextSelected : styles.answerButtonText;
  return (
    <View
      style={styles.container}
    >
      <View style={styles.answerButtonContainer}>
        <TouchableOpacity style={answerButtonStyle} onPress={ () => onAnswerPressed(item.answerId)}>
          <View style={styles.answerContentContainer}>
            <Text style={answerButtonTextStyle}>{item.answerText}</Text>
            {answerSelected && <MaterialIcons style={{marginLeft: 10}} name="check" size={25} color={global.CURRENT_THEME.colors.accent} />}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};