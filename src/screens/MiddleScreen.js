import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SplashScreen } from 'expo';
import { Linking } from 'expo';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';
import AnnouncementCard from '../components/AnnouncementCard';
import PollStatusCountdown from '../components/PollStatusCountdown';
import * as API from '../APIClient';

class MiddleScreen extends Component {

  constructor (props) {
    super(props);
    this.handleStartPressed = this.handleStartPressed.bind(this);
    this.fetchLatestResults = this.fetchLatestResults.bind(this);

    this.state = {cardsLoading: true, showResultsCard: false};
  }

  componentDidMount() {
    SplashScreen.hide();
    this.fetchLatestResults();
    this.props.navigation.setParams({
      header: () => (
        <SafeAreaView style={styles.customHeaderContainer} >
          <TouchableOpacity style={styles.headerPointsContainer} onPress={() => Alert.alert("Points", "This is the total number of points you have scored so far. They aren't good for anything besides bragging rights (yet 😅).")}>
            <MaterialCommunityIcons name="ticket" size={25} color={global.CURRENT_THEME.colors.accent} />
            <Text style={[GlobalStyles.bodyText, styles.headerPointsText]}>{global.user.points}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )
    })
  }

  fetchLatestResults() {
    var _this = this;
    API.getLatestBallotResults()
      .then(function(response) {
        _this.resultsResponse = response.data;
        _this.resultsDateStr =  !!response.data ? (moment.unix(response.data.date).tz("America/New_York").format("MMMM Do")) : "";
        _this.setState({cardsLoading: false, showResultsCard: true});
      })
      .catch(function (error) {
        _this.setState({cardsLoading: false});
        console.log(error);
      });
  }

  handleStartPressed() {
    this.pollStatusCountdown.onPollStatusCountdownHidden();
    this.props.navigation.navigate('Question');
  }

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    if (state.params != undefined) {
      return {
        header: navigation.state.params.header
      }
    }
  };

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <StatusBar barStyle="light-content"/>
        <ScrollView style={GlobalStyles.frontLayerContainer}>
          <View style={{paddingBottom:20}}>
            <View style={styles.pollStatusContainer}>
              <PollStatusCountdown ref={(pollStatusCountdown) => {this.pollStatusCountdown=pollStatusCountdown}} onPressStart={this.handleStartPressed}/>
            </View>
            { (this.state.cardsLoading || this.state.showResultsCard) &&
              <AnnouncementCard
                titleText="View Results"
                buttonText="Results"
                bodyText={"Take a look at the results from the " + this.resultsDateStr + " ballot 🗳"}
                buttonOnPress={ () => this.props.navigation.navigate('Results', {resultsResponse: this.resultsResponse, resultsDateStr: this.resultsDateStr})}
                isLoading={this.state.cardsLoading}
              />
            }
            <AnnouncementCard
              titleText="Support Turnout!"
              bodyText="Please chip in if you can to help us reach as many college students as possible in the fall! We appreciate you ♥"
              buttonText="Donate"
              buttonOnPress={ () => Linking.openURL('https://donorbox.org/campus-impact-turnout-2020')}
              isLoading={this.state.cardsLoading}
            />
          </View>
        </ScrollView>
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
    marginVertical: 115
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
  }
});

module.exports= MiddleScreen