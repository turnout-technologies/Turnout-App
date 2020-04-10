import React, {Component} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';

export default class FormButtonsSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.onFocus = this.onFocus.bind(this);
    this.validateText = this.validateText.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  static propTypes = {
    items: PropTypes.array,
    onButtonPressed: PropTypes.func,
  }

  getValue() {
    return this.textFieldRef.value().trim();
  }

  validateText(text) {
    if (!this.getValue()) {
      this.setState({error: "This field cannot be blank"});
      return false;
    }
    return true;
  }

  focus() {
    this.textFieldRef.focus();
  }

  onFocus() {
    this.setState({ error: "" });
  }

  onChangeText(text) {
    if(!this.getValue() && text) {
      this.setState({ error: "" });
    }
  }

  render() {
    const { items, onButtonPressed } = this.props;
    return (
      <View style={styles.container}>
        {items.map((item, key) => (
          <TouchableOpacity {...{key, item}} style={styles.button} onPress={ () => onButtonPressed(item.text)}>
            <Ionicons name={item.icon} size={30} color={global.CURRENT_THEME.colors.accent}/>
            <Text style={[GlobalStyles.bodyText, styles.buttonText]}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width:270,
    height: 68,
    marginVertical: 20,
    alignSelf: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: global.CURRENT_THEME.colors.accent,
    fontSize: 30,
    marginLeft: 10
  },
});