import React, {Component} from 'react';
import { View, StyleSheet, Text, AppState, Image, Animated, Easing } from 'react-native';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';

const businessColor = "#9ceaec";

class RedemptionScreen extends Component {

	constructor() {
    super();
    this.state = {
      appState: AppState.currentState,
      curTime: null,
      curDate: null
    };
    this.animatedValue = new Animated.Value(0)
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Redemption',
        headerStyle: {
          backgroundColor: businessColor,
          elevation: 0
        },
        headerTintColor: "black",
      };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.onRedemptionScreenShown();
    this.updateTime();
    this.animate()
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
    this.setState({curTime: curMoment.format("h:mm:ss A"), curDate: curMoment.format("M/D/YY")})
  }

  animate() {
    this.animatedValue.setValue(0);
    Animated.timing(
        this.animatedValue,
        {
            toValue: 2,
            duration: 5000,
            easing: Easing.linear
        }
    ).start(() => this.animate())
}

	render() {
    const animate = this.animatedValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [-100, 100, -100]
    });
		return (
      <View style={[GlobalStyles.backLayerContainer, {backgroundColor: businessColor}]}>
        <View style={[GlobalStyles.frontLayerContainer, {justifyContent: "space-evenly"}]}>
          {/*<Text style={[GlobalStyles.bodyText, styles.instructionsText]}>Show this screen and your student ID </Text>*/}
          <View style={styles.timeboxContainer}>
            <Animated.View style={{transform: [{translateX: animate}]}}>
              <Text style={[GlobalStyles.bodyText, styles.timeboxText]}>{this.state.curTime}</Text>
              <Text style={[GlobalStyles.bodyText, styles.timeboxText]}>{this.state.curDate}</Text>
            </Animated.View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={[GlobalStyles.titleText, styles.nameText]}>Tyler Fox</Text>
          </View>
          <View style={styles.offerContainer}>
            <Image
              style={styles.offerImage}
              source={{uri: "https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/30713783_2022385994455338_1112038930686935040_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_ohc=WZIfc_HvESMAX_rNBxJ&_nc_ht=scontent-sea1-1.xx&oh=520daba652762e98e9584717507ca72c&oe=5EF66C02"}}
            />
            <Text style={[GlobalStyles.bodyText, styles.offerText]}>1 free scoop</Text>
          </View>
        </View>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
  timeboxContainer: {
    backgroundColor: businessColor,
    alignSelf: "center",
    width: 350,
    height: 100,
    borderRadius: 15,
    justifyContent: "center"
  },
  timeboxText: {
    color: "black",
    fontSize: 28,
    textAlign: "center"
  },
  nameContainer: {
    justifyContent: "center"
  },
  nameText: {
    color: "black",
    fontSize: 60,
    textAlign: "center"
  },
  instructionsText: {
    color: "black",
    fontSize: 25,
    textAlign: "center"
  },
  offerContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center"
  },
  offerText: {
    color: "black",
    fontSize: 30,
    textAlign: "center"
  },
  offerImage: {
    width: 125,
    height: 125,
    borderRadius: 125/2
  },
});

module.exports= RedemptionScreen