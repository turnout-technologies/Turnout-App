import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';

import {GlobalStyles, getUser} from '../Globals';
import AnnouncementCard from '../components/AnnouncementCard';
import PollStatusCountdown from '../components/PollStatusCountdown';

class MiddleScreen extends Component {

  constructor (props) {
    super(props);
    this.handleStartPressed = this.handleStartPressed.bind(this);
  }

  handleStartPressed() {
    this.pollStatusCountdown.onPollStatusCountdownHidden();
    this.props.navigation.navigate('Question');
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
              buttonOnPress={ () => Alert.alert('Announcment Button pressed')}
            />
            <View style={{marginVertical: 10}}/>
            <AnnouncementCard
              titleText="Earn faster by inviting friends"
              buttonText="Invite"
              buttonOnPress={ () => Alert.alert('Invite Button pressed')}
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