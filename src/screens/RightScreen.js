import React, {Component} from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableNativeFeedback, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import getEnvVars from '../Environment';
import * as API from '../APIClient';
import {GlobalStyles} from '../Globals';
import {setNotificationsEnabled} from '../Notifications';
import {setUser} from '../AsyncStorage';


class RightScreen extends Component {

	constructor() {
    super();
    this.state = {notificationsEnabled: !!global.user.pushToken};

    this.notificationSwitchHandler = this.notificationSwitchHandler.bind(this);
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Profile',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
        headerRight: __DEV__ ? () => (
          <TouchableNativeFeedback style={{paddingRight: 20}} onPress={() => navigation.navigate('DebugOptions')}>
            <Ionicons name="md-bug" size={25} color={global.CURRENT_THEME.colors.accent} />
          </TouchableNativeFeedback>
        ) : null
      };
  }

  submitFeedback(feedbackType) {
    console.log(feedbackType);
  }

  notificationSwitchHandler(enable) {
    this.setState({notificationsEnabled: enable});
    setNotificationsEnabled(enable);
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
	        <ScrollView style={GlobalStyles.frontLayerContainer}>
        		<View style={styles.profileInfoContainer}>
        			<Image
	          			style={styles.profileImage}
	          			source={{uri: global.user.avatarURL.replace("s96-c", "s384-c")}}
        			/>
        			<Text style={[GlobalStyles.headerText, styles.name]}>{global.user.name}</Text>
        			<Text style={[GlobalStyles.bodyText, styles.email]}>{global.user.email}</Text>
        		</View>
            <View style={styles.settingsSeparator} />
            <Text style={[GlobalStyles.titleText, styles.settingHeaderText]}>Feedback</Text>
            <TouchableNativeFeedback onPress={ () => this.submitFeedback("bug")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-bug" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I found a bug</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={ () => this.submitFeedback("feedback")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-chatbubbles" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I have a suggestion/feedback</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={ () => this.submitFeedback("questionidea")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-bulb" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I have an idea for a ballot question</Text>
              </View>
            </TouchableNativeFeedback>
            <View style={styles.settingsSeparator} />
            <Text style={[GlobalStyles.titleText, styles.settingHeaderText]}>Notifications</Text>
            <TouchableNativeFeedback onPress={ () => this.notificationSwitchHandler(!this.state.notificationsEnabled)}>
              <View style={[styles.settingsItem, {justifyContent: "space-between"}]}>
                <View style={{flexDirection: "row"}}>
                  <Ionicons name="md-notifications" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                  <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>Enable Notifications</Text>
                </View>
                <Switch
                  value={this.state.notificationsEnabled}
                  thumbColor={global.CURRENT_THEME.colors.primary}
                  style={styles.settingsSwitch}
                  onValueChange={v => {this.notificationSwitchHandler(v)}} />
              </View>
            </TouchableNativeFeedback>
            <View style={styles.settingsSeparator} />
        		{/*<View style={styles.statsRowContainer}>
      				<View style={styles.statContainer}>
      					<Text style={[GlobalStyles.headerText, styles.statNumber]}>10</Text>
      					<Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Questions Answered</Text>
      				</View>
      				<View style={styles.statContainer}>
      					<Text style={[GlobalStyles.headerText, styles.statNumber]}>200</Text>
      					<Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Points</Text>
      				</View>
      				<View style={styles.statContainer}>
      					<Text style={[GlobalStyles.headerText, styles.statNumber]}>3</Text>
      					<Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Friend Invites</Text>
      				</View>
      			</View>*/}
	        </ScrollView>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
  profileInfoContainer: {
  	flex: 1,
  	alignItems: "center",
  	marginTop: 20,
  	paddingBottom: 20
  },
  profileImage: {
  	width: 125,
  	height: 125,
  	borderRadius: 125/2
  },
  name: {
  	fontSize: 25,
    marginTop: 15
  },
  email: {
  	fontSize: 15
  },
  settingHeaderText: {
    marginLeft: 20,
    fontSize: 16
  },
  settingsSeparator: {
    borderBottomColor: global.CURRENT_THEME.colors.text_opacity3,
    borderBottomWidth: 0.5,
    marginBottom: 10
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60
  },
  settingsItemIcon: {
    marginHorizontal: 25
  },
  settingsItemText: {
    fontSize: 18
  },
  settingsSwitch: {
    justifyContent: "flex-end",
    marginRight: 20
  },
  statsRowContainer: {
  	alignSelf: "center",
  	width: 300,
  	flexDirection: "row",
  	justifyContent: "space-between"
  },
  statContainer: {
  	alignItems: "center",
  	width: "33%"
  },
  statNumber: {
  	fontSize: 24
  },
  statSubtitle: {
  	fontSize: 16,
  	textAlign: 'center'
  },
});

module.exports= RightScreen