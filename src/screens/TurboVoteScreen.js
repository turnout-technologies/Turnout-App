import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as API from '../APIClient';

import {GlobalStyles} from '../Globals';

class TurboVoteScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {isLoading: true, finishedVisible: false};
    this.doneButtonHandler = this.doneButtonHandler.bind(this);

    this.initConstants();
    this.setInjectedJS();
  }

  componentDidMount() {
    Alert.alert(
      "Welcome To TurboVote!",
      "Sign up here first to start playing Turnout! TurboVote helps you register, request absentee ballots, and get reminders about registration deadlines, upcoming elections, and where to vote.",
      [
        {text: "Let's do it"}
      ]
    )
  }

  initConstants() {
    const isStandalone = Constants.appOwnership === 'standalone';
    //only use the referral parameter in standalone so we don't spam it during development
    this.turboVoteURL = "https://turbovote.org/" + (isStandalone ? "?r=TurnoutApp" : "");
    this.firstName = isStandalone ? global.user.firstName : "first";
    this.lastName = isStandalone ? global.user.lastName : "last";
    this.email = isStandalone ? global.user.email : "hey@domain.com";
    this.currentURL = this.turboVoteURL;
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'TurboVote',
      headerStyle: GlobalStyles.headerStyle,
      headerTintColor: global.CURRENT_THEME.colors.accent,
    };
  }

  setInjectedJS() {
    this.INJECTED_JS = `
      //CONSTANTS
      var DELAY_MS = 200; //200 seems to work well
      var AUTO_ADVANCE = false;

      //DATA
      var firstName = '${this.firstName}';
      var lastName = '${this.lastName}';
      var mobileNumber = '';
      var email = '${this.email}';
      var street = '';
      var street2 = '';
      var city = '';
      var state = '';
      var zip = '';
      var party = '';
      var dobMonth = '';
      var dobDay = '';
      var dobYear = '';

      /*var registrationStatus = 'yes' //yes or no. String in case we want to add 'cantvote'
      var street = '100 test';
      var street2 = 'apt. 100';
      var city = 'testcity';
      var state = 'MI';
      var zip = '48933';
      var hasMoved = false;
      var party = 'democratic';
      var isAbsentee = true;
      var dobMonth = '04';
      var dobDay = '01';
      var dobYear = '1980';*/

      //UTIL FUNCTIONS

      function haveAllElements(elementsObject) {
        const values = Object.values(elementsObject);
        for (const val of values) {
          if (!val || (HTMLCollection.prototype.isPrototypeOf(val) && val.length == 0)) {
            return false
          }
        }
        return true;
      }

      async function pollWithRetry(getElementsFunc) {
        var elementsObject = getElementsFunc();
        while (!haveAllElements(elementsObject)) {
          await wait(1000);
          elementsObject = getElementsFunc();
        }
        return elementsObject;
      }

      function wait(ms) {
        return new Promise(resolve => {
          console.log('waiting '+ms+' ms...');
          setTimeout(resolve, ms);
        });
      }

      const changeValue = (element, value) => {
        const event = new Event('input', { bubbles: true });
        element.value = value;
        element.dispatchEvent(event);
      }
      const selectValue = (element, value) => {
        const event = new Event('change', { bubbles: true });
        element.value = value;
        element.dispatchEvent(event);
      }

      (function() {
        function wrap(fn) {
          return function wrapper() {
            var res = fn.apply(this, arguments);
            window.ReactNativeWebView.postMessage(window.location.href);
            setTimeout(function(){ onNextPage(); }, DELAY_MS);
            return res;
          }
        }
        history.pushState = wrap(history.pushState);
        history.replaceState = wrap(history.replaceState);
        window.addEventListener('popstate', function() {
          window.ReactNativeWebView.postMessage(window.location.href);
        });
      })();

      //ELEMENT GETTERS
      function getContinueButton() {
        return {
          continueButton: document.getElementById('continuebutton')
        }
      }

      function getNameElements() {
        return {
          firstnameInput: document.getElementById('firstname'),
          lastnameInput: document.getElementById('lastname')
        }
      }

      function getCommunicationPrefElements() {
        return {
          mobileNumberInput: document.getElementById('mobile-number'),
          emailInput: document.getElementById('email'),
          smsCheckbox: document.getElementById('sms-message-pref'),
          emailCheckbox: document.getElementById('email-pref')
        }
      }

      function getAreYouRegisteredToVoteElements() {
        return {
          yesButtonArr: document.getElementsByClassName('yes-button'),
          noButtonArr: document.getElementsByClassName('no-button'),
          cantvoteButtonArr: document.getElementsByClassName('cant-vote-button')
        }
      }

      function getAddressElements() {
        return {
          streetInput: document.getElementById('street'),
          street2Input: document.getElementById('street-2'),
          cityInput: document.getElementById('city'),
          stateSelect: document.getElementById('state'),
          zipInput: document.getElementById('zip')
        }
      }

      function getHaveYouMovedElements() {
        return {
          yesButtonArr: document.getElementsByClassName('yes-button'),
          noButtonArr: document.getElementsByClassName('no-button')
        }
      }

      function getPartySelectionElements() {
        return {
          partySelect: document.getElementById('party')
        }
      }

      function getVotingMethodsElements() {
        return {
          bymailButtonArr: document.getElementsByClassName('by-mail-button'),
          inpersonButtonArr: document.getElementsByClassName('in-person-button')
        }
      }

      function getDobElements() {
        let dobDivChildrenArr = document.getElementsByClassName('input-row date-row')[0].children;
        return {
          dobMonthInput: dobDivChildrenArr[0],
          dobDayInput: dobDivChildrenArr[2],
          dobYearInput: dobDivChildrenArr[4]
        }
      }

      //MAIN HANDLER
      function onNextPage() {
        switch(window.location.pathname) {

          case '/':
            if (AUTO_ADVANCE) {
              pollWithRetry(getContinueButton).then(function(elementsObject){
                const {continueButton} = elementsObject;
                continueButton.click();
              });
            }
            break;

          case '/name':
            pollWithRetry(getNameElements).then(function(elementsObject){
              const {firstnameInput, lastnameInput} = elementsObject;
              changeValue(firstnameInput, firstName);
              changeValue(lastnameInput, lastName);
              if (AUTO_ADVANCE) {
                setTimeout(function(){
                  pollWithRetry(getContinueButton).then(function(elementsObject){
                    const {continueButton} = elementsObject;
                    continueButton.click();
                  });
                }, DELAY_MS);
              }
            });
            break;

          case '/communication-pref':
            pollWithRetry(getCommunicationPrefElements).then(function(elementsObject){
              const {mobileNumberInput, emailInput, smsCheckbox, emailCheckbox} = elementsObject;
              mobileNumberInput.setAttribute("inputmode", "tel");
              if (mobileNumber) {
                smsCheckbox.click();
                changeValue(mobileNumberInput, mobileNumber);
              }
              if (email) {
                emailCheckbox.click();
                changeValue(emailInput, email);
              }
              if (AUTO_ADVANCE) {
                setTimeout(function(){
                  pollWithRetry(getContinueButton).then(function(elementsObject){
                    const {continueButton} = elementsObject;
                    continueButton.click();
                  });
                }, DELAY_MS);
              }
            });
            break;

          case '/are-you-registered-to-vote':
            if (AUTO_ADVANCE) {
              pollWithRetry(getAreYouRegisteredToVoteElements).then(function(elementsObject){
                const {yesButtonArr, noButtonArr, cantvoteButtonArr} = elementsObject;
                switch(registrationStatus) {
                  case 'yes':
                    var button = yesButtonArr[0];
                    break;
                  case 'no':
                    var button = noButtonArr[0];
                    break;
                  case 'cantvote':
                    var button = cantvoteButtonArr[0];
                    break;
                }
                button.click();
              });
            }
            break;

          case '/where-do-you-want-to-register':
          case '/where-are-you-registered':
          case '/mailing-address':
            pollWithRetry(getAddressElements).then(function(elementsObject){
              const {streetInput, street2Input, cityInput, stateSelect, zipInput} = elementsObject;
              zipInput.setAttribute("inputmode", "numeric");
              changeValue(streetInput, street);
              changeValue(street2Input, street2);
              changeValue(cityInput, city);
              selectValue(stateSelect, state);
              changeValue(zipInput, zip);
              if (AUTO_ADVANCE) {
                setTimeout(function(){
                  pollWithRetry(getContinueButton).then(function(elementsObject){
                    const {continueButton} = elementsObject;
                    continueButton.click();
                  });
                }, DELAY_MS);
              }
            });
            break;

          case '/have-you-moved':
            if (AUTO_ADVANCE) {
              pollWithRetry(getHaveYouMovedElements).then(function(elementsObject){
                const {yesButtonArr, noButtonArr} = elementsObject;
                var button = hasMoved ? yesButtonArr[0] : noButtonArr[0];
                button.click();
              });
            }
            break;

          case '/party-selection':
            pollWithRetry(getPartySelectionElements).then(function(elementsObject){
              const {partySelect} = elementsObject;
              if (!!party) {
                selectValue(partySelect, party);
              }
              if (AUTO_ADVANCE) {
                setTimeout(function(){
                  pollWithRetry(getContinueButton).then(function(elementsObject){
                    const {continueButton} = elementsObject;
                    continueButton.click();
                  });
                }, DELAY_MS);
              }
            });
            break;

          case '/voting-methods':
            if (AUTO_ADVANCE) {
              pollWithRetry(getVotingMethodsElements).then(function(elementsObject){
                const {bymailButtonArr, inpersonButtonArr} = elementsObject;
                //alert(bymailButtonArr.length);
                var button = isAbsentee ? bymailButtonArr[0] : inpersonButtonArr[0];
                button.click();
              });
            }
            break;

          case '/dob':
            pollWithRetry(getDobElements).then(function(elementsObject){
                const {dobMonthInput, dobDayInput, dobYearInput} = elementsObject;
                dobMonthInput.setAttribute("inputmode", "numeric");
                dobDayInput.setAttribute("inputmode", "numeric");
                dobYearInput.setAttribute("inputmode", "numeric");
                changeValue(dobMonthInput, dobMonth);
                changeValue(dobDayInput, dobDay);
                changeValue(dobYearInput, dobYear);
                //changeValue(lastnameInput, lastName);
                if (AUTO_ADVANCE) {
                  setTimeout(function(){
                    pollWithRetry(getContinueButton).then(function(elementsObject){
                      const {continueButton} = elementsObject;
                      continueButton.click();
                    });
                  }, DELAY_MS);
                }
              });
            break;

          case '/done':
            window.onscroll=function(){
              if (window.scrollY > 25) {
                window.ReactNativeWebView.postMessage('show_finished_button');
              }
            };
            break;
        }
      }

      onNextPage();

      true;
    `
  }

  handleWebViewNavigationStateChange(newNavState) {
    console.log(newNavState);
  }

  completeTurboVote() {
    API.turbovoteComplete();
    this.props.navigation.navigate('Home', this.props.navigation.state.params);
  }

  doneButtonHandler() {
    Alert.alert(
      "TuroVote Signup Complete!",
      "Did you read the info on this last page so you know what comes next? There's some important stuff here.",
      [
        {text: "Oops, I'll go read that real quick", style: "cancel"},
        {text: "I read it and know what to do", onPress: () => this.completeTurboVote()}
      ],
      { cancelable: false }
    );
  }

  async openExternalBrowser(url) {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      if (error.message == 'Another WebBrowser is already being presented.') {
        await WebBrowser.dismissBrowser();
        WebBrowser.openBrowserAsync(url);
      }
    }
  }

  loadInExternalBrowser(url) {
    if (this.currentURL.includes("turbovote.org/registration-methods")) {
      Alert.alert(
        "Online Voter Registration",
        "After you register to vote on your state's site, return to the Turnout app to finish signing up!",
        [
          {text: "Got it", onPress: () => this.openExternalBrowser(url)}
        ],
        { cancelable: false }
      );
    } else {
      this.openExternalBrowser(url);
    }
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
      <StatusBar barStyle="light-content"/>
        <View style={[GlobalStyles.frontLayerContainer, {overflow: 'hidden'}]}>
          { this.state.isLoading &&
            <ActivityIndicator
              style={styles.loadingSpinner}
              size="large"
            />
          }
          <WebView
            ref={ (ref) => { this.webview = ref; } }
            onLoad={() => this.setState({ isLoading: false })}
            style={styles.webview}
            showsVerticalScrollIndicator={false}
            source={{ uri: this.turboVoteURL }}
            useWebKit={true}
            scalesPageToFit={false}
            injectedJavaScript={this.INJECTED_JS}
            onMessage={event => {
              let message = event.nativeEvent.data;
              if (message === "show_finished_button") {
                this.setState({finishedVisible: true})
              } else {
                console.log(message);
                this.currentURL = event.nativeEvent.url;
              }
            }}
            onShouldStartLoadWithRequest={request => {
              let url = request.url;
              if (!url.includes('turbovote.org')) {
                //open external sites like state.gov online registration in a separate window)
                this.loadInExternalBrowser(url);
                return false
              } else {
                return true
              }
            }}
          />

          {this.state.finishedVisible &&
            <TouchableOpacity style={styles.doneButton} onPress={this.doneButtonHandler}>
              <Text style={[GlobalStyles.bodyText,styles.doneButtonText]}>Finished</Text>
            </TouchableOpacity>
          }
        </View>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
  doneButton: {
    position: "absolute",
    bottom: 25,
    alignSelf: 'center',
    minWidth: 325,
    padding: 15,
    justifyContent: "center",
    backgroundColor: "#21e870",
    borderRadius: global.CURRENT_THEME.roundness
  },
  doneButtonText: {
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "center",
    fontSize: 25
  },
  webview: {
    flex: 1,
    marginTop: -10
  },
  loadingSpinner: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99
  }
});

module.exports= TurboVoteScreen