import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, Button, TouchableHighlight } from 'react-native';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';

export default class DebugOptionsScreen extends Component {

  static navigationOptions = {
    title: 'Debug',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
     super(props);
  }

  signOut = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer}>
          <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={() => this.props.navigation.navigate('TurboVote')}>
            <View style={styles.settingsItem}>
              <Ionicons name="md-information-circle" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
              <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>TurboVote Test</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={() => this.props.navigation.navigate('Name')}>
            <View style={styles.settingsItem}>
              <Ionicons name="md-information-circle" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
              <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>Voter Info Flow</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={this.signOut}>
            <View style={styles.settingsItem}>
              <Ionicons name="md-information-circle" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
              <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>Sign Out</Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60
  },
  settingsItemIcon: {
    marginHorizontal: 25
  },
  settingsItemText: {
    fontSize: 18,
    flexShrink: 1
  }
});