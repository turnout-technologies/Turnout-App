import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight} from 'react-native';
import { Linking } from 'expo';

import {GlobalStyles} from '../Globals';


class LicensesScreen extends Component {

	constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => {
    return {
        title: 'Licenses',
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      };
  }

	render() {
		return (
			<View style={GlobalStyles.backLayerContainer}>
	        <ScrollView style={GlobalStyles.frontLayerContainer}>
            <View style={styles.container}>

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/expo/expo/blob/master/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>expo</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/darleikroth/react-native-material-backdrop/blob/master/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-native-material-backdrop</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/n4kz/react-native-material-textfield/blob/master/license.txt')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-native-material-textfield</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/callstack/react-native-paper/blob/master/LICENSE.md')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-native-paper</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/software-mansion/react-native-reanimated/blob/master/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-native-reanimated</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/wcandillon/react-native-redash/blob/master/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-native-redash</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/software-mansion/react-native-screens/blob/master/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-native-screens</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/react-navigation/react-navigation/blob/master/packages/bottom-tabs/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-navigation-tabs</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/react-navigation/react-navigation/blob/master/packages/stack/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>react-navigation-stack</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/firebase/firebase-js-sdk/blob/master/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>firebase</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/axios/axios/blob/master/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>axios</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />

              <TouchableHighlight underlayColor={global.CURRENT_THEME.colors.text_opacity3} onPress={ () => Linking.openURL('https://github.com/moment/moment-timezone/blob/develop/LICENSE')}>
                <View style={styles.licenseItem}>
                  <Text style={[GlobalStyles.bodyText, styles.licenseItemText]}>moment-timezone</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.licensesSeparator} />
            </View>
	        </ScrollView>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20
  },
  licenseItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
  },
  licenseItemText: {
    fontSize: 18,
    marginLeft: 20,
  },
  licensesSeparator: {
    borderBottomColor: global.CURRENT_THEME.colors.text_opacity3,
    borderBottomWidth: 0.5,
    marginVertical: 10
  },
});

module.exports= LicensesScreen