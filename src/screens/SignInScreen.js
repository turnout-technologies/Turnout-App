import React, {Component} from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, SafeAreaView, YellowBox, Animated, AppState, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { SplashScreen } from 'expo';
import { Ionicons } from '@expo/vector-icons';
var moment = require('moment-timezone');

import {GlobalStyles, refreshUser} from '../Globals';
import * as API from '../APIClient';
import * as Env from '../Environment';
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
    this.state = {
      user: null,
      branchInfo: null,
      bottomContainerOpen: false,
      signInLoading: false,
      appState: AppState.currentState
    };

    this.bottomContainerHeightAnimationVal = new Animated.Value(0);

    this.signInAsyncWeb = this.signInAsyncWeb.bind(this);
  }

  componentDidMount() {
    this.checkForBranchLink();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.checkForBranchLink();
    }
    this.setState({appState: nextAppState});
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
        try {
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
              this.props.navigation.navigate('TurboVote', this.getInviteInfo());
            }
          } else {
            await refreshUser();
            this.props.navigation.navigate('Main');
          }
        } catch (error) {
          this.setState({signInLoading: false});
          Alert.alert("Error Signing In", "Couldn't sign you in. Please try again.");
          console.log(error);
        }
      } else {
        this.setState({signInLoading: false});
        console.log('User already signed-in Firebase.');
      }
    });
  }

checkForValidDomain(email) {
  const domain = email.split("@")[1];
  console.log(domain);
  return domain === "brown.edu" || domain === "alumni.brown.edu";
}

async signInAsyncWeb() {
    this.setState({signInLoading: true});
    try {
      const result = await Google.logInAsync(Constants.manifest.extra.googleLogInConfig);
      if (!Env.isDevEnv() && !this.checkForValidDomain(result.user.email)) {
        Alert.alert("Invalid Account", "Turnout is currently only available at Brown University. If you're a Brown student, make sure to choose your Brown email!");
        this.setState({signInLoading: false});
        return;
      }
      if (result.type === 'success') {
        this.onSignIn(result);
      } else {
        Sentry.captureException(new Error(result));
      }
    } catch ({ message }) {
      this.setState({signInLoading: false});
      console.log('login: Error:' + message);
    }
  };

  toggleBottomContainer(open, clickedBranchLink) {
    Animated.timing(this.bottomContainerHeightAnimationVal, {
      toValue: open ? (clickedBranchLink ? 225 : 175) : 0,
      duration: 300
    }).start();
    this.setState({bottomContainerOpen: open});
  }

  getInviteInfo() {
    const hasInvite = this.state.branchInfo ? this.state.branchInfo["+clicked_branch_link"] : false;
    if (hasInvite) {
      return {
        hasInvite,
        //referringUserAvatarURL: this.state.branchInfo.referringUserAvatarURL,
        referringUserName: this.state.branchInfo.referringUserName
      };
    } else {
      //no invite so return null
      return {hasInvite};
    }
  }

  render() {
    var clickedBranchLink = this.state.branchInfo ? this.state.branchInfo["+clicked_branch_link"] : false;
    return (
      <View style={styles.container}>
        <StatusBarBackground backgroundColor="white"/>
        <SafeAreaView style={styles.topContainer}>
          { Env.isDevEnv() &&
            <TouchableOpacity style={styles.debugButton} onPress={() => this.props.navigation.navigate('DebugOptions', {previousScreen: this.props.navigation.state.routeName})}>
              <Ionicons name="md-bug" size={25} color={global.LOGO_BLUE} />
            </TouchableOpacity>
          }
          <Image source={require('../../assets/images/logo_text.png')} style={styles.logoText} />
          <View style={styles.welcomeContainer}>
            <Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}>It takes a </Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText, {color: global.LOGO_BLUE}]}>friend</Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}> to get a </Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText, {color: "#EE3738"}]}>friend</Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}> to </Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText, {color: global.LOGO_BLUE}]}>vote</Text>
              <Text style={[GlobalStyles.titleText, styles.welcomeText]}>.</Text>
            </Text>
          </View>
        </SafeAreaView>
        {!clickedBranchLink && !this.state.bottomContainerOpen &&
          <View style={styles.noInviteContainer}>
            <Text style={[GlobalStyles.bodyText, styles.signInButtonText]}>If you have an invite link, go click it now on this device to claim your bonus.</Text>
            <TouchableOpacity onPress={() => {this.toggleBottomContainer(true, clickedBranchLink)}}>
              <Text style={[GlobalStyles.bodyText, styles.noInviteButtonText]}>I don't have an invite link</Text>
            </TouchableOpacity>
          </View>
        }
        <Animated.ScrollView style={[styles.bottomContainer, {height: this.bottomContainerHeightAnimationVal}]}>
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
            { !this.state.signInLoading &&
              <TouchableOpacity style={[styles.signInButton, {height: this.bottomContainerHeightAnimationVal == 0 ? 0 : 55}]} onPress={this.signInAsyncWeb}>
                <Image source={require('../../assets/images/google_logo.png')} style={styles.signInButtonLogo} />
                <Text style={[GlobalStyles.bodyText, styles.signInButtonText]}>Sign in with Google</Text>
              </TouchableOpacity>
            }
            { this.state.signInLoading &&
              <View style={[styles.signInButton, {height: this.bottomContainerHeightAnimationVal == 0 ? 0 : 55}]}>
                <ActivityIndicator size={35} color={global.CURRENT_THEME.colors.primary}/>
              </View>
            }
          </View>
        </Animated.ScrollView>
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
    backgroundColor: global.LOGO_BLUE,
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
    color: global.LOGO_BLUE,
    marginTop: 10
  },
  debugButton: {
    position: "absolute",
    top: 15,
    right: 5
  }
});

module.exports= SignInScreen