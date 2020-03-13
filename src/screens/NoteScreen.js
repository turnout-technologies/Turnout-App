import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight, Image, TouchableOpacity, StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'expo';
import Constants from 'expo-constants';
import { SplashScreen } from 'expo';

import {GlobalStyles} from '../Globals';
import {setLastNoteVersionOpened} from '../AsyncStorage';

class NoteScreen extends Component {

	constructor(props) {
    super(props);

    this.doneButtonHandler = this.doneButtonHandler.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  doneButtonHandler() {
    setLastNoteVersionOpened(Constants.manifest.extra.noteVersion);
    this.props.navigation.navigate('Main');
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
          <StatusBar barStyle="light-content"/>
	        <ScrollView style={[GlobalStyles.frontLayerContainer, {marginTop: Platform.OS == "ios" ? 88: 80,}]}>
            <View style={styles.container}>
              <Image source={require('../../assets/images/logo_icon.png')} style={styles.logo} />
              <View style={[styles.messageContainer, {alignItems:"flex-start"}]}>
                <Text style={[GlobalStyles.headerText, styles.messageText]}>Hey {global.user.name.split(" ")[0]},</Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  Welcome to the Turnout closed alpha and thank you for helping out! In case you're one of those people that doesn't read, here's the short version (but you really should read. It's a good message): {"\n"}
                </Text>
                <Text style={[GlobalStyles.headerText, {fontSize: 20, color: global.CURRENT_THEME.colors.primary}]}>the tl;dr</Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 18}]}>
                  1) Purpose: Help test basic functionality for serving/answering/scoring questions.{"\n"}
                  2) Your job #1: Play the game! Answer questions, earn points, and climb the leaderboard. {"\n"}
                  3) Your job #2: Give feedback! Bugs, ideas, question suggestions, etc. are all welcome. Submit feedback from the 'Profile' tab in the bottom right. {"\n"}
                </Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  Ok and here's the full message 🙌 {"\n"}
                </Text>
                <Text style={[GlobalStyles.headerText]}>The Mission</Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  As you probably already know, our goal is to help get college students civically engaged by fostering an on-campus community of voters.
                  Turnout is centered on our belief that it takes a friend to get a friend to vote. Instead of going the traditional route and creating a
                  voter 'facilitation' tool, we are creating a game that requires students to register with TurboVote and then incentivizes them to get their
                  friends to sign up. {"\n"}
                </Text>
                <Text style={[GlobalStyles.headerText]}>The Game</Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  Turnout is a trivia-style game where the most popular answer is the correct one.
                  Answer the daily questions and earn points for being in the majority and for referring friends to ascend to the top of the leaderboard.
                  For the 'real thing,' we will be incorporating rewards/events that can be unlocked by acrruing points. {"\n"}
                </Text>
                <Text style={[GlobalStyles.headerText, {fontSize: 18}]}>The Alpha{"\n"}(i.e. the part where you come in!)</Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  We are doing this early 'closed alpha' with friends and family as a very basic test to make sure our basic infrastructure works.
                  We want to make sure we can post daily questions, you can vote on them, and then we can tally the votes, distribute points, post the results, and then display rankings on the leaderboard.
                  A number of things are missing at this point such as the actual TurboVote integration (kinda important), the referral and rewards system, etc. Like we said, this is just to test the basic system for now. {"\n\n"}

                  Here's how it will work: {"\n\n"}
                  1) Polls will open at 6PM EST, meaining the daily quesitons will go live and, and stay open until 10PM EST. {"\n"}
                  2) During that time, vote on the daily questions and submit your ballot. It's up to you whether you answer truthfully, try to throw things off and cause chaos, or try to predict the most popular answer to rack up points and chase that spot on the leaderboard podium.  {"\n"}
                  3) After polls close, we will tally the results and distribute points. {"\n"}
                  4) Once results are available, you can view the vote breakdown of each question, see how many points you earned, then go check out the updates on the leaderboard. {"\n\n"}

                  Finally, please send feedback!! Whether you found a bug, have an idea, want to suggest a question, or just want to say that you like/don't like something, we want to know!
                  There are several options for sending us feedback on the 'Profile' tab in the bottom right. {"\n"}

                </Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  Thanks again for helping us test and turn this into an actual thing. We appreciate all of you. ♥🙏 {"\n\n"}
                  - Tyler and Jason
                </Text>
              </View>
              <View style={styles.messageContainer}>
                <TouchableOpacity style={styles.doneButton} onPress={this.doneButtonHandler}>
                  <Text style={[GlobalStyles.bodyText,styles.doneButtonText]}>I read the message.{"\n"}It was good. 🔥</Text>
                </TouchableOpacity>
              </View>
            </View>
	        </ScrollView>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 40
  },
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    height: 50,
  },
  messageText: {
    fontSize: 30,
    paddingBottom: 5
  },
  messageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  doneButton: {
    alignSelf: 'center',
    minWidth: 325,
    padding:10,
    justifyContent: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },
  doneButtonText: {
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "center",
    fontSize: 25
  }
});

module.exports= NoteScreen