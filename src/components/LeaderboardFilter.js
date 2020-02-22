import React, {Component} from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';

export default class LeaderboardFilter extends Component {

  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string,
    selected: PropTypes.bool
  }

  render() {
    const { icon, text, selected } = this.props;
    var opacity = selected ? 1 : 0.54;
    return (
      <View style={styles.container}>
        <MaterialIcons
          name={icon}
          size={25}
          color={global.CURRENT_THEME.colors.accent}
          style={{opacity: opacity}}
        />
        <Text style={[GlobalStyles.bodyText, styles.text, {opacity: opacity}]}>{text}</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 16,
    color: global.CURRENT_THEME.colors.accent,
    marginLeft: 5,
  },
});