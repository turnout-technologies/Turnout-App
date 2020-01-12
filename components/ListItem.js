import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

export const LIST_ITEM_HEIGHT = 64;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: LIST_ITEM_HEIGHT
  },

  answerButtonContainer: {
    flex:1,
    alignSelf:'center',
  },

  answerButton: {
    flex: 1,
    justifyContent: "center",
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderRadius: global.CURRENT_THEME.roundness,
      borderColor: global.CURRENT_THEME.colors.text,
      borderWidth: 1
  },

  answerButtonText: {
      color: global.CURRENT_THEME.colors.text,
      textAlign: "center",
      fontSize: 16
  },

  answerButtonSelected: {
    flex: 1,
    justifyContent: "center",
      backgroundColor: global.CURRENT_THEME.colors.primary,
      borderRadius: global.CURRENT_THEME.roundness,
  },

  answerButtonTextSelected: {
      color: global.CURRENT_THEME.colors.accent,
      textAlign: "center",
      fontSize: 16
  }
});

interface ListItemProps {
  item: ListItem;
  isLast: boolean;
}

export default ({ item, isLast, answerSelected, onAnswerPressed }: ListItemProps) => {
  const bottomRadius = isLast ? global.CURRENT_THEME.roundness : 0;
  var answerButtonStyle = answerSelected ? styles.answerButtonSelected : styles.answerButton;
  var answerButtonTextStyle = answerSelected ? styles.answerButtonTextSelected : styles.answerButtonText;
  return (
    <View
      style={[
        styles.container,
        {
          borderBottomLeftRadius: bottomRadius,
          borderBottomRightRadius: bottomRadius
        }
      ]}
    >
      <View style={styles.answerButtonContainer}>
        <TouchableOpacity style={answerButtonStyle} onPress={ () => onAnswerPressed(item.id)}>
          <Text style={answerButtonTextStyle}>{item.text}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};