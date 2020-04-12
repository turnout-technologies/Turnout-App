import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, Button, TouchableHighlight } from 'react-native';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import { MaterialDialog } from 'react-native-material-dialog';
import { TextField } from 'react-native-material-textfield';

import {GlobalStyles} from '../Globals';
import * as AsyncStorage from '../AsyncStorage';
import * as Env from '../Environment';
import * as API from '../APIClient';

export default class DebugOptionsScreen extends Component {

  static navigationOptions = {
    title: 'Debug',
    headerStyle: GlobalStyles.headerStyle,
    headerTintColor: global.CURRENT_THEME.colors.accent
  };

  constructor (props) {
    super(props);
    this.state = {
      serverHostnameDialogVisible: false,
      APIHostname: ""
    };
    this.goToPreviousScreen = this.goToPreviousScreen.bind(this);
    this.onServerHostnameDialogButtonPressed = this.onServerHostnameDialogButtonPressed.bind(this);
    this.showAPIHostname = this.showAPIHostname.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    this.showAPIHostname();
  }

  async showAPIHostname() {
    var APIHostname = await Env.getAPIHostname();
    this.setState({APIHostname});
  }

  async signOut() {
    firebase.auth().signOut();
    this.props.navigation.navigate('Auth');
  };

  goToPreviousScreen() {
    this.props.navigation.navigate(this.props.navigation.state.params.previousScreen);
  }

  async onServerHostnameDialogButtonPressed(yes) {
    if (yes) {
      await AsyncStorage.setServerHostname(this.hostnameTextField.value());
      API.setBaseURL(this.hostnameTextField.value());
      this.showAPIHostname();
    }
    this.setState({serverHostnameDialogVisible: false});
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={[GlobalStyles.frontLayerContainer, {marginTop: 75}]}>
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
          <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={() => this.setState({serverHostnameDialogVisible: true}, () => {this.hostnameTextField.setValue(this.state.APIHostname); this.hostnameTextField.focus()})}>
            <View style={styles.settingsItem}>
              <Ionicons name="md-information-circle" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
              <View>
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>Server Hostname</Text>
                <Text style={[GlobalStyles.bodyText]}>{this.state.APIHostname}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={this.signOut}>
            <View style={styles.settingsItem}>
              <Ionicons name="md-information-circle" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
              <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>Sign Out</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={this.goToPreviousScreen}>
            <View style={styles.settingsItem}>
              <Ionicons name="md-information-circle" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
              <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>Close</Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
        <MaterialDialog
          visible={this.state.serverHostnameDialogVisible}
          onOk={() => this.onServerHostnameDialogButtonPressed(true)}
          onCancel={() => this.onServerHostnameDialogButtonPressed(false)}
          title="API Hostname"
          okLabel="Save"
          cancelLabel="Cancel"
          colorAccent={global.CURRENT_THEME.colors.primary}
          backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
          <View>
            <Text style={[GlobalStyles.bodyText]}>Set the hostname for the Turnout API (e.g. http://192.168.1.10:8000 or https://api.example.com)</Text>
            <TextField
              tintColor={global.CURRENT_THEME.colors.primary}
              baseColor={global.CURRENT_THEME.colors.text}
              label="Hostname"
              animationDuration={100}
              labelTextStyle={GlobalStyles.bodyText}
              ref={(hostnameTextField) => {this.hostnameTextField=hostnameTextField}}
            />
          </View>
        </MaterialDialog>
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