import React, {Component, PureComponent} from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, SectionList, Image, TouchableHighlight, Alert, AppState, KeyboardAvoidingView, Share, ActivityIndicator} from 'react-native';
import Constants from 'expo-constants';
import * as Contacts from 'expo-contacts';
import PropTypes from 'prop-types';
import { CheckBox } from 'native-base';
import SearchBar from "react-native-dynamic-search-bar";
import * as SMS from 'expo-sms';
import { Linking } from 'expo';
import * as IntentLauncher from 'expo-intent-launcher';
import { MaterialDialog } from 'react-native-material-dialog';
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';

const LIST_ITEM_IMAGE_SIZE=50;

class InviteScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {
      contactsData: null,
      numContactsSelected: 0,
      contactPermissionGranted: true,
      appState: AppState.currentState,
      invitesSent: 0,
      preparingInviteDialogVisible: false,
      invitesSentDialogVisible: false,
      preparingInviteName: ""
    };
    this.selectedContacts = [];

    this.onShareLinkPress = this.onShareLinkPress.bind(this);
    this.tryToGetContactPermissions = this.tryToGetContactPermissions.bind(this);
    this.contactSelectedHandler = this.contactSelectedHandler.bind(this);
    this.sendInvitesHandler = this.sendInvitesHandler.bind(this);
    this.searchFilterFunction = this.searchFilterFunction.bind(this);
    this.onInvitesSentDialogButtonPressed = this.onInvitesSentDialogButtonPressed.bind(this);
  }

  componentDidMount() {
    this.createBranchUniversalObject();
    this.getContacts();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.tryToGetContactPermissions(false);
    }
    this.setState({appState: nextAppState});
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Invite Friends',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      };
  }

  async createBranchUniversalObject(){
    if (Constants.appOwnership === 'standalone') {
      const ExpoBranch = await import('expo-branch');
      const Branch = ExpoBranch.default;
      this._branchUniversalObject = await Branch.createBranchUniversalObject(
        'invites/'+global.user.id,
        {
          contentMetadata: {
            customMetadata: {
              referringUserId: global.user.id,
              referringUserName: global.user.name,
              referringUserAvatarURL: global.user.avatarURL
            }
          }
        }
      );
    }
  }

  async onShareLinkPress() {
    const shareOptions = {
      messageHeader: 'testtitle',
      messageBody: `Checkout my new article!`,
    };
    if (Platform.OS == "ios") {
      if (Constants.appOwnership !== 'standalone') {
        alert("branch doesn't work in the dev environment :(");
        return;
      }
      //show branch sharesheet on ios
      let linkProperties = {
        feature: 'share_link',
        campaign: 'invite_screen',
        tags: [global.user.id]
      }
      await this._branchUniversalObject.showShareSheet(shareOptions, linkProperties);
    } else {
      //branch sharesheet is ugly on android so use native sharesheet API instead
      if (Constants.appOwnership !== 'standalone') {
        var url = "https://example.com"
      } else {
        let linkProperties = {
          feature: 'share_link',
          channel: 'android_sharesheet',
          campaign: 'invite_screen',
          tags: [global.user.id]
        }
        var {url} = await this._branchUniversalObject.generateShortUrl(linkProperties, {});
      }
      try {
        await Share.share({
          title: "Join Turnout",
          message: "Join Turnout using my link: " + url,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };


  async tryToGetContactPermissions(shouldPrompt) {
    const {status, granted, canAskAgain} = await Contacts.getPermissionsAsync();
    this.setState({contactPermissionGranted: granted || status == "granted" });
    if (!(granted || status == "granted") && !shouldPrompt) {
      return;
    }
    if (!granted && !canAskAgain) {
      const alertTitle = "Enable Contact Permissions";
      const alertMessage = Platform.OS == "ios" ?
        "Enable the Contacts permission on the next screen, then return to the Turnout app." :
        "On the next screen, tap permissions, enable the Contacts permission, then return to the Turnout app.";
      Alert.alert(
        alertTitle,
        alertMessage,
        [
          {text: "Got it", onPress: () => (this.goToPermissionsSettings())}
        ],
        { cancelable: false }
      )
    } else {
      this.getContacts();
    }
  }

  async goToPermissionsSettings() {
    if (Platform.OS == "ios") {
      Linking.openURL('app-settings:')
    } else if (Platform.OS == "android") {
      const pkg = Constants.appOwnership == 'standalone' ? Constants.manifest.android.package : "host.exp.exponent";
      await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS, { data: 'package:' + pkg })
    }
  }

  async getContacts() {
    const { status } = await Contacts.requestPermissionsAsync();
    this.setState({contactPermissionGranted: status=="granted"});
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image, Contacts.Fields.ImageAvailable],
      });
      let alphabeticalContacts = data.sort(function(a,b) {return (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0);} );
      this.contactsDataFull = this.makeContactsListByLetter(alphabeticalContacts);
      this.setState({contactsData: this.contactsDataFull});
    }
  }

  getFullName(firstName, lastName) {
    let hasFirstName = !!firstName;
    let hasLastName = !!lastName;
    return (hasFirstName ? firstName : "") + (hasFirstName && hasLastName ? " " : "") + (hasLastName ? lastName : "");
  }

  getPhoneNumber(phoneNumbers) {
    var numberToReturn = phoneNumbers[0].number;
    phoneNumbers.forEach(function(phoneNumber){
      if (phoneNumber.label === "mobile") {
        numberToReturn = phoneNumber.number;
      }
    });
    return numberToReturn;
  }

  makeContactsListByLetter(contacts) {
    return contacts.reduce(function (list, contact, index) {
      if (!!contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        let name = this.getFullName(contact.firstName, contact.lastName);
        let imageURL = contact.imageAvailable ? contact.image.uri : "";
        let phoneNumber = this.getPhoneNumber(contact.phoneNumbers);
        let firstLetter = name.slice(0, 1).toUpperCase();
        let listItem = list.find((item) => item.title && item.title === firstLetter);
        let newItem = {firstName: contact.firstName, name, imageURL, phoneNumber, id: contact.id, checked: false};
        if (!listItem) {
          list.push({title: firstLetter, data: [newItem]});
        } else {
          listItem.data.push(newItem);
        }
      }
      return list;
    }.bind(this), []);
  }

  updateCheckedValue(contact, selected) {
    for (var i = 0; i < this.contactsDataFull.length; i++) {
      if (this.contactsDataFull[i].title === contact.name.charAt(0)) {
        var curDataArr = this.contactsDataFull[i].data;
        for (var j = 0; j < curDataArr.length; j++) {
          if (curDataArr[j] === contact) {
            this.contactsDataFull[i].data[j].checked = selected;
            return;
          }
        }
      }
    }
  }

  contactSelectedHandler(contact, selected) {
    if (selected) {
      //add to selected contacts
      this.selectedContacts.push(contact);
    } else {
      //remove from selected contacts
      let indexToRemove = this.selectedContacts.indexOf(contact);
      this.selectedContacts.splice(indexToRemove, 1);
    }
    this.setState(prevState => {
      return {numContactsSelected: prevState.numContactsSelected + (selected ? 1 : -1)}
    });
    this.updateCheckedValue(contact, selected);
  }

  searchFilterFunction(searchText) {
    //get only digits from search text to filter out other chars
    let searchTextPhoneNumber = searchText.replace(/\D/g, "");
    let newData = this.contactsDataFull.reduce((result, sectionData) => {
      const { title, data } = sectionData;
      const filteredData = data.filter(item =>
        item.name.includes(searchText) ||
        (searchTextPhoneNumber.length > 0 &&
         item.phoneNumber.replace(/\D/g, "").includes(searchTextPhoneNumber))
      );
      if (filteredData.length !== 0) {
        result.push({
          title,
          data: filteredData
        });
      }
      return result;
    }, [])
    this.setState({ contactsData: newData });
  }

  checkForSMSRetry = (name) => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Invite Didnt Send",
        "Looks like the invite to " + name + " didn't send.",
        [
          {text: "Skip", onPress: () => resolve("skipped"), style: "cancel"},
          {text: "Try Again", onPress: () => resolve("")}
        ],
        { cancelable: false }
      )
    })
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendInvites(url) {
    this.preparingInviteCancelled = false;
    //send the messages via SMS
    var invitesSent = 0;
    for (var i = 0; i < this.selectedContacts.length; i++) {
      console.log(this.selectedContacts[i]);
      this.setState({preparingInviteDialogVisible: true, preparingInviteName: this.selectedContacts[i].firstName});
      var smsResult = "";
      while (smsResult != "sent" && smsResult != "unknown" & smsResult != "skipped") {
        await this.sleep(500);
        this.setState({preparingInviteDialogVisible: false});
        if (this.preparingInviteCancelled) {
          return;
        }
        const {result} = await SMS.sendSMSAsync(
          this.selectedContacts[i].phoneNumber,
          'Join Turnout using my link: ' + url
        );
        smsResult = result;
        if (smsResult == "cancelled") {
          smsResult = await this.checkForSMSRetry(this.selectedContacts[i].name);
        }
        if (smsResult == "sent" || smsResult == "unknown") {
          invitesSent++;
        }
      }
    }
    this.setState({invitesSent, preparingInviteDialogVisible: false}, () => this.setState({invitesSentDialogVisible: true}));
  }

  clearContactsListAfterInvitesSent() {
    //clear list now that invites are sent
    for (let i = 0; i < this.selectedContacts.length; i++) {
      this[this.selectedContacts[i].id].setState({checked: false});
    }
    this.selectedContacts = [];
    this.setState({contactsData: this.contactsDataFull, numContactsSelected: 0, invitesSent: 0});
  }

  async sendInvitesHandler() {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      if (Constants.appOwnership == 'standalone') {
        //get branch link
        let linkProperties = {
          feature: 'contact_list',
          channel: 'sms',
          campaign: 'invite_screen',
          tags: [global.user.id]
        }
        var {url} = await this._branchUniversalObject.generateShortUrl(linkProperties, {});
      } else {
        var url = "https://example.com";
      }
      if (Platform.OS == "android" && this.selectedContacts.length > 1) {
        Alert.alert(
          "Sending Invites",
          "Invites will be sent one at a time. After you press send on each message, press the back button return to the Turnout app and we'll queue up the next one!",
          [
            {text: "I promise I actually read this", onPress: () => (this.sendInvites(url))}
          ],
          { cancelable: false }
        )
      } else {
        this.sendInvites(url);
      }
    } else {
      //sms not available on this device
      Alert.alert("SMS Unavailable", "SMS is unavailable on this device. Use the 'Share Link' button instead.")
    }
  }

  cancelPreparingInvites() {
    this.preparingInviteCancelled = true;
    this.setState({ preparingInviteDialogVisible: false });
    this.clearContactsListAfterInvitesSent();
  }

  onInvitesSentDialogButtonPressed(sharePressed) {
    this.setState({ invitesSentDialogVisible: false });
    this.clearContactsListAfterInvitesSent();
    if (sharePressed) {
      this.onShareLinkPress();
    }
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
        <View style={[GlobalStyles.frontLayerContainer]}>
          <View style={styles.shareLinkContainer}>
            <Text style={[GlobalStyles.bodyText, styles.inviteText]}>Earn power-ups by getting friends to play!</Text>
            <TouchableOpacity style={styles.shareLinkButton} onPress={this.onShareLinkPress}>
              <Text style={[GlobalStyles.bodyText,styles.shareLinkButtonText]}>Share Link</Text>
            </TouchableOpacity>
          </View>
            {!this.state.contactPermissionGranted &&
              <View style={styles.needContactPermissionContainer}>
                <Text style={[GlobalStyles.bodyText,styles.needContactPermissionText]}>To find friends faster,{"\n"}turn on contact permissions.</Text>
                <TouchableOpacity style={styles.needContactPermissionButton} onPress={() => {this.tryToGetContactPermissions(true)}}>
                  <Text style={[GlobalStyles.bodyText,styles.sendInvitesButtonText]}>Enable Contacts</Text>
                </TouchableOpacity>
                <Text style={[GlobalStyles.bodyText, styles.otherwiseText]}>Otherwise, use the 'Share Link' button up top.</Text>
              </View>
            }
            {this.state.contactPermissionGranted && this.state.contactsData &&
              <KeyboardAvoidingView style={styles.contactsListContainer} behavior="height" keyboardVerticalOffset={75}>
                <SearchBar
                  placeholder="Search for a name or number"
                  onChangeText={searchText => this.searchFilterFunction(searchText)}
                  onPressCancel={() => {this.searchFilterFunction("")}}
                  onPressToFocus={true}
                  iconColor={global.CURRENT_THEME.colors.text_opacity3}
                  borderRadius={30}
                  noExtraMargin={true}
                  height={45}
                />
                <SectionList
                  style={styles.sectionList}
                  stickySectionHeadersEnabled={true}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  sections={this.state.contactsData}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item }) => <ContactItem ref={(contactItem) => this[item.id] = contactItem} contact={item} onPress={this.contactSelectedHandler} />}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={[GlobalStyles.headerText, styles.sectionHeader]}>{title}</Text>
                  )}
                />
                { this.state.numContactsSelected > 0 &&
                  <View style={styles.sendInvitesButtonContainer}>
                    <TouchableOpacity style={styles.sendInvitesButton} onPress={this.sendInvitesHandler}>
                      <Text style={[GlobalStyles.bodyText,styles.sendInvitesButtonText]}>Send Invites ({this.state.numContactsSelected})</Text>
                    </TouchableOpacity>
                  </View>
                }
              </KeyboardAvoidingView>
            }
          <MaterialDialog
            visible={this.state.preparingInviteDialogVisible}
            onOk={() => this.cancelPreparingInvites()}
            onCancel={() => false}
            cancelLabel=""
            okLabel="Cancel"
            colorAccent={global.CURRENT_THEME.colors.primary}
            backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
            <View>
              <ActivityIndicator size="large" color={global.CURRENT_THEME.colors.primary}/>
              <Text style={styles.preparingInviteText}>Preparing {this.state.preparingInviteName}'s Invite...</Text>
            </View>
          </MaterialDialog>
          <MaterialDialog
            visible={this.state.invitesSentDialogVisible}
            onOk={() => this.onInvitesSentDialogButtonPressed(true)}
            onCancel={() => this.onInvitesSentDialogButtonPressed(false)}
            okLabel="Share"
            cancelLabel="Close"
            colorAccent={global.CURRENT_THEME.colors.primary}
            backgroundColor={global.CURRENT_THEME.colors.backgroundColor}>
            <View>
              <Ionicons
                name="md-checkmark-circle-outline"
                size={100}
                style={{ alignSelf: "center" }}
                color={global.CURRENT_THEME.colors.primary}
              />
              <Text style={[GlobalStyles.headerText, styles.invitesSentDialogTitle]}>Invites Sent</Text>
              <Text style={[GlobalStyles.bodyText, styles.invitesSentDialogText]}>
                {this.state.invitesSent} invite{this.state.invitesSent > 1 ? "s" : ""} sent! Share your link on social media to reach even more people.
              </Text>
            </View>
          </MaterialDialog>
        </View>
	    </View>
		);
	}
}

class ContactItem extends PureComponent {

  static propTypes = {
    contact: PropTypes.object,
    onPress: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state={checked: props.contact.checked};

    this.checkBoxHandler = this.checkBoxHandler.bind(this);
  }

  checkBoxHandler() {
    this.props.onPress(this.props.contact, !this.state.checked);
    this.setState({checked: !this.state.checked});
  }

  render() {
    const {contact} = this.props;
    const {name, imageURL, phoneNumber} = contact;
    return (
      <TouchableHighlight style={styles.listItemTouchable} underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={this.checkBoxHandler}>
        <View style={styles.listItemContainer} >
          <View style={styles.listItemsLeftAlignContainer}>
            <Image
              style={styles.listItemImage}
              source={!!imageURL ? {uri: imageURL} : require('../../assets/images/md-contact.png')}
            />
            <View style={styles.listItemTitlesContainer}>
              <Text style={[GlobalStyles.bodyText, styles.listItemTitle]}>{name}</Text>
              <Text style={[GlobalStyles.bodyText, styles.listItemSubtitle]}>{phoneNumber}</Text>
            </View>
          </View>
          <CheckBox
            style={styles.checkBox}
            checked={this.state.checked}
            color={global.CURRENT_THEME.colors.primary}
            onPress={this.checkBoxHandler} />
          {/*<Text style={[GlobalStyles.bodyText, styles.listItemTitle, {textAlign: 'right'}]}>{item.points}</Text>*/}
        </View>
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  shareLinkContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  inviteText: {
    flex: 2,
    fontSize: 20
  },
  shareLinkButton: {
    flex: 1,
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderRadius: global.CURRENT_THEME.roundness,
      borderColor: global.CURRENT_THEME.colors.primary,
      borderWidth: 1
  },
  shareLinkButtonText: {
      color: global.CURRENT_THEME.colors.primary,
      textAlign: "center",
      fontSize: 16
  },
  otherwiseText: {
    textAlign: "center",
    marginTop: 5
  },
  sectionHeader: {
    color: global.CURRENT_THEME.colors.primary,
    fontSize: 20
  },
  listItemTouchable: {
    borderRadius: global.CURRENT_THEME.roundness
  },
  listItemContainer: {
    height: 62.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25
  },
  listItemsLeftAlignContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemTitlesContainer: {
    marginLeft: 10
  },
  listItemTitle: {
    fontSize: 15
  },
  listItemSubtitle: {
    color: global.CURRENT_THEME.colors.text_opacity5,
    fontSize: 12
  },
  listItemImage: {
    width: LIST_ITEM_IMAGE_SIZE,
    height: LIST_ITEM_IMAGE_SIZE,
    borderRadius: LIST_ITEM_IMAGE_SIZE/2,
  },
  checkBox: {
    borderRadius: 10
  },
  sendInvitesButton: {
    width: 375,
    height: 60,
    justifyContent: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },
  sendInvitesButtonText: {
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "center",
    fontSize: 25
  },
  contactsListContainer: {
    flex: 1,
    marginHorizontal: 20
  },
  needContactPermissionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  needContactPermissionButton: {
    paddingHorizontal: 20,
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },
  needContactPermissionText: {
      color: global.CURRENT_THEME.colors.text,
      textAlign: "center",
      fontSize: 18,
      marginBottom: 10,
  },
  sectionList: {
    marginTop: 10
  },
  sendInvitesButtonContainer: {
    alignSelf: "center",
    justifyContent: "flex-end",
    marginBottom: 10
  },
  snackbar: {
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: 0,
    width: '100%',
    margin: 0,
  },
  preparingInviteText: {
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    color: global.CURRENT_THEME.colors.text
  },
  invitesSentDialogText: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "left",
    color: global.CURRENT_THEME.colors.text
  },
  invitesSentDialogTitle: {
    marginTop: 10,
    fontSize: 20,
    textAlign: "left",
    color: global.CURRENT_THEME.colors.text
  }
});

module.exports= InviteScreen