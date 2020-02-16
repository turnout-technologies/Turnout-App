import React, {Component} from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import {GlobalStyles} from '../Globals';
import AnnouncementCard from '../components/AnnouncementCard';

class MiddleScreen extends Component {

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer}>
          <View style={{paddingBottom:20}}>
            <View style={styles.pollStatusContainer}>
              <Text style={[GlobalStyles.bodyText,styles.pollStatusText]}>Polls close in</Text>
              <Text style={[GlobalStyles.headerText,styles.pollCountdownText]}>01:37:34</Text>
              <TouchableOpacity style={styles.startButton} onPress = { () => this.props.navigation.navigate('Question')}>
                <Text style={[GlobalStyles.bodyText,styles.startButtonText]}>Start</Text>
              </TouchableOpacity>
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

  pollStatusText: {
    textAlign: "center",
    fontSize: 20,
  },

  pollCountdownText: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold"
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