import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from 'react-native-material-textfield';

import {GlobalStyles} from '../Globals';
import FormTextField from '../components/FormTextField'


class NameScreen extends Component {

	constructor(props) {
    super(props);

    this.state = {};

    var nameSplit = global.user.name.split(' ');
    this.defaultFirstName = nameSplit[0];
    this.defaultLastName = nameSplit[1];

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitFirstName = this.onSubmitFirstName.bind(this);

    this.firstnameRef = this.updateRef.bind(this, 'firstname');
    this.lastnameRef = this.updateRef.bind(this, 'lastname');
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

  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }

  onChangeText(text) {
    ['firstname', 'lastname']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref && ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
      console.log(this.state);
  }

  onSubmitFirstName() {
    this.lastname.focus();
  }

  onSubmit() {
    var error = false;
    ['firstname', 'lastname']
      .forEach((name) => {
        if (!this[name].validateText()) {
          error = true;
        } else {
          let value = this[name].getValue();
          console.log(value);
        }
      });

  }

	render() {
    let { errors = {} } = this.state;
		return (
			<View style={GlobalStyles.backLayerContainer}>
        <ScrollView style={GlobalStyles.frontLayerContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <FormTextField
              ref={this.firstnameRef}
              label='First Name'
              defaultValue={global.user.name.split(' ')[0]}
              onSubmitEditing={this.onSubmitFirstName}
            />

            <FormTextField
              ref={this.lastnameRef}
              label='Last Name'
              defaultValue={global.user.name.split(' ')[1]}
              onSubmitEditing={this.onSubmitLastName}
            />

            <TouchableOpacity style={styles.continueButton} onPress={this.onSubmit}>
              <Ionicons name="md-arrow-forward" size={45} color={global.CURRENT_THEME.colors.accent} />
            </TouchableOpacity>
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
  continueButton: {
    width: 75,
    height: 75,
    borderRadius: 75/2,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary,
  },
});

module.exports= NameScreen