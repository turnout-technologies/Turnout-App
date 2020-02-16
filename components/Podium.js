import React, {Component} from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';

export default class Podium extends Component {

  static propTypes = {
    leaders: PropTypes.array
  }

  render() {
    const { leaders } = this.props;
    return (
      <View style={styles.podiumContainer}>
        <View style={[styles.podiumPlaceContainer, {marginTop: 20}]}>
          <View style={styles.podiumPlacePicContainer}>
            <View style={[styles.secondPlaceCircle, styles.podiumPlaceCircle, {backgroundColor: "#BCBDBF"}]}>
              <Text style={[GlobalStyles.headerText, styles.podiumPlaceCircleNumber]}>2</Text>
            </View>
            <Ionicons
              name="md-contact"
              size={100}
              color={global.CURRENT_THEME.colors.text}
            />
          </View>
          <Text style={[GlobalStyles.titleText, styles.secondPlaceText]}>{leaders[1].name}</Text>
          <Text style={[GlobalStyles.bodyText, styles.secondPlaceText]}>{leaders[1].points}</Text>
        </View>
        <View style={styles.podiumPlaceContainer}>
          <View style={styles.podiumPlacePicContainer}>
            <View style={[styles.firstPlaceCircle, styles.podiumPlaceCircle, {backgroundColor: "#F3B50A"}]}>
              <Text style={[GlobalStyles.headerText, styles.podiumPlaceCircleNumber]}>1</Text>
            </View>
            <Ionicons
              name="md-contact"
              size={110}
              color={global.CURRENT_THEME.colors.text}
            />
          </View>
          <Text style={[GlobalStyles.titleText, styles.firstPlaceText]}>{leaders[0].name}</Text>
          <Text style={[GlobalStyles.bodyText, styles.firstPlaceText]}>{leaders[0].points}</Text>
        </View>
        <View style={[styles.podiumPlaceContainer, {marginTop: 30}]}>
          <View style={styles.podiumPlacePicContainer}>
            <View style={[styles.thirdPlaceCircle, styles.podiumPlaceCircle, {backgroundColor: "#B53F25"}]}>
              <Text style={[GlobalStyles.headerText, styles.podiumPlaceCircleNumber]}>3</Text>
            </View>
            <Ionicons
              name="md-contact"
              size={95}
              color={global.CURRENT_THEME.colors.text}
            />
          </View>
          <Text style={[GlobalStyles.titleText, styles.thirdPlaceText]}>{leaders[2].name}</Text>
          <Text style={[GlobalStyles.bodyText, styles.thirdPlaceText]}>{leaders[2].points}</Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  podiumContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  podiumPlaceContainer: {
    alignItems: "center"
  },
  podiumPlaceCircle: {
    position: "absolute",
    top: 10,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  podiumPlaceCircleNumber: {
    color: "white",
    fontSize: 14
  },
  firstPlaceCircle: {
    width: 25,
    height: 25,
    borderRadius: 25/2,
  },
  secondPlaceCircle: {
    width: 23,
    height: 23,
    borderRadius: 23/2,
  },
  thirdPlaceCircle: {
    width: 21,
    height: 21,
    borderRadius: 21/2,
  },
  firstPlaceText: {
    alignSelf: "center",
    fontSize: 18
  },
  secondPlaceText: {
    alignSelf: "center",
    fontSize: 16
  },
  thirdPlaceText: {
    alignSelf: "center",
    fontSize: 15
  },
});