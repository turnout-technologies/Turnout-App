import React, {Component} from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';

const FIRST_PLACE_SIZE=110;
const SECOND_PLACE_SIZE=100;
const THIRD_PLACE_SIZE=95;

export default class Podium extends Component {

  static propTypes = {
    leaders: PropTypes.array
  }

  getCircleBackgroundColor(position) {
    switch(position) {
      case 1:
        return "#F3B50A";
      case 2:
        return "#BCBDBF";
      case 3:
        return "#B53F25";
    }
  }

  formatAvatarURL(avatarURL, imageSize) {
    return avatarURL.replace("=s96", "=s"+imageSize).replace("/thumb", "");
  }

  render() {
    const { leaders } = this.props;
    var podiumSize = leaders.length;
    return (
      <View style={styles.podiumContainer}>
        {podiumSize >= 2 &&
          <View style={[styles.podiumPlaceContainer, {marginTop: 20}]}>
            <View style={styles.podiumPlacePicContainer}>
              <View style={[styles.secondPlaceCircle, styles.podiumPlaceCircle, {backgroundColor: this.getCircleBackgroundColor(leaders[1].position)}]}>
                <Text style={[GlobalStyles.headerText, styles.podiumPlaceCircleNumber]}>{leaders[1].position}</Text>
              </View>
              <Image
                style={styles.secondPlaceImage}
                source={{uri: this.formatAvatarURL(leaders[1].avatarURL, SECOND_PLACE_SIZE)}}
                defaultSource={require('../../assets/images/md-contact.png')}
              />
            </View>
            <Text style={[GlobalStyles.titleText, styles.secondPlaceText]}>{leaders[1].name}</Text>
            <Text style={[GlobalStyles.bodyText, styles.secondPlaceText]}>{leaders[1].points.total}</Text>
          </View>
        }
        { podiumSize >= 1 &&
          <View style={styles.podiumPlaceContainer}>
            <View style={styles.podiumPlacePicContainer}>
              <View style={[styles.firstPlaceCircle, styles.podiumPlaceCircle, {backgroundColor: this.getCircleBackgroundColor(leaders[0].position)}]}>
                <Text style={[GlobalStyles.headerText, styles.podiumPlaceCircleNumber]}>{leaders[0].position}</Text>
              </View>
              <Image
                style={styles.firstPlaceImage}
                source={{uri: this.formatAvatarURL(leaders[0].avatarURL, FIRST_PLACE_SIZE)}}
                defaultSource={require('../../assets/images/md-contact.png')}
              />
            </View>
            <Text style={[GlobalStyles.titleText, styles.firstPlaceText]}>{leaders[0].name}</Text>
            <Text style={[GlobalStyles.bodyText, styles.firstPlaceText]}>{leaders[0].points.total}</Text>
          </View>
        }
        { podiumSize >= 3 &&
          <View style={[styles.podiumPlaceContainer, {marginTop: 30}]}>
            <View style={styles.podiumPlacePicContainer}>
              <View style={[styles.thirdPlaceCircle, styles.podiumPlaceCircle, {backgroundColor: this.getCircleBackgroundColor(leaders[2].position)}]}>
                <Text style={[GlobalStyles.headerText, styles.podiumPlaceCircleNumber]}>{leaders[2].position}</Text>
              </View>
              <Image
                style={styles.thirdPlaceImage}
                source={{uri: this.formatAvatarURL(leaders[2].avatarURL, THIRD_PLACE_SIZE)}}
                defaultSource={require('../../assets/images/md-contact.png')}
              />
            </View>
            <Text style={[GlobalStyles.titleText, styles.thirdPlaceText]}>{leaders[2].name}</Text>
            <Text style={[GlobalStyles.bodyText, styles.thirdPlaceText]}>{leaders[2].points.total}</Text>
          </View>
        }
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
  firstPlaceImage: {
    width: FIRST_PLACE_SIZE,
    height: FIRST_PLACE_SIZE,
    borderRadius: FIRST_PLACE_SIZE/2,
  },
  secondPlaceImage: {
    width: SECOND_PLACE_SIZE,
    height: SECOND_PLACE_SIZE,
    borderRadius: SECOND_PLACE_SIZE/2,
  },
  thirdPlaceImage: {
    width: THIRD_PLACE_SIZE,
    height: THIRD_PLACE_SIZE,
    borderRadius: THIRD_PLACE_SIZE/2,
  },
  firstPlaceText: {
    alignSelf: "center",
    fontSize: 17
  },
  secondPlaceText: {
    alignSelf: "center",
    fontSize: 15
  },
  thirdPlaceText: {
    alignSelf: "center",
    fontSize: 14
  },
});