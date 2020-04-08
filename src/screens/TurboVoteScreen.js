import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

import {GlobalStyles} from '../Globals';

//const INJECTED_JS = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'initial-scale=1, maximum-scale=0.8, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '

class TurboVoteScreen extends Component {

	constructor(props) {
    super(props);

    this.nameSplit = global.user.name.split(" ");

    this.setInjectedJS();
  }

  setInjectedJS() {
    /*cont INJECTED_JS = `
      (function() {
        function wrap(fn) {
          return function wrapper() {
            var res = fn.apply(this, arguments);
            window.ReactNativeWebView.postMessage(window.location.href);
            return res;
          }
        }
        history.pushState = wrap(history.pushState);
        history.replaceState = wrap(history.replaceState);
        window.addEventListener('popstate', function() {
          window.ReactNativeWebView.postMessage(window.location.href);
        });
      })();
      true;
    `;*/
    this.INJECTED_JS = `
      //CONSTANTS
      var DELAY_MS = 200; //200 seems to work well
      var AUTO_ADVANCE = false;

      //DATA
      var firstName = 'first'; //${this.nameSplit[0]}
      var lastName = 'last'; //${this.nameSplit[1]}
      var mobileNumber = '';
      var email = 'test@test.com'; //${global.user.email}
      /*var street = '';
      var street2 = '';
      var city = '';
      var state = '';
      var zip = '';
      var party = '';
      var dobMonth = '';
      var dobDay = '';
      var dobYear = '';*/

      var registrationStatus = 'yes' //yes or no. String in case we want to add 'cantvote'
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
      var dobYear = '1980';

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

      // For React <=15.5
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
      // For React 16 and React >=15.6
      /*const changeValueV2 = (element, value) => {
        var setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setValue.call(element, value);
      }*/

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
              selectValue(partySelect, party);
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
            window.ReactNativeWebView.postMessage('FINISHED');
            break;
        }
      }

      onNextPage();

      true;
    `
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'TurboVote',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      };
  }

  handleWebViewNavigationStateChange(newNavState) {
    console.log(newNavState);
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    /*const { url } = newNavState;
    if (!url) return;

    // one way to handle a successful form submit is via query strings
    if (url.includes('?message=success')) {
      this.webview.stopLoading();
      // maybe close this view?
    }

    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
    }

    // redirect somewhere else
    if (url.includes('google.com')) {
      const newURL = 'https://logrocket.com/';
      const redirectTo = 'window.location = "' + newURL + '"';
      this.webview.injectJavaScript(redirectTo);
    }
  };*/
}

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
	        <View style={[GlobalStyles.frontLayerContainer, {overflow: 'hidden'}]}>
            <WebView
              ref={ (ref) => { this.webview = ref; } }
              style={{ flex: 1, marginTop: -10 }}
              showsVerticalScrollIndicator={false}
              source={{ uri: 'https://turbovote.org/' }}
              injectedJavaScript={this.INJECTED_JS}
              useWebKit={true}
              onMessage={event => {
                console.log(event.nativeEvent.data)
              }}
              onShouldStartLoadWithRequest={request => {
                let url = request.url;
                if (!url.includes('turbovote.org')) {
                  WebBrowser.openBrowserAsync(url);
                  return false
                } else {
                  return true
                }
              }}
            />
          </View>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
});

module.exports= TurboVoteScreen