import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableNativeFeedback, Image, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from 'react-native-material-textfield';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Linking } from 'expo';

import {GlobalStyles} from '../Globals';
import * as API from '../APIClient';


class FeedbackScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
    this.removeScreenshot = this.removeScreenshot.bind(this);
    this.placeholderText = this.getPlaceholderText(props.navigation.state.params.type);
  }

  getPlaceholderText(type) {
    switch(type) {
      case "bug":
        return "Enter details about the bug";
      case "question_idea":
        return "Share your ballot question";
      case "happy":
        return "What did you like?";
      case "sad":
        return "What didn't you like?";
      case "suggestion":
        return "Share your ideas";
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Submit Feedback',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
        headerRight: (
          <TouchableOpacity style={{marginRight: 20}} onPress={() => console.log("submit")}>
            <Ionicons name="md-send" size={25} color={global.CURRENT_THEME.colors.accent} />
          </TouchableOpacity>
        )
      };
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true
    });

    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  removeScreenshot() {
    this.setState({ image: null });
  }

	render() {
    let { image } = this.state;
		return (
			<View style={GlobalStyles.backLayerContainer}>
	        <ScrollView style={GlobalStyles.frontLayerContainer}>
            <View style={styles.container}>
              {/*<Text style={GlobalStyles.titleText}>Enter your feedback</Text>*/}
              <TextField
                multiline={true}
                lineWidth={1}
                tintColor={global.CURRENT_THEME.colors.primary}
                baseColor={global.CURRENT_THEME.colors.text}
                label={this.placeholderText}
                animationDuration={100}
                labelTextStyle={GlobalStyles.bodyText}
                ref={this.fieldRef}
              />
              {!image &&
                <TouchableNativeFeedback onPress={this._pickImage}>
                  <View style={styles.addScreenshotItem}>
                    <Ionicons name="md-add-circle-outline" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.addScreenshotIcon} />
                    <Text style={[GlobalStyles.bodyText, styles.addScreenshotText]}>Add screenshot</Text>
                  </View>
                </TouchableNativeFeedback>
              }
              {image &&
                <View style={styles.screenshotThumbnailContainer}>
                  <TouchableOpacity style={styles.deleteScreenshot} onPress={this.removeScreenshot}>
                    <Ionicons name="md-close" size={20} color={global.CURRENT_THEME.colors.accent} />
                  </TouchableOpacity>
                  <Image source={{ uri: image.uri }} style={{ width: 100, height: 100*(image.height/image.width) }} />
                </View>
              }
              <Text>
                <Text style={[GlobalStyles.bodyText, styles.emailUsText]}>You can also email us any feedback if you prefer: </Text>
                <Text
                  style={[GlobalStyles.bodyText, styles.emailUsText, {color: global.CURRENT_THEME.colors.primary}]}
                  onPress={() => Linking.openURL('mailto: contact@turnout.us?subject=[App Feedback]')}>
                  contact@turnout.us
                </Text>
              </Text>
            </View>
	        </ScrollView>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20
  },
  addScreenshotItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60
  },
  addScreenshotIcon: {
    marginRight: 20
  },
  addScreenshotText: {
    fontSize: 18
  },
  emailUsText: {
    fontSize: 16
  },
  screenshotThumbnailContainer: {
    width: 100,
    marginTop: 10
  },
  deleteScreenshot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 20/2,
    backgroundColor: global.CURRENT_THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  }
});

module.exports= FeedbackScreen