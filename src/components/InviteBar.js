import React, {Component} from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

import {GlobalStyles} from '../Globals';

export const LIST_ITEM_HEIGHT = 20;

export default class InviteBar extends Component {

  render() {
    const invitesComplete = global.user.referrals.valid;
    const nextLevel = global.user.referrals.nextLevel;
    const percentageDecimal = invitesComplete/nextLevel;
    return (
      <View style={styles.container}>
        <View style={styles.answerContainer}>
          <LinearGradient
            colors={[global.CURRENT_THEME.colors.primary, global.CURRENT_THEME.colors.primary, 'rgba(0,0,0,0.1)']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0, percentageDecimal, percentageDecimal]}
            style={styles.answerColorContainer}
          />
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            <Text style={GlobalStyles.headerText}>{nextLevel-invitesComplete}</Text>
            <Text style={GlobalStyles.bodyText}> invite{nextLevel != 1 ? s : null} to next power-up</Text>
          </Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    alignSelf: "center"
  },
  answerContainer: {
    minHeight: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    borderRadius: global.CURRENT_THEME.roundness,
    zIndex: -1,
  },
  answerColorContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: global.CURRENT_THEME.roundness,
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 25/2
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  subtitleText: {
    fontSize: 15
  }
});