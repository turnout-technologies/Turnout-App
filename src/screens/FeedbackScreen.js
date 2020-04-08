import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight, Image, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from 'react-native-material-textfield';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Linking } from 'expo';
import * as firebase from 'firebase';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import axios from 'axios';

import {GlobalStyles} from '../Globals';


class FeedbackScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {
      image: null
    };
    this.type = props.navigation.state.params.type;
    this.placeholderText = this.getPlaceholderText(this.type);
    this.screenshotURL = "";

    this.removeScreenshot = this.removeScreenshot.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerRight: () => (
        <TouchableOpacity style={{marginRight: 20}} onPress={this.submitHandler}>
          <Ionicons name="md-send" size={25} color={global.CURRENT_THEME.colors.accent} />
        </TouchableOpacity>
      )
    })
  }

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    if (state.params != undefined) {
      return {
        title: 'Submit Feedback',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
        headerRight: navigation.state.params.headerRight
      };
    } else {
      return {
        title: 'Submit Feedback',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent
      };
    }
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

  async postToSlackWebhook() {
    var payload =
      {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*User:* "+global.user.name+"\n*Email:* "+global.user.email+"\n*Type:* "+this.type+"\n*Message:* "+this.message
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "View In Sentry"
                },
                url: Constants.manifest.extra.sentryURLPrefix + this.eventId
              }
            ]
          }
        ]
      }
    if (!!this.screenshotURL) {
      payload.blocks[1].elements.push({
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "View Screenshot"
        },
        url: this.screenshotURL
      });
    }
    try {
      var response = await axios.post(Constants.manifest.extra.slackWebhookURL, payload);
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
      Sentry.captureException(error);
    }
  }

  submitFeedback() {
    const { navigation } = this.props;
    Sentry.withScope(function(scope) {
      scope.setTag("type", this.type);
      scope.setExtra("screenshotURL", this.screenshotURL);
      this.eventId = Sentry.captureMessage(this.message);
      this.postToSlackWebhook();
      navigation.goBack();
      navigation.state.params.onFeedbackSubmitted({ snackbarVisible: true });
    }.bind(this));
  }

  submitHandler() {
    this.message = this.textField.value();

    if (!this.state.image && !this.message) {
      Alert.alert("", "Enter feedback and/or attach a screenshot before submitting.");
    } else {
      //check whether there is a screenshot to send
      if (this.state.image) {
        //set filename to uid_curTimestamp
        var filename = global.user.id + "_" + Math.round(new Date().getTime() / 1000) + ".png";
        //upload the screenshot
        this.uploadScreenshot(filename);
      } else {
        this.submitFeedback();
      }
    }
  }

  //uplaods screenshot to firebase storage
  uploadScreenshot = async (filename) => {
    if (!this.state.image) {
      //return if there is no screenshot
      return ;
    }

    // Create the file metadata
    var metadata = {
      contentType: 'image/png'
    };

    // Create a root reference
    var storageRef = firebase.storage().ref();

    //image blob
    const response = await fetch(this.state.image.uri);
    const blob = await response.blob();

    // Upload file and metadata to the object 'images/mountains.jpg'
    try {
      var uploadTask = storageRef.child('screenshots/' + filename).put(blob, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function(error) {
          console.log(error);
          Alert.alert("Error", "Screenshot upload failed.");
        }, function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            this.screenshotURL = downloadURL;
            this.submitFeedback();
          }.bind(this));
      }.bind(this));
    } catch (error) {
      console.log(error);
    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false
    });

    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: {width: 720} }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
      );
      this.setState({ image: manipResult });
    }
  };

  removeScreenshot() {
    this.setState({ image: null });
  }

	render() {
    let { image } = this.state;
		return (
			<View style={GlobalStyles.backLayerContainer}>
	        <ScrollView style={GlobalStyles.frontLayerContainer} showsVerticalScrollIndicator={false}>
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
                ref={(textField) => {this.textField=textField}}
              />
              {!image &&
                <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={this._pickImage}>
                  <View style={styles.addScreenshotItem}>
                    <Ionicons name="md-add-circle-outline" size={25} color={global.CURRENT_THEME.colors.primary} style={styles.addScreenshotIcon} />
                    <Text style={[GlobalStyles.bodyText, styles.addScreenshotText]}>Add screenshot</Text>
                  </View>
                </TouchableHighlight>
              }
              {image &&
                <View style={styles.screenshotThumbnailContainer}>
                  <TouchableOpacity style={styles.deleteScreenshot} onPress={this.removeScreenshot}>
                    <Ionicons name="md-close" size={20} color="white" />
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
    backgroundColor: "#EE3738",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  }
});

module.exports= FeedbackScreen