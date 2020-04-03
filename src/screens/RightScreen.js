import React, {Component} from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, Switch, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';

import getEnvVars from '../Environment';
import {GlobalStyles} from '../Globals';
import {setNotificationsEnabled} from '../Notifications';
import {setUser} from '../AsyncStorage';


class RightScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {
      notificationsEnabled: !!global.user.pushToken,
      snackbarVisible: false,
      notificationSwitchDisabled: false
    };

    this.notificationSwitchHandler = this.notificationSwitchHandler.bind(this);
  }

  componentDidMount() {
    this.notificationsEnabledChangedListener = DeviceEventEmitter.addListener('notificationsEnabledChangedListener', (e)=>{this.setState({notificationsEnabled: e.enabled})});
  }

  componentWillUnmount() {
    this.notificationsEnabledChangedListener.remove();
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Profile',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
        headerRight: __DEV__ ? () => (
          <TouchableOpacity style={{marginRight: 20}} onPress={() => navigation.navigate('DebugOptions')}>
            <Ionicons name="md-bug" size={25} color={global.CURRENT_THEME.colors.accent} />
          </TouchableOpacity>
        ) : null
      };
  }

  onFeedbackSubmitted = data => {
    this.setState(data);
  };

  submitFeedback(feedbackType) {
    this.props.navigation.navigate('Feedback', {type: feedbackType, onFeedbackSubmitted: this.onFeedbackSubmitted})
  }

  notificationSwitchHandler(enable) {
    this.setState({notificationSwitchDisabled: true});
    setNotificationsEnabled(enable)
      .then(function(success) {
        this.setState({notificationSwitchDisabled: false});
        if (success) {
          this.setState({notificationsEnabled: enable});
        }
      }.bind(this));
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
	        <ScrollView style={GlobalStyles.frontLayerContainer} showsVerticalScrollIndicator={false}>
        		<View style={styles.profileContainer}>
              <Image
                  style={styles.profileImage}
                  source={{uri: global.user.avatarURL.replace("s96-c", "s384-c")}}
              />
              <View style={styles.profileInfoContainer}>
          			<Text style={[GlobalStyles.headerText, styles.nameText]}>{global.user.name}</Text>
          			<Text style={[GlobalStyles.bodyText, styles.emailText]}>{global.user.email}</Text>
                <Text style={[GlobalStyles.titleText, styles.pointsText]}>{global.user.points} point{global.user.points != 1 ? "s" : null}</Text>
          		</View>
            </View>
            <View style={styles.settingsSeparator} />
            <Text style={[GlobalStyles.titleText, styles.settingHeaderText]}>Feedback</Text>
            <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} style={styles.touchableHighlight} onPress={ () => this.submitFeedback("bug")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-bug" size={25} color="red" style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I found a bug</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => this.submitFeedback("question_idea")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-chatbubbles" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I want to suggest a ballot question</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => this.submitFeedback("happy")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-happy" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I like something</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => this.submitFeedback("sad")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-sad" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I don't like something</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => this.submitFeedback("suggestion")}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-bulb" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>I have an idea/suggestion</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.settingsSeparator} />
            <Text style={[GlobalStyles.titleText, styles.settingHeaderText]}>Notifications</Text>
            <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} disabled={this.state.notificationSwitchDisabled} onPress={ () => this.notificationSwitchHandler(!this.state.notificationsEnabled)}>
              <View style={[styles.settingsItem, {justifyContent: "space-between"}]}>
                <View style={{flexDirection: "row"}}>
                  <Ionicons name="md-notifications" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                  <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>Enable notifications</Text>
                </View>
                <Switch
                  value={this.state.notificationsEnabled}
                  thumbColor={this.state.notificationsEnabled && Platform.OS == "android" ? global.CURRENT_THEME.colors.primary : "white"}
                  trackColor={{true: Platform.OS == "android" ? global.CURRENT_THEME.colors.primary_75 : global.CURRENT_THEME.colors.primary}}
                  style={styles.settingsSwitch}
                  ios_backgroundColor="#F4F4F4"
                  onValueChange={v => {this.notificationSwitchHandler(v)}}
                  disabled={this.state.notificationSwitchDisabled} />
              </View>
            </TouchableHighlight>
            <View style={styles.settingsSeparator} />
            <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={() => this.props.navigation.navigate('About')}>
              <View style={styles.settingsItem}>
                <Ionicons name="md-information-circle" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.settingsItemIcon} />
                <Text style={[GlobalStyles.bodyText, styles.settingsItemText]}>About</Text>
              </View>
            </TouchableHighlight>
	        </ScrollView>
          <Snackbar
            visible={this.state.snackbarVisible}
            style={styles.snackbar}
            duration={5000}
            onDismiss={() => this.setState({ snackbarVisible: false })} >
            Feedback submitted. Thanks!
          </Snackbar>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
  profileContainer: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    maxWidth: 300,
    alignItems: "center",
    margin: 25
  },
  profileInfoContainer: {
  	alignItems: "center",
    marginLeft: 20
  },
  profileImage: {
  	width: 125,
  	height: 125,
  	borderRadius: 125/2
  },
  nameText: {
  	fontSize: 25,
    marginTop: 15
  },
  emailText: {
  	fontSize: 15
  },
  pointsText: {
    fontSize: 20,
    color: global.CURRENT_THEME.colors.primary
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
    fontSize: 18,
    flexShrink: 1
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
  snackbar: {
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: 0,
    width: '100%',
    margin: 0,
  }
});

module.exports= RightScreen