import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, AppState } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SplashScreen, Linking } from 'expo';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import { MaterialDialog } from 'react-native-material-dialog';
var moment = require('moment-timezone');

import {GlobalStyles, refreshUser} from '../Globals';
import AnnouncementCard from '../components/AnnouncementCard';
import PollStatusCountdown from '../components/PollStatusCountdown';
import {getLastBallotResultOpenedId, setLastBallotResultOpenedId, getLastRefreshUserTimestamp, getBallotResult, setBallotResult, getDrop, setDrop} from '../AsyncStorage';
import * as API from '../APIClient';

class HomeScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      userRefreshing: false,
      cardsLoading: true,
      showResultsCard: false,
      resultAnnouncementTitleText: "",
      resultAnnouncementBodyText: "",
      inviteBonusDialogVisible: false,
      dropPoints: 0,
      appState: AppState.currentState
    };

    this.resultsDateStr = "";
    this.pollsOpen = false;

    this.handleStartPressed = this.handleStartPressed.bind(this);
    this.handleResultsPressed = this.handleResultsPressed.bind(this);
    this.maybeFetchLatestResults = this.maybeFetchLatestResults.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this._handleNotification = this._handleNotification.bind(this);
    this.onPollStateChange = this.onPollStateChange.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
    AppState.addEventListener('change', this._handleAppStateChange);
    this.initHome();
    this.notificationEventHandler = Notifications.addListener(this._handleNotification);
    this.showBonusDialogIfHasInvite();
  }

  async initHome() {
    await this.fetchDrop();
    this.maybeRefreshUser();
    this.maybeFetchLatestResults();
  }

  showBonusDialogIfHasInvite() {
    if (this.props.navigation.state.params && this.props.navigation.state.params.hasInvite) {
      this.setState({inviteBonusDialogVisible: true});
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.notificationEventHandler && this.notificationEventHandler.remove();
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      //when app is brought to foreground, check if it's time to refresh the user
      this.maybeRefreshUser();
    }
    this.setState({appState: nextAppState});
  }

  updateHeader() {
    this.props.navigation.setParams({
      header: () => (
        <SafeAreaView style={styles.customHeaderContainer} >
          <TouchableOpacity style={styles.headerPointsContainer} onPress={() => Alert.alert("Points", "This is the number of points you have scored so far during the current drop.")}>
            <MaterialCommunityIcons name="ticket" size={25} color={global.CURRENT_THEME.colors.accent} />
            <Text style={[GlobalStyles.bodyText, styles.headerPointsText]}>{!!this.state.dropPoints ? this.state.dropPoints : 0}</Text>
          </TouchableOpacity>
          {/*<View style={{marginHorizontal: 10, borderLeftColor:'white',borderLeftWidth:1,height:'50%'}}/>
          <TouchableOpacity style={styles.headerPointsContainer} onPress={() => Alert.alert("Autocorrect Power-Ups", "This is number of Autocorrect power-ups you have available. Using one corrects a question you got wrong and gives you the points. Invite friends to get more!")}>
            <SimpleLineIcons name="magic-wand" size={25} color={global.CURRENT_THEME.colors.accent} />
            <Text style={[GlobalStyles.bodyText, styles.headerPointsText]}>{global.user.points.total}</Text>
          </TouchableOpacity>*/}
        </SafeAreaView>
      )
    });
  }

  async _handleNotification(notification) {
    //handle the notification when pressed
    console.log(notification);
    if (notification.origin == "selected" && notification.data) {
      switch(notification.data.type) {
        case "poll-notification":
          if (this.pollsOpen) {
            this.props.navigation.navigate('Question');
          }
          break;
        case "results-notification":
          this.props.navigation.navigate('Results')
      }
    }
  }

  async fetchDrop() {
    try {
      var drop = JSON.parse(await getDrop());
      if (!drop || moment() >= moment.unix(drop.endDate)) {
        drop = (await API.getLiveDrop()).data.drop;
        setDrop(drop);
      }
      global.drop = drop;
      this.setState({dropPoints: global.user.points[drop.id]});
    } catch (error) {
      console.log(error);
    }
  }

  async setResultsCardContent() {
    try {
      var lastBallotResultOpenedId = await getLastBallotResultOpenedId();
      var isNewResult = (!lastBallotResultOpenedId || lastBallotResultOpenedId != this.ballotResult.id);
      var resultAnnouncementTitleText = isNewResult ? "New Results! 🔴🎉" : "View Results";
      var resultAnnouncementBodyText = (isNewResult ?
        ("Results from the " + this.resultsDateStr + " ballot are now available! 🗳") :
        ("Take a look at the results from the " + this.resultsDateStr + " ballot 🗳"));
      this.setState({cardsLoading: false, showResultsCard: true, resultAnnouncementTitleText, resultAnnouncementBodyText});
    } catch (error) {
      console.log(error);
    }
  }

  async maybeFetchLatestResults() {
    try {
      var savedBallotResult = await getBallotResult();
      if (savedBallotResult) {
        savedBallotResult = JSON.parse(savedBallotResult);
      }
      if (!savedBallotResult || !moment.unix(savedBallotResult.date).tz("America/New_York").isSame(moment().tz("America/New_York"), 'day')) {
        //only refresh if ballot result date isn't today since ballots only happen once per day
        var response = await API.getLatestBallotResults();
        this.ballotResult = response.data;
        setBallotResult(this.ballotResult);
      } else {
        this.ballotResult = savedBallotResult;
      }
      if (this.ballotResult) {
        this.resultsDateStr = moment.unix(this.ballotResult.date).tz("America/New_York").format("MMMM Do");
        this.setResultsCardContent();
      } else {
        this.setState({cardsLoading: false});
      }
    } catch(error) {
      this.setState({cardsLoading: false});
      console.log(error);
    };
  }

  async maybeRefreshUser() {
    var lastRefreshUserTimestamp = await getLastRefreshUserTimestamp();
    try {
      //switchwd to always refresh user
      var shouldRefreshUser = true; //!lastRefreshUserTimestamp || !moment.unix(lastRefreshUserTimestamp).tz("America/New_York").isSame(moment().tz("America/New_York"), 'day');
      if (shouldRefreshUser) {
        await refreshUser();
        if (global.drop) {
          this.setState({dropPoints: global.user.points[global.drop.id]}, () => {this.updateHeader()});
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  handleStartPressed() {
    this.props.navigation.navigate('Question');
  }

  handleResultsPressed() {
    setLastBallotResultOpenedId(this.ballotResult.id);
    this.setResultsCardContent();
    this.props.navigation.navigate('Results', {resultsResponse: this.ballotResult});
  }

  async onRefresh() {
    this.setState({userRefreshing: true});
    await refreshUser();
    this.updateHeader();
    this.setState({userRefreshing: false});
  }

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    if (state.params != undefined) {
      return {
        header: navigation.state.params.header
      }
    } else {
      return {
        title: '',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      }
    }
  };

  onPollStateChange(pollsOpen) {
    this.pollsOpen = pollsOpen;
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.userRefreshing}
              onRefresh={this.onRefresh}
              colors={[global.CURRENT_THEME.colors.primary]} />
          }
          showsVerticalScrollIndicator={false} >

          <View style={{paddingBottom:20}}>
            <View style={styles.pollStatusContainer}>
              <PollStatusCountdown onPressStart={this.handleStartPressed} appState={this.state.appState} onPollStateChanged={this.onPollStateChange}/>
            </View>
            { (this.state.cardsLoading || this.state.showResultsCard) &&
              <AnnouncementCard
                titleText={this.state.resultAnnouncementTitleText}
                buttonText="Results"
                bodyText={this.state.resultAnnouncementBodyText}
                buttonOnPress={this.handleResultsPressed}
                isLoading={this.state.cardsLoading}
              />
            }
            <AnnouncementCard
              titleText="Support Turnout!"
              bodyText="Please chip in if you can to help us reach as many students as possible! We appreciate you ♥"
              buttonText="Donate"
              buttonOnPress={ () => Linking.openURL('https://donorbox.org/campus-impact-turnout-2020')}
              isLoading={this.state.cardsLoading}
            />
          </View>
        </ScrollView>
        { this.props.navigation.state.params && this.props.navigation.state.params.hasInvite &&
          <MaterialDialog
            visible={this.state.inviteBonusDialogVisible}
            onCancel={() => this.setState({inviteBonusDialogVisible: false})}
            onOk={() => this.setState({inviteBonusDialogVisible: false})}
            cancelLabel=""
            okLabel="Let's Go"
            colorAccent={global.CURRENT_THEME.colors.primary}
            backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
            <View>
              <SimpleLineIcons
                name="magic-wand"
                size={75}
                style={{ alignSelf: "center" }}
                color={global.CURRENT_THEME.colors.primary}
              />
              <Text style={[GlobalStyles.headerText, styles.inviteBonusDialogTitle]}>Invite Bonus</Text>
              <Text style={[GlobalStyles.bodyText, styles.inviteBonusDialogText]}>
                The invite from {this.props.navigation.state.params.referringUserName} got you an Autocorrect power-up 🙌! You can use Autocorrect to correct a question you got wrong and get the points.
              </Text>
            </View>
          </MaterialDialog>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  customHeaderContainer: {
    backgroundColor: global.CURRENT_THEME.colors.primary,
    height: Platform.OS == "ios" ? 88: 80,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerPointsContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerPointsText: {
    color: global.CURRENT_THEME.colors.accent,
    fontSize: 18,
    marginLeft: 5
  },
  pollStatusContainer: {
    paddingVertical: '25%'
  },
  announcementButtonContainer: {
    width:82,
    height: 34,
    alignSelf:'center',
  },
  announcementButton: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: global.CURRENT_THEME.roundness,
    borderColor: global.CURRENT_THEME.colors.primary,
    borderWidth: 1
  },
  announcementButtonText: {
    color: global.CURRENT_THEME.colors.primary,
    textAlign: "center",
    fontSize: 16
  },
  inviteBonusDialogText: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "left",
    color: global.CURRENT_THEME.colors.text
  },
  inviteBonusDialogTitle: {
    marginTop: 10,
    fontSize: 20,
    textAlign: "left",
    color: global.CURRENT_THEME.colors.text
  }
});

module.exports= HomeScreen