import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {sprintf} from 'sprintf-js';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';

export default class PollStatusCountdown extends Component {

  static propTypes = {
    onPressStart: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      pollStatusText: "",
      pollsOpen: false
    };
  }

  componentDidMount() {
    this.setPollState();
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.clockCall);
  }

  setPollState() {
    var curTimeEastern = moment.tz("America/New_York");
    //var curTimeEastern = moment.tz("2020-02-17 18:59:50", "America/New_York");
    var pollsOpenTimeEastern = moment.tz({y:curTimeEastern.year(), M:curTimeEastern.month(), date:curTimeEastern.date(), h:18, m:0}, "America/New_York");
    var pollsCloseTimeEastern = moment.tz({y:curTimeEastern.year(), M:curTimeEastern.month(), date:curTimeEastern.date(), h:22, m:0}, "America/New_York");
    if (curTimeEastern <= pollsOpenTimeEastern) {
      //console.log("POLLS NOT OPEN YET");
      var pollsOpenTimeLocalLabel = pollsOpenTimeEastern.local().format("h A");
      this.setState({timer: pollsOpenTimeEastern.diff(curTimeEastern, 'seconds'), pollStatusText: "Polls open at " + pollsOpenTimeLocalLabel + " in", pollsOpen: false});
    } else if (curTimeEastern > pollsOpenTimeEastern && curTimeEastern < pollsCloseTimeEastern) {
      //console.log("POLLS OPEN!");
      var pollsCloseTimeLocalLabel = pollsCloseTimeEastern.local().format("h A");
      this.setState({timer: pollsCloseTimeEastern.diff(curTimeEastern, 'seconds'), pollStatusText: "Polls close at " + pollsCloseTimeLocalLabel + " in", pollsOpen: true});
    } else {
      //console.log("POLLS CLOSED FOR THE DAY");
      var pollsOpenTimeLocalLabel = pollsOpenTimeEastern.local().format("h A");
      this.setState({timer: pollsOpenTimeEastern.add(1,'d').diff(curTimeEastern, 'seconds'), pollStatusText: "Polls open tomorrow at " + pollsOpenTimeLocalLabel + " in", pollsOpen: false});
    }
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

  render() {
    const { onPressStart } = this.props;
    const {days, hours, minutes, seconds} = this.getTimeLeft();
    //const newTime = sprintf('%02d:%02d:%02d:%02d', days, hours, minutes, seconds);
    const daysText = sprintf('%02d', days);
    const hoursText = sprintf('%02d', hours);
    const minutesText = sprintf('%02d', minutes);
    const secondsText = sprintf('%02d', seconds);
    return (
      <View>
        <Text style={[GlobalStyles.bodyText,styles.pollStatusText]}>{this.state.pollStatusText}</Text>
        <View style={styles.pollCountdownContainer}>
          { days > 0 &&
            <View>
              <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>{daysText}</Text>
              <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText]}>days</Text>
            </View>
          }
          { days > 0 && <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>:</Text>}
          <View>
            <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>{hoursText}</Text>
            <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText]}>hours</Text>
          </View>
          <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>:</Text>
          <View>
            <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>{minutesText}</Text>
            <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText]}>minutes</Text>
          </View>
          <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>:</Text>
          <View>
            <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>{secondsText}</Text>
            <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText]}>seconds</Text>
          </View>
        </View>
        { this.state.pollsOpen &&
          <TouchableOpacity style={styles.startButton} onPress={onPressStart}>
            <Text style={[GlobalStyles.bodyText,styles.startButtonText]}>Start</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pollStatusText: {
    textAlign: "center",
    fontSize: 20,
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
    color: "white",
    textAlign: "center",
    fontSize: 35
  }
});