import React, {Component} from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from 'prop-types';
import { TextField } from 'react-native-material-textfield';

import {GlobalStyles} from '../Globals';

export default class FormTextField extends Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.onFocus = this.onFocus.bind(this);
    this.validateText = this.validateText.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  static propTypes = {
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    onSubmitEditing: PropTypes.func
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
    console.log("HERE");
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
    const { label, defaultValue, onSubmitEditing } = this.props;
    return (
      <TextField
        ref={ref => this.textFieldRef = ref}
        fontSize={30}
        labelFontSize={16}
        tintColor={global.CURRENT_THEME.colors.primary}
        label={label}
        error={this.state.error}
        errorColor={global.LOGO_RED}
        animationDuration={150}
        contentInset={{input: 0}}
        labelOffset={{y1: -15}}
        labelTextStyle={GlobalStyles.bodyText}
        style={[GlobalStyles.bodyText, {color: "black"}]}
        value={defaultValue}
        autoCorrect={false}
        enablesReturnKeyAutomatically={true}
        onChangeText={this.onChangeText}
        onFocus={this.onFocus}
        onBlur={this.validateText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType='next'
      />
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