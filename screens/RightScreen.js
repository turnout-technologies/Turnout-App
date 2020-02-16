import React, {Component} from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';

import getEnvVars from '../auth/environment';
import * as API from '../APIClient';
import {GlobalStyles, getUser} from '../Globals';

class RightScreen extends Component {

	constructor() {
    	super();
  	}

  	signOut = () => {
  		firebase.auth().signOut();
  		this.props.navigation.navigate('Auth');
	};

	render() {
		var user = getUser();
  		return (
  			<View style={GlobalStyles.backLayerContainer}>
		        <ScrollView style={GlobalStyles.frontLayerContainer}>
		          <View style={{paddingBottom:20}}>
	        		<View style={styles.profileInfoContainer}>
	        			<Image
		          			style={styles.profileImage}
		          			source={{uri: user.photoURL.replace("s96-c", "s384-c")}}
	        			/>
	        			<Text style={[GlobalStyles.titleText, styles.name]}>{user.displayName}</Text>
	        			<Text style={[GlobalStyles.bodyText, styles.email]}>{user.email}</Text>
	        		</View>
		          </View>
		        </ScrollView>
		        <Button style={{position: 'absolute', bottom: 0}} title="Sign Out" onPress={this.signOut} />
		    </View>
  		);
	}

	static navigationOptions = ({navigation}) => {
		return {
		    title: 'Profiles',
		    headerStyle: GlobalStyles.headerStyle,
		    headerTintColor: global.CURRENT_THEME.colors.accent,
		    headerRight: __DEV__ ? () => (
			    <TouchableOpacity style={{marginRight: 20}} onPress={() => navigation.navigate('DebugOptions')}>
			    	<Ionicons
				      name="md-bug"
				      size={25}
				      color={global.CURRENT_THEME.colors.accent}
				    />
			    </TouchableOpacity>
			  ) : null
	  	};
	}
}

const styles = StyleSheet.create({
  profileInfoContainer: {
  	alignItems: "center",
  	marginTop: 20
  },
  profileImage: {
  	width: 125,
  	height: 125,
  	borderRadius: 125/2
  },
  name: {
  	fontSize: 25
  },
  email: {
  	fontSize: 15
  }
});

module.exports= RightScreen