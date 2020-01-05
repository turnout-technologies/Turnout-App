import React from 'react';
import { View, StyleSheet, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {GlobalStyles} from '../Globals';

export default function MiddleScreen() {
  return (
    <View style={GlobalStyles.backLayerContainer}>
      <View style={GlobalStyles.frontLayerContainer}>
        <Text style={styles.pollStatusText}>Polls close in</Text>
        <Text style={styles.pollCountdownText}>01:37:34</Text>
        <View style={styles.startButtonContainer}>
          <TouchableOpacity style={styles.startButton} onPress = { () => Alert.alert('Simple Button pressed')}>
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

MiddleScreen.navigationOptions = {
  headerStyle: GlobalStyles.headerStyle
};

const styles = StyleSheet.create({
  pollStatusText: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 20,
    fontWeight: "normal",
    color: global.CURRENT_THEME.colors.text
  },

  pollCountdownText: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold",
    color: global.CURRENT_THEME.colors.text
  },

  startButtonContainer: {
    width:270,
    height: 68,
    alignSelf:'center',
  },

  startButton: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },

  startButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 35
  }
});