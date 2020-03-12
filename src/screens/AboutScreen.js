import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight, Image, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'expo';
import Constants from 'expo-constants';

import {GlobalStyles} from '../Globals';


class AboutScreen extends Component {

	constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'About',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      };
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
	        <ScrollView style={GlobalStyles.frontLayerContainer}>
            <View style={styles.container}>
              <Image source={require('../../assets/images/logo_text.png')} style={styles.logo} />
              <View style={[styles.messageContainer, {alignItems:"flex-start"}]}>
                <Text style={[GlobalStyles.bodyText, styles.messageText]}>About Us</Text>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>Turnout is an initiative dedicated to getting more college students to vote and use their collective voice to make the world a better place. </Text>
              </View>
              <View style={styles.messageContainer}>
                <Text style={[GlobalStyles.bodyText, styles.messageText]}>Help support Turnout! </Text>
                <TouchableOpacity style={styles.donateButton} onPress={() => Linking.openURL('https://donorbox.org/campus-impact-turnout-2020')}>
                  <Text style={[GlobalStyles.bodyText,styles.donateButtonText]}>Donate</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.messageContainer}>
                <Text style={[GlobalStyles.bodyText, styles.messageText]}>Check out our website </Text>
                <Text
                  style={[GlobalStyles.bodyText, styles.messageText, {color: global.CURRENT_THEME.colors.primary}]}
                  onPress={() => Linking.openURL('https://turnout.us')}>
                  https://turnout.us
                </Text>
              </View>
              <View style={styles.messageContainer}>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>The app code is public!</Text>
                  <TouchableOpacity style={styles.githubButton} onPress={() => Linking.openURL('https://github.com/turnout-technologies/Turnout-App')}>
                    <Ionicons name="logo-github" size={25} color="grey" />
                    <Text style={[GlobalStyles.bodyText,styles.githubButtonText]}>View on GitHub</Text>
                  </TouchableOpacity>
                <Text style={[GlobalStyles.bodyText, {fontSize: 16}]}>Let us know if you want to help out 🙏 </Text>
              </View>
              <View style={{paddingTop:20}}>
                <View style={styles.aboutSeparator} />
                <Text style={[GlobalStyles.titleText, styles.aboutHeaderText]}>Legal</Text>
                  <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://turnout.us/privacy-policy')}>
                    <View style={styles.aboutItem}>
                      <Text style={[GlobalStyles.bodyText, styles.aboutItemText]}>Privacy Policy</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => this.props.navigation.navigate('Licenses')}>
                    <View style={styles.aboutItem}>
                      <Text style={[GlobalStyles.bodyText, styles.aboutItemText]}>Licenses</Text>
                    </View>
                  </TouchableHighlight>
                <View style={styles.aboutSeparator} />
              </View>
              <Text style={GlobalStyles.bodyText}>App version: {Constants.nativeAppVersion}</Text>
              <Text style={GlobalStyles.bodyText}>Build version: {Constants.nativeBuildVersion}</Text>
              <Text style={GlobalStyles.bodyText}>Copyright {'\u00A9'} 2020 Campus Impact. All Rights Reserved.</Text>
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
    marginVertical: 20
  },
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    height: 50,
  },
  messageText: {
    fontSize: 20,
    paddingBottom: 5
  },
  messageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  donateButton: {
    width:200,
    height: 50,
    justifyContent: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },
  donateButtonText: {
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "center",
    fontSize: 25
  },
  aboutHeaderText: {
    marginLeft: 20,
    fontSize: 16
  },
  aboutSeparator: {
    borderBottomColor: global.CURRENT_THEME.colors.text_opacity3,
    borderBottomWidth: 0.5,
    marginBottom: 10
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
  },
  aboutItemText: {
    fontSize: 18,
    marginLeft: 20,
  },
  githubButton: {
    width:200,
    height: 50,
    justifyContent: "space-evenly",
    borderRadius: global.CURRENT_THEME.roundness,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderColor: "grey",
    borderWidth: 1,
    marginVertical: 5
  },
  githubButtonText: {
    fontFamily: 'circularstd-book',
    color: global.CURRENT_THEME.colors.text,
    textAlign: "center",
    fontSize: 18
  },
});

module.exports= AboutScreen