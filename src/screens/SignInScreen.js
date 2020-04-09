import React, {Component} from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, SafeAreaView, YellowBox, Animated } from 'react-native';
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { SplashScreen } from 'expo';
import { Ionicons } from '@expo/vector-icons';
var moment = require('moment-timezone');

import {GlobalStyles, refreshUser} from '../Globals';
import * as API from '../APIClient';
import StatusBarBackground from '../components/StatusBarBackground';
import {getPushNotificationsTokenAsync} from '../Notifications';
import {setUser, setLastRefreshUserTimestamp, getLastNoteVersionOpened} from '../AsyncStorage';

const REFERRER_IMAGE_SIZE=40;

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = { ...console };
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class SignInScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {user: null, branchInfo: null, bottomContainerOpen: false};

    this.bottomContainerHeightAnimationVal = new Animated.Value(0);

    this.signInAsyncWeb = this.signInAsyncWeb.bind(this);
  }

  componentDidMount() {
    this.checkForBranchLink();
  }

  async checkForBranchLink() {
    if (Constants.appOwnership === 'standalone') {
      const ExpoBranch = await import('expo-branch');
      const Branch = ExpoBranch.default;
      Branch.subscribe(({ error, params }) => {
        if (error) {
          console.log(error);
          Sentry.captureException(error);
          SplashScreen.hide();
        } else {
          console.log(params);
          if (params["+clicked_branch_link"]) {
            this.setState({branchInfo: params}, () => this.onBranchInviteReady());
          } else {
            SplashScreen.hide();
          }
        }
      });
    } else {
      SplashScreen.hide();
    }
  }

  onBranchInviteReady() {
    SplashScreen.hide();
    this.toggleBottomContainer(true, true);
  }

  async advance() {
    this.props.navigation.navigate('Main');
  }

  isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.user.id) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  async onSignIn(googleUser) {
    //console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(async firebaseUser => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken);
        // Sign in with credential from the Google user.
        var firebaseResult = await firebase.auth().signInWithCredential(credential);
        console.log('signed to firebase');
        var pushToken = await getPushNotificationsTokenAsync();
        if (firebaseResult.additionalUserInfo.isNewUser) {
          console.log("NEW USER! Adding to DB...")
          var addUserResponse = await API.addUser({
            firstName: firebaseResult.additionalUserInfo.profile.given_name,
            lastName: firebaseResult.additionalUserInfo.profile.family_name,
            email: firebaseResult.user.email,
            avatarURL: firebaseResult.user.photoURL,
            pushToken: !!pushToken ? pushToken : "",
            referringUserId: (!!this.state.branchInfo && !!this.state.branchInfo.referringUserId) ? this.state.branchInfo.referringUserId : ""
          });
          if (addUserResponse.data) {
            addUserResponse.data.name = addUserResponse.data.firstName + " " + addUserResponse.data.lastName;
            global.user = addUserResponse.data;
            console.log(global.user);
            setUser();
            setLastRefreshUserTimestamp(moment().unix());
            this.advance();
          }
        } else {
          await refreshUser();
          this.advance();
        }
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }

  async signInAsyncWeb() {
    try {
      const result = await Google.logInAsync(Constants.manifest.extra.googleLogInConfig);

      if (result.type === 'success') {
        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
        this.onSignIn(result);
        return result.accessToken;
      } else {
        Sentry.captureException(new Error(result));
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  toggleBottomContainer(open, clickedBranchLink) {
    Animated.timing(this.bottomContainerHeightAnimationVal, {
      toValue: open ? (clickedBranchLink ? 225 : 175) : 0,
      duration: 300
    }).start();
    this.setState({bottomContainerOpen: open});
  }

  render() {
    var clickedBranchLink = this.state.branchInfo ? this.state.branchInfo["+clicked_branch_link"] : false;
    return (
      <View style={styles.container}>
        <StatusBarBackground backgroundColor="white"/>
        <SafeAreaView style={styles.topContainer}>
          <Image source={require('../../assets/images/logo_text.png')} style={styles.logoText} />
          <View style={styles.welcomeContainer}>
            <Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}>It takes a </Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText, {color: global.CURRENT_THEME.colors.primary}]}>friend</Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}> to get a </Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText, {color: "#EE3738"}]}>friend</Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}> to </Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText, {color: global.CURRENT_THEME.colors.primary}]}>vote</Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}>.</Text>
            </Text>
          </View>
        </SafeAreaView>
        {!clickedBranchLink &&
          <View style={styles.noInviteContainer}>
            <Text style={[GlobalStyles.bodyText, styles.signInButtonText]}>If you have an invite link, go click it now on this device to claim your bonus.</Text>
            <TouchableOpacity onPress={() => {this.toggleBottomContainer(true, clickedBranchLink)}}>
              <Text style={[GlobalStyles.bodyText, styles.noInviteButtonText]}>I don't have an invite link</Text>
            </TouchableOpacity>
          </View>
        }
        <Animated.View style={[styles.bottomContainer, {height: this.bottomContainerHeightAnimationVal}]}>
          {!clickedBranchLink &&
            <View style={[styles.bottomContainerTitleContainer, styles.inviteTextContainer]}>
              <TouchableOpacity style={{alignSelf: "center", paddingRight: 10}} onPress={() => {this.toggleBottomContainer(false, clickedBranchLink)}}>
                <Ionicons name="ios-arrow-down" size={25} color={global.CURRENT_THEME.colors.accent} />
              </TouchableOpacity>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>Let's get started.</Text>
            </View>
          }
          {clickedBranchLink &&
            <View style={[styles.bottomContainerTitleContainer, styles.inviteTextContainer]}>
              <View style={styles.inviteTextContainer}>
                <Image
                  style={styles.listItemImage}
                  source={{uri: this.state.branchInfo.referringUserAvatarURL}}
                />
                <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>
                  {" "}{this.state.branchInfo.referringUserName}
                </Text>
              </View>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}> sent </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>you </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>an </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>invite </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>bonus! </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>Join </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>now </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>to </Text>
              <Text style={[GlobalStyles.bodyText, styles.bottomContainerTitle]}>claim.</Text>
            </View>
          }
          <View style={styles.signInButtonContainer}>
            <TouchableOpacity style={[styles.signInButton, {height: this.bottomContainerHeightAnimationVal == 0 ? 0 : 55}]} onPress={this.signInAsyncWeb}>
              <Image source={require('../../assets/images/google_logo.png')} style={styles.signInButtonLogo} />
              <Text style={[GlobalStyles.bodyText, styles.signInButtonText]}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: global.CURRENT_THEME.colors.background
  },
  logoText: {
    alignSelf: "center",
    height: '15%',
    resizeMode: 'contain',
    marginTop: 50
  },
  topContainer: {
    flex:1,
    marginHorizontal: 20,
    marginBottom: 225,
  },
  bottomContainer: {
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderTopLeftRadius: global.CURRENT_THEME.roundness,
    borderTopRightRadius: global.CURRENT_THEME.roundness,
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  bottomContainerTitleContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  bottomContainerTitle: {
    color: global.CURRENT_THEME.colors.accent,
    fontSize: 30,
    paddingTop: 20,
    lineHeight: 15
  },
  signInButtonContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 35,
    minHeight: 75
  },
  signInButton: {
    width:275,
    justifyContent: "space-evenly",
    backgroundColor: global.CURRENT_THEME.colors.accent,
    borderRadius: global.CURRENT_THEME.roundness,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal:20,
  },
  signInButtonText: {
    color: global.CURRENT_THEME.colors.text,
    textAlign: "center",
    fontSize: 18
  },
  signInButtonLogo: {
    height: '45%',
    resizeMode: 'contain',
  },
  welcomeContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    color: global.CURRENT_THEME.colors.text,
    textAlign: "center",
    fontSize: 50
  },
  listItemImage: {
    alignSelf: "center",
    width: REFERRER_IMAGE_SIZE,
    height: REFERRER_IMAGE_SIZE,
    borderRadius: REFERRER_IMAGE_SIZE/2,
  },
  inviteTextContainer: {
    flexDirection:'row',
    flexWrap:'wrap'
  },
  noInviteContainer: {
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 75,
    marginHorizontal: 20
  },
  noInviteButtonText: {
    fontSize: 22,
    color: global.CURRENT_THEME.colors.primary,
    marginTop: 10
  }
});

module.exports= SignInScreen