import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';

import {GlobalStyles} from '../Globals';
import AnnouncementCard from '../components/AnnouncementCard';
import PollStatusCountdown from '../components/PollStatusCountdown';

class MiddleScreen extends Component {

  constructor (props) {
    super(props);
    this.handleStartPressed = this.handleStartPressed.bind(this);
    this.handleRedeemPressed = this.handleRedeemPressed.bind(this);
  }

  handleStartPressed() {
    this.pollStatusCountdown.onPollStatusCountdownHidden();
    this.props.navigation.navigate('Question');
  }

  handleRedeemPressed() {
    // Works on both Android and iOS
    Alert.alert(
      "Attention!",
      "Once you activate this reward, you will have 15 minutes to redeem. You will need to present your student ID.\n\nPress 'Activate' ONLY IF you:\n\n1) Are at Molly Moon's and\n2) Have your student ID",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Activate', onPress: () => this.props.navigation.navigate('Redemption')},
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer}>
          <View style={{paddingBottom:20}}>
            <View style={styles.pollStatusContainer}>
              <PollStatusCountdown ref={(pollStatusCountdown) => {this.pollStatusCountdown=pollStatusCountdown}} onPressStart={this.handleStartPressed}/>
            </View>
            <AnnouncementCard
              titleText="Announcement Title"
              buttonText="Button"
              bodyText="These are the details of the announcement. It's a pretty exciting announcement. Like, really exciting."
              buttonOnPress={ () => this.props.navigation.navigate('Results')}
            />
            <View style={{marginVertical: 10}}/>
            <AnnouncementCard
              titleText="Redeem your free scoop at Molly Moon's!"
              buttonText="Redeem"
              buttonOnPress={this.handleRedeemPressed}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

MiddleScreen.navigationOptions = {
  headerStyle: GlobalStyles.headerStyle
};

const styles = StyleSheet.create({
  pollStatusContainer: {
    marginVertical: 100
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