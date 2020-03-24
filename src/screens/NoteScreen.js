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

  static navigationOptions = ({navigation}) => {
    return {
        title: 'An Announcement',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      };
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
                  Thanks so much for helping us test out Turnout over the past week! We really appreciate every vote, every bug filed, every piece of feedback submitted, and every donation. {"\n\n"}
                  We are closing the alpha for a bit while we incorporate feedback and continue developing. {"\n"}
                </Text>
                <Text style={[GlobalStyles.headerText, {fontSize: 20, color: global.CURRENT_THEME.colors.primary}]}>What do I do now?</Text>
                <Text>
                  <Text style={[GlobalStyles.bodyText, {fontSize: 18, color: "red"}]}>Please leave the app installed! </Text>
                  <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                    We still have a lot of work to do and will ask you to test new things every so often (e.g. when we finish something new like the TurboVote flow or if we make a risky change).
                    By leaving the app installed, we'll be able to send out a push notification when there's something ready for you to test. {"\n"}
                  </Text>
                </Text>
                <Text style={[GlobalStyles.headerText, {fontSize: 20, color: global.CURRENT_THEME.colors.primary}]}>What's next for Turnout?</Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  Our plan was to next roll out a full beta test (with TurboVote and rewards) at Brown as a test campus in April.
                  However, obviously the coronavirus has affected our plans just a little bit, so we've had to regroup.
                  We still plan to use Brown as a test in April, but we are revising our strategy to be online-only and not require any presence on campus
                  (this means swapping local businesses out for a food delivery service and switching our marketing strategy to digital only). {"\n"}
                </Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>
                  Once again, thanks for being a part of Turnout. We appreciate all of you and will be in touch soon. ♥🙏🔥💯etc. {"\n\n"}
                  - Tyler and Jason
                  {"\n"}
                </Text>
                <Text>
                  <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>P.S. In the meantime, feel free to still send us feedback if you have thoughts or ideas: </Text>
                  <Text
                    style={[GlobalStyles.bodyText, styles.emailUsText, {color: global.CURRENT_THEME.colors.primary}]}
                    onPress={() => Linking.openURL('mailto: contact@turnout.us?subject=[App Feedback]')}>
                    contact@turnout.us
                  </Text>
                </Text>
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
  },
  emailUsText: {
    fontSize: 18
  },
});

module.exports= NoteScreen