import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight, Image, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from 'react-native-material-textfield';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Linking } from 'expo';
import * as firebase from 'firebase';

import {GlobalStyles} from '../Globals';
import * as API from '../APIClient';


class FeedbackScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {
      image: null
    };
    this.type = props.navigation.state.params.type;
    this.placeholderText = this.getPlaceholderText(this.type);

    this.removeScreenshot = this.removeScreenshot.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerRight: (
        <TouchableOpacity style={{marginRight: 20}} onPress={this.submitFeedback}>
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

  submitFeedback() {
    var message = this.textField.value();

    if (!this.state.image && !message) {
      Alert.alert("", "Enter feedback and/or attach a screenshot before submitting.");
    } else {
      var filename = "";
      if (this.state.image) {
        console.log('yes screenshot');
        //set filename to uid_curTimestamp
        var filename = global.user.id + "_" + Math.round(new Date().getTime() / 1000) + ".png";
        //upload the screenshot
        this.uploadScreenshot(filename);
      } else {
        console.log('no screenshot');
      }
      const { navigation } = this.props;
      API.sendFeedback(this.type, message, filename, global.user.id)
      .then(function(response) {
        navigation.goBack();
        navigation.state.params.onFeedbackSubmitted({ snackbarVisible: true });
      })
      .catch(function (error) {
        navigation.goBack();
        navigation.state.params.onFeedbackSubmitted({ snackbarVisible: true });
        console.log(error.response);
      });
      //this.props.navigation.goBack();
    }
  }

  //uplaods screenshot to firebase storage and returns the filename
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
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          /*switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }*/
        }, function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
          });
      });
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
      allowsEditing: true,
      quality: 0.5
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