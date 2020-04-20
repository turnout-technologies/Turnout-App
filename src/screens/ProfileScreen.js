import React, {Component} from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, Switch, DeviceEventEmitter, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { SimpleLineIcons } from '@expo/vector-icons';

import * as Env from '../Environment';
import {GlobalStyles} from '../Globals';
import {setNotificationsEnabled} from '../Notifications';
import {setUser} from '../AsyncStorage';
import InviteBar from '../components/InviteBar';

class ProfileScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {
      notificationsEnabled: !!global.user.pushToken,
      snackbarVisible: false,
      notificationSwitchDisabled: false,
      user: global.user,
      appState: AppState.currentState
    };

    this.notificationSwitchHandler = this.notificationSwitchHandler.bind(this);
  }

  componentDidMount() {
    this.notificationsEnabledChangedListener = DeviceEventEmitter.addListener('notificationsEnabledChangedListener', (e)=>{this.setState({notificationsEnabled: e.enabled})});
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    this.notificationsEnabledChangedListener.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        let _this = this;
        setTimeout(function(){_this.setState({user: global.user})}, 500);
    }
    this.setState({appState: nextAppState});
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Profile',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
        headerRight: Env.isDevEnv() ? () => (
          <TouchableOpacity style={{marginRight: 20}} onPress={() => navigation.navigate('DebugOptions', {previousScreen: navigation.state.routeName})}>
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
              source={{uri: this.state.user.avatarURL.replace("s96-c", "s384-c")}}
            />
            <View style={styles.profileInfoContainer}>
        			<Text style={[GlobalStyles.headerText, styles.nameText]}>{this.state.user.name}</Text>
        			<Text style={[GlobalStyles.bodyText, styles.emailText]}>{this.state.user.email}</Text>
              <Text style={[GlobalStyles.titleText, styles.pointsText]}>{!!this.state.user.points[global.drop.id] ? this.state.user.points[global.drop.id] : 0} point{global.user.points.total != 1 ? "s" : null}</Text>
        		</View>
          </View>
          <View style={styles.statsRowContainer}>
            <View style={styles.statContainer}>
              <Text style={[GlobalStyles.titleText, styles.statNumber]}>{this.state.user.referrals.valid}</Text>
              <Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Invites Completed</Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={[GlobalStyles.titleText, styles.statNumber]}>{this.state.user.powerups.autocorrects}</Text>
              <Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Autocorrect Power-Ups</Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={[GlobalStyles.titleText, styles.statNumber]}>{this.state.user.points.total}</Text>
              <Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>All-Time{"\n"}Points</Text>
            </View>
          </View>
          <InviteBar/>
          <TouchableOpacity style={styles.inviteButton} onPress={() => this.props.navigation.navigate('Invite')}>
            <Text style={[GlobalStyles.bodyText, styles.inviteButtonText]}>Invite Friends</Text>
          </TouchableOpacity>
          <View style={[styles.settingsSeparator, {marginTop: 25}]} />
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
    marginTop: 25,
    marginBottom: 15
  },
  profileInfoContainer: {
  	alignItems: "center",
    marginLeft: 30
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
    marginHorizontal: 25,
    width: 25,
    textAlign: "center"
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
    marginHorizontal: 25,
    marginBottom: 15,
  	flexDirection: "row",
  	justifyContent: "space-between"
  },
  statContainer: {
  	alignItems: "center",
  	width: "33%"
  },
  statNumber: {
  	fontSize: 24,
    color: global.CURRENT_THEME.colors.primary
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
  },
  inviteButton: {
    marginTop: 10,
    width:175,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },
  inviteButtonText: {
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "center",
    fontSize: 20
  },
});

module.exports= ProfileScreen