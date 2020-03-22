import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from 'react-native-material-textfield';

import {GlobalStyles} from '../Globals';
import FormTextField from '../components/FormTextField'

class NameScreen extends Component {

	constructor(props) {
    super(props);

    this.state = {};

    this.fieldsArr = ['firstname', 'lastname']
    this.firstnameRef = this.updateRef.bind(this, 'firstname');
    this.lastnameRef = this.updateRef.bind(this, 'lastname');

    this.onContinue = this.onContinue.bind(this);
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Name',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      };
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  onContinue() {
    var error = false;
    this.fieldsArr
      .forEach((name) => {
        if (this[name].validateText()) {
          let value = this[name].getValue();
          console.log(name + ": " + value);
        } else {
          error = true;
        }
      });
  }

	render() {
		return (
			<KeyboardAvoidingView style={GlobalStyles.backLayerContainer} behavior="height" keyboardVerticalOffset={75}>
        <ScrollView
          style={GlobalStyles.frontLayerContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <FormTextField
              ref={this.firstnameRef}
              label='First Name'
              defaultValue={global.user.name.split(' ')[0]}
              onSubmitEditing={() => {this['lastname'].focus()}}
            />

            <FormTextField
              ref={this.lastnameRef}
              label='Last Name'
              defaultValue={global.user.name.split(' ')[1]}
              onSubmitEditing={this.onContinue}
            />
          </View>
        </ScrollView>
        <View style={styles.continueButtonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={this.onContinue}>
            <Ionicons name="md-arrow-forward" size={45} color={global.CURRENT_THEME.colors.accent} />
          </TouchableOpacity>
        </View>
	    </KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20
  },
  continueButtonContainer: {
    position: "absolute",
    bottom: 0,
    right: 20,
    justifyContent: "flex-end",
  },
  continueButton: {
    width: 65,
    height: 65,
    borderRadius: 65/2,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: global.CURRENT_THEME.colors.primary,
  },
});

module.exports= NameScreen