import React, {Component} from 'react';
import { View, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {sprintf} from 'sprintf-js';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';

export default class Countdown extends Component {

  static propTypes = {
    appState:  PropTypes.string,
    endTime: PropTypes.number,
    onTimerExpired: PropTypes.func,
    color: PropTypes.string,
    appState:  PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
    };
  }

  componentDidMount() {
    var _this = this;
    this.onCountdownShown();
    setTimeout(function(){_this.onCountdownShown()}, 1000);
  }

  componentWillUnmount() {
    this.onCountdownHidden();
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props
    if(oldProps.appState !== newProps.appState) {
     if (newProps.appState === 'active') {
       this.onCountdownShown();
     } else {
       this.onCountdownHidden();
     }
    }
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.appState !== newProps.appState) {
      if (newProps.appState === 'active') {
        this.onCountdownShown();
      } else {
	     this.onCountdownHidden();
      }
  	}
  }

  onCountdownShown() {
    this.setEndTime();
    if (!this.clockCall) {
      this.clockCall = setInterval(() => {
        this.decrementClock();
      }, 1000);
    }
  }

  onCountdownHidden() {
    clearInterval(this.clockCall);
    this.clockCall = null;
  }

  setEndTime() {
    var curMoment = moment();
    //var curMoment = moment.tz("2020-03-18 18:59:50", "America/New_York");
    this.setState({timer: moment.unix(this.props.endTime).diff(curMoment, 'seconds')});
  }

  decrementClock = () => {
    this.setState((prevstate) => ({ timer: prevstate.timer-1 }), () => {if (this.state.timer == 0) {this.onTimerExpired()}});
  };

  getTimeLeft = () => {
    const seconds = this.state.timer;
    return {
      seconds: Math.floor(seconds % 60),
      minutes: Math.floor(seconds % 3600 / 60),
      hours: Math.floor(seconds % (3600*24) / 3600),
      days: Math.floor(seconds / (3600*24)),
    };
  };

  onTimerExpired() {
    console.log("EXPIRE0");
    this.onCountdownHidden();
    this.props.onTimerExpired();
  }

  render() {
    const {color} = this.props
    const {days, hours, minutes, seconds} = this.getTimeLeft();
    const daysText = sprintf('%02d', days);
    const hoursText = sprintf('%02d', hours);
    const minutesText = sprintf('%02d', minutes);
    const secondsText = sprintf('%02d', seconds);
    return (
      <View style={styles.pollCountdownContainer}>
        { days > 0 &&
          <View>
            <Text style={[GlobalStyles.headerText,styles.pollCountdownText, {color: color}]}>{daysText}</Text>
            <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText, {color: color}]}>days</Text>
          </View>
        }
        { days > 0 && <Text style={[GlobalStyles.headerText,styles.pollCountdownText, {color: color}]}>:</Text>}
        <View>
          <Text style={[GlobalStyles.headerText,styles.pollCountdownText, {color: color}]}>{hoursText}</Text>
          <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText, {color: color}]}>hours</Text>
        </View>
        <Text style={[GlobalStyles.headerText,styles.pollCountdownText, {color: color}]}>:</Text>
        <View>
          <Text style={[GlobalStyles.headerText,styles.pollCountdownText, {color: color}]}>{minutesText}</Text>
          <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText, {color: color}]}>minutes</Text>
        </View>
        <Text style={[GlobalStyles.headerText,styles.pollCountdownText, {color: color}]}>:</Text>
        <View>
          <Text style={[GlobalStyles.headerText,styles.pollCountdownText, {color: color}]}>{secondsText}</Text>
          <Text style={[GlobalStyles.bodyText,styles.pollCountdownLabelText, {color: color}]}>seconds</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});