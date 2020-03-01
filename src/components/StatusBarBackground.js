'use strict'
import React, {Component} from 'react';
import {View, StyleSheet, Status, StatusBar, Platform} from 'react-native';
import PropTypes from 'prop-types';

const IOS_STATUS_BAR_HEIGHT = 0;
const ANDROID_STATUS_BAR_HEIGHT = StatusBar.currentHeight;

global.STATUS_BAR_HEIGHT = (Platform.OS === 'ios') ? IOS_STATUS_BAR_HEIGHT : ANDROID_STATUS_BAR_HEIGHT;

class StatusBarBackground extends Component {

  static propTypes = {
    backgroundColor: PropTypes.string
  }

  render() {
    const { backgroundColor } = this.props;
    return(
      <View>
        <StatusBar barStyle="light-content"/>
        <View style={[styles.statusBarBackground, {backgroundColor: backgroundColor} || {}]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: STATUS_BAR_HEIGHT
  }
})

module.exports= StatusBarBackground