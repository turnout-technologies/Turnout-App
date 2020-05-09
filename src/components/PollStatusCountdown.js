import React, {Component} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {sprintf} from 'sprintf-js';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';
import {getLastBallotTimestamp} from '../AsyncStorage';
import {setNotificationsEnabled} from '../Notifications';

export default class PollStatusCountdown extends Component {

  static propTypes = {
    onPressStart: PropTypes.func,
    appState:  PropTypes.string,
    onPollStateChanged: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      pollStatusText: "",
      pollsOpen: false,
      ballotSubmittedToday: false,
      getNotifiedDisabled: false,
      gameStarted: false
    };
    this.getNotifiedHandler = this.getNotifiedHandler.bind(this);
  }

  componentDidMount() {
    this.ballotSubmittedListener = DeviceEventEmitter.addListener('ballotSubmittedListener', (e)=>{this.onPollStatusCountdownShown()});
    var _this = this;
    this.onPollStatusCountdownShown();
    setTimeout(function(){_this.onPollStatusCountdownShown()}, 1000);
  }

  componentWillUnmount() {
    this.onPollStatusCountdownHidden();
    this.ballotSubmittedListener.remove();
  }

  componentDidUpdate(oldProps) {
  	const newProps = this.props
  	if(oldProps.appState !== newProps.appState) {
	   if (newProps.appState === 'active') {
	     this.onPollStatusCountdownShown();
	   } else {
	     this.onPollStatusCountdownHidden();
	   }
  	}
  }

  onPollStatusCountdownShown() {
    this.setPollState();
    if (!this.clockCall) {
      this.clockCall = setInterval(() => {
        this.decrementClock();
      }, 1000);
    }
  }

  onPollStatusCountdownHidden() {
    clearInterval(this.clockCall);
    this.clockCall = null;
  }

  setPollState() {
    var pollsOpen = false;
    var curMoment = moment();
    //var curMoment = moment.tz("2020-04-23 18:59:50", "America/New_York");
    this.setState({gameStarted: curMoment > global.GAME_START_DATE});
    var pollsOpenTimeEastern = moment.tz({y:curMoment.year(), M:curMoment.month(), date:curMoment.date(), h:18, m:0}, "America/New_York");
    var pollsCloseTimeEastern = moment.tz({y:curMoment.year(), M:curMoment.month(), date:curMoment.date(), h:22, m:0}, "America/New_York");
    if (curMoment <= pollsOpenTimeEastern) {
      //console.log("POLLS NOT OPEN YET");
      var pollsOpenTimeLocalLabel = pollsOpenTimeEastern.local().format("h A");
      this.setState({timer: pollsOpenTimeEastern.diff(curMoment, 'seconds'), pollStatusText: "Polls open at " + pollsOpenTimeLocalLabel + " in", pollsOpen: false});
    } else if (curMoment > pollsOpenTimeEastern && curMoment < pollsCloseTimeEastern) {
      //console.log("POLLS OPEN!");
      pollsOpen = true;
      var pollsCloseTimeLocalLabel = pollsCloseTimeEastern.local().format("h A");
      this.setState({timer: pollsCloseTimeEastern.diff(curMoment, 'seconds'), pollStatusText: "Polls close at " + pollsCloseTimeLocalLabel + " in", pollsOpen: true});
      getLastBallotTimestamp()
        .then(function(lastBallotTimestampStr) {
          var lastBallotTimestamp = parseFloat(lastBallotTimestampStr);
          this.setState({ballotSubmittedToday: moment.unix(lastBallotTimestamp).tz("America/New_York").isSame(curMoment.tz("America/New_York"), 'day')});
        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
    } else {
      //console.log("POLLS CLOSED FOR THE DAY");
      var pollsOpenTimeLocalLabel = pollsOpenTimeEastern.local().format("h A");
      this.setState({timer: pollsOpenTimeEastern.add(1,'d').diff(curMoment, 'seconds'), pollStatusText: "Polls open tomorrow at " + pollsOpenTimeLocalLabel + " in", pollsOpen: false});
    }
    this.props.onPollStateChanged(pollsOpen);
  }

  decrementClock = () => {
    this.setState((prevstate) => ({ timer: prevstate.timer-1 }), () => {if (this.state.timer <= 0) {this.setPollState()}});
  };

  getTimeLeft = () => {
    const seconds = this.state.timer;
    //console.log(secondsLeft)
    return {
      seconds: Math.floor(seconds % 60),
      minutes: Math.floor(seconds % 3600 / 60),
      hours: Math.floor(seconds % (3600*24) / 3600),
      days: Math.floor(seconds / (3600*24)),
    };
  };

  getNotifiedHandler() {
    this.setState({getNotifiedDisabled: true});
    setNotificationsEnabled(true)
      .then(function(success) {
        this.setState({getNotifiedDisabled: false});
      }.bind(this));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[GlobalStyles.titleText,styles.pollStatusText]}>Thanks For Playing!</Text>
        <MaterialCommunityIcons
          name="hand-peace"
          size={100}
          style={{ alignSelf: "center", marginVertical: 10 }}
          color={global.CURRENT_THEME.colors.primary}
        />
        <Text style={[GlobalStyles.bodyText,styles.pollStatusText]}>Hope this was a fun little thing during finals in lockdown. Don't forget to vote in the next election! 🗳</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  	flex: 1
  },
  pollStatusText: {
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 25
  },
  pollCountdownContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10
  },
  pollCountdownText: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold"
  },
  pollCountdownLabelText: {
    textAlign: "center",
    lineHeight: 15,
    fontSize: 16,
  },
  startButton: {
    width:270,
    height: 68,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },
  startButtonText: {
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "center",
    fontSize: 35
  },
  getNotifiedButton: {
    alignSelf: "center",
    flexDirection: "row"
  },
  getNotifiedButtonText: {
    color: global.CURRENT_THEME.colors.primary,
    fontSize: 18,
    marginLeft: 5
  },
  notifyYouText: {
    color: global.CURRENT_THEME.colors.text,
    fontSize: 18,
    marginLeft: 5
  }
});