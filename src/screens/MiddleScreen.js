import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';
import AnnouncementCard from '../components/AnnouncementCard';
import PollStatusCountdown from '../components/PollStatusCountdown';

class MiddleScreen extends Component {

  constructor (props) {
    super(props);
    this.handleStartPressed = this.handleStartPressed.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      header: (
        <View style={styles.customHeaderContainer} >
          <TouchableOpacity style={styles.headerPointsContainer} onPress={() => Alert.alert("Points", "This is the total number of points you have scored so far. They aren't good for anything besides bragging rights (yet 😅).")}>
            <MaterialCommunityIcons name="ticket" size={25} color={global.CURRENT_THEME.colors.accent} />
            <Text style={[GlobalStyles.bodyText, styles.headerPointsText]}>{global.user.points}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  handleStartPressed() {
    this.pollStatusCountdown.onPollStatusCountdownHidden();
    this.props.navigation.navigate('Question');
  }

  static navigationOptions = ({navigation}) => {
    //  headerStyle: GlobalStyles.headerStyle,
    const {state} = navigation;
    if (state.params != undefined){
      return {
        header: navigation.state.params.header
      }
    }
  };

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer}>
          <View style={{paddingBottom:20}}>
            <View style={styles.pollStatusContainer}>
              <PollStatusCountdown ref={(pollStatusCountdown) => {this.pollStatusCountdown=pollStatusCountdown}} onPressStart={this.handleStartPressed}/>
            </View>
            <AnnouncementCard
              titleText="View results"
              buttonText="Results"
              bodyText="Take a look at the results from the most recent ballot"
              buttonOnPress={ () => this.props.navigation.navigate('Results')}
            />
            <View style={{marginVertical: 10}}/>
            <AnnouncementCard
              titleText="Have thoughts?"
              bodyText="Let us know what's on your mind"
              buttonText="Send feedback"
              buttonOnPress={ () => this.props.navigation.navigate('Feedback', {type: "suggestion"})}
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
    marginTop: Platform.OS == "ios" ? 20 : 0,
    height: 80,
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
    marginVertical: 75
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