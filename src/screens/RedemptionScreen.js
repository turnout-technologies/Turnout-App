import React, {Component} from 'react';
import { View, StyleSheet, Text, AppState, Image, Animated, Easing } from 'react-native';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';

const businessColor = "#9ceaec";

const ACTIVATION_DURATION_MINUTES = 15;

class RedemptionScreen extends Component {

	constructor() {
    super();
    this.state = {
      appState: AppState.currentState,
      curTime: null,
      curDate: null,
      timeActivated: moment(),
      curMoment: moment()
    };
    this.expirationTime = moment().add(ACTIVATION_DURATION_MINUTES, 'm');
    this.animatedTranslate = new Animated.Value(0);
    this.animatedColor = new Animated.Value(0);

    this.animateTime = this.animatedTranslate.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [-100, 100, -100]
    });
    this.interpolateColor = this.animatedColor.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [businessColor, "#E6E6FA", businessColor]
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.onRedemptionScreenShown();
    this.updateTime();
    this.animateTranslate();
    this.animateColor();
    this.props.navigation.setParams({
      headerStyle: ({backgroundColor: this.interpolateColor, elevation: 0})
    });
  }

  static navigationOptions = ({navigation}) => {
      return {
        title: 'Redemption',
        headerStyle: {backgroundColor: "rgb(0,0,0,0)", elevation: 0},
        headerTintColor: "black",
        header: null,
      }

  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.onRedemptionScreenHidden();
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.onRedemptionScreenShown();
    } else {
      this.onRedemptionScreenHidden();
    }
    this.setState({appState: nextAppState});
  }

  onRedemptionScreenShown() {
    this.clockCall = setInterval(() => {
      this.updateTime()
    }, 1000);
  }

  onRedemptionScreenHidden() {
    clearInterval(this.clockCall);
  }

  updateTime() {
    var curMoment = moment();
    this.setState({curTime: curMoment.format("h:mm:ss A"), curDate: curMoment.format("M/D/YY"), curMoment});
  }

  animateTranslate() {
    this.animatedTranslate.setValue(0);
    Animated.timing(
        this.animatedTranslate, {
          toValue: 2,
          duration: 5000,
          easing: Easing.linear
        }
    ).start(() => this.animateTranslate())
  }

  animateColor() {
    this.animatedColor.setValue(0);
    Animated.timing(
        this.animatedColor, {
          toValue: 2,
          duration: 4000,
          easing: Easing.linear
        }
    ).start(() => this.animateColor())
  }

	render() {
		return (
      <Animated.View style={{backgroundColor: this.interpolateColor, flex: 1}}>
        <View style={styles.timeboxContainer}>
          <Animated.View style={{transform: [{translateX: this.animateTime}]}}>
            <Text style={[GlobalStyles.titleText, styles.timeboxText]}>{this.state.curTime}</Text>
            <Text style={[GlobalStyles.titleText, styles.timeboxText]}>{this.state.curDate}</Text>
          </Animated.View>
        </View>
        <View style={[GlobalStyles.frontLayerContainer, {marginHorizontal: 10}]}>
          {/*<Text style={[GlobalStyles.bodyText, styles.instructionsText]}>Show this screen and your student ID </Text>*/}
          <View style={styles.detailsContainer}>
            <View style={styles.nameContainer}>
              <Text style={[GlobalStyles.titleText]}>Name</Text>
              <Text style={[GlobalStyles.headerText, styles.nameText]}>Tyler Fox</Text>
            </View>
            <View style={styles.offerContainer}>
              <Image
                style={styles.offerImage}
                source={{uri: "https://www.urbaninfluence.com/images/work/molly/molly-logo.min.jpg"}}
              />
              <Text style={[GlobalStyles.bodyText, styles.offerText]}>1 free scoop</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={[GlobalStyles.titleText]}>Time activated</Text>
              <Text style={[GlobalStyles.bodyText, styles.valueText]}>{this.state.timeActivated.format("h:mm:ss A")}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={[GlobalStyles.titleText]}>Expires in</Text>
              <Text style={[GlobalStyles.bodyText, styles.valueText]}>{moment.duration(this.expirationTime.diff(this.state.curMoment)).humanize()}</Text>
            </View>
          </View>
          {<View style={styles.bottomContainer}>
            <Text style={styles.bottomContainerTitle}>Close</Text>
          </View>}
        </View>
	    </Animated.View>
		);
	}
}

const styles = StyleSheet.create({
  timeboxContainer: {
    height: 100,
    justifyContent: "center",
    paddingBottom: 20,
    marginTop: 40
  },
  timeboxText: {
    color: "black",
    fontSize: 30,
    textAlign: "center"
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    marginHorizontal: 20
  },
  nameContainer: {
    justifyContent: "center",
  },
  labelText: {
    color: "black",
    fontSize: 16,
  },
  nameText: {
    color: "black",
    fontSize: 35,
  },
  valueText: {
    color: "black",
    fontSize: 25,
  },
  instructionsText: {
    color: "black",
    fontSize: 25,
    textAlign: "center"
  },
  offerContainer: {
    justifyContent: "space-evenly",
    //flexDirection: "row",
    alignItems: "center",
    borderColor: businessColor,
    borderWidth: 3,
    borderRadius: global.CURRENT_THEME.roundness,
    padding: 10
  },
  offerText: {
    color: "black",
    fontSize: 30,
    textAlign: "center"
  },
  offerImage: {
    width: 200,
    height: 200,
    borderRadius: 150/2,
    resizeMode: "contain"
  },
  bottomContainer: {
    height: 50,
    justifyContent: 'center',
    borderRadius: global.CURRENT_THEME.roundness,
    borderColor: businessColor,
    borderWidth: 2,
    margin: 30
  },
  bottomContainerTitle: {
    fontFamily: 'circularstd-book',
    color: businessColor,
    fontSize: 25,
    textAlign: 'center',
  }
});

module.exports= RedemptionScreen