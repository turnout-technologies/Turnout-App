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
	        		<View style={styles.profileInfoContainer}>
	        			<Image
		          			style={styles.profileImage}
		          			source={{uri: user.photoURL.replace("s96-c", "s384-c")}}
	        			/>
	        			<Text style={[GlobalStyles.titleText, styles.name]}>{user.displayName}</Text>
	        			<Text style={[GlobalStyles.bodyText, styles.email]}>{user.email}</Text>
	        		</View>
	        		<View style={styles.statsRowContainer}>
        				<View style={styles.statContainer}>
        					<Text style={[GlobalStyles.headerText, styles.statNumber]}>10</Text>
        					<Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Questions Answered</Text>
        				</View>
        				<View style={styles.statContainer}>
        					<Text style={[GlobalStyles.headerText, styles.statNumber]}>200</Text>
        					<Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Points</Text>
        				</View>
        				<View style={styles.statContainer}>
        					<Text style={[GlobalStyles.headerText, styles.statNumber]}>3</Text>
        					<Text style={[GlobalStyles.bodyText, styles.statSubtitle]}>Friend Invites</Text>
        				</View>
        			</View>
		        </ScrollView>
		        <Button style={{position: 'absolute', bottom: 0}} title="Sign Out" onPress={this.signOut} />
		    </View>
  		);
	}

	static navigationOptions = ({navigation}) => {
		return {
		    title: 'Profile',
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
  	flex: 1,
  	alignItems: "center",
  	marginTop: 20,
  	paddingBottom: 20
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
  },
  statsRowContainer: {
  	alignSelf: "center",
  	width: 300,
  	flexDirection: "row",
  	justifyContent: "space-between"
  },
  statContainer: {
  	alignItems: "center",
  	width: "33%"
  },
  statNumber: {
  	fontSize: 24
  },
  statSubtitle: {
  	fontSize: 16,
  	textAlign: 'center'
  }
});

module.exports= RightScreen