import React, {Component, PureComponent} from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, SectionList, Image, TouchableHighlight} from 'react-native';
import Constants from 'expo-constants';
import * as Contacts from 'expo-contacts';
import PropTypes from 'prop-types';
import { CheckBox } from 'native-base';


import {GlobalStyles} from '../Globals';

const LIST_ITEM_IMAGE_SIZE=50;

class InviteScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {contactsData: null, isContactSelected: false};
    this.selectedContacts = [];

    this.onShareLinkPress = this.onShareLinkPress.bind(this);
    this.contactSelectedHandler = this.contactSelectedHandler.bind(this);
    this.sendInvites = this.sendInvites.bind(this);
  }

  componentDidMount() {
    this.createBranchUniversalObject();

    this.getContacts();
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
        'test',
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
    if (Constants.appOwnership !== 'standalone') {
      alert("branch doesn't work in the dev environment :(");
      return;
    }
    const shareOptions = {
      messageHeader: 'testtitle',
      messageBody: `Checkout my new article!`,
    };
    console.log("here0");
    console.log(this._branchUniversalObject);
    await this._branchUniversalObject.showShareSheet(shareOptions);
  };

  async getContacts() {
    const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image, Contacts.Fields.ImageAvailable],
      });
      this.setState({contactsData: this.makeContactsListByLetter(data)});
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
        let newItem = {name, imageURL, phoneNumber};
        if (!listItem) {
          list.push({"title": firstLetter, "data": [newItem]})
        } else {
          listItem.data.push(newItem)
        }
      }
      return list;
    }.bind(this), []);
  }

  contactSelectedHandler(contact, selected) {
    if (selected) {
      //add to selected contacts
      this.selectedContacts.push(contact);
      this.setState({isContactSelected: true});
    } else {
      //remove from selected contacts
      let indexToRemove = this.selectedContacts.indexOf(contact);
      this.selectedContacts.splice(indexToRemove, 1);
      if (this.selectedContacts.length == 0) {
        this.setState({isContactSelected: false});
      }
    }
  }

  sendInvites() {
    console.log(this.selectedContacts);
  }

  contactListFooter = () => {
    return (
      <View style={{height: this.state.isContactSelected ? 78 : 0}}/>
    );
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
        <SafeAreaView style={[GlobalStyles.frontLayerContainer, styles.container]}>
          <View style={styles.shareLinkContainer}>
            <Text style={[GlobalStyles.bodyText, styles.inviteText]}>Earn a bonus when you sign friends up!</Text>
            <TouchableOpacity style={styles.shareLinkButton} onPress={this.onShareLinkPress}>
              <Text style={[GlobalStyles.bodyText,styles.shareLinkButtonText]}>Share Link</Text>
            </TouchableOpacity>
          </View>
          { !!this.state.contactsData &&
            <SectionList
              showsVerticalScrollIndicator={false}
              sections={this.state.contactsData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => <ContactItem contact={item} onPress={this.contactSelectedHandler} />}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={[GlobalStyles.headerText, styles.sectionHeader]}>{title}</Text>
              )}
              ListFooterComponent = { this.contactListFooter }
            />
          }
          { this.state.isContactSelected &&
            <TouchableOpacity style={styles.sendInvitesButton} onPress={this.sendInvites}>
              <Text style={[GlobalStyles.bodyText,styles.sendInvitesButtonText]}>Send Invites</Text>
            </TouchableOpacity>
          }
        </SafeAreaView>
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
    this.state={checked: false};

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
  container: {
    paddingHorizontal: 20
  },
  shareLinkContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  inviteText: {
    flex: 2,
    fontSize: 20,
  },
  shareLinkButton: {
    flex: 1,
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
    width:'100%',
    height: 60,
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
    borderRadius: global.CURRENT_THEME.roundness
  },
  sendInvitesButtonText: {
    color: global.CURRENT_THEME.colors.accent,
    textAlign: "center",
    fontSize: 25
  },
});

module.exports= InviteScreen