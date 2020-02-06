import React, {Component} from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as firebase from 'firebase';

import getEnvVars from '../auth/environment';
import * as API from '../APIClient';

class RightScreen extends Component {

	state = {
	    user: null
  	};

	constructor() {
    	super();
  	}

  	componentDidMount() {
  		var user = firebase.auth().currentUser;
  		this.setState({user});
  	}

  	signOut = () => {
  		firebase.auth().signOut();
  		this.props.navigation.navigate('Auth');
	};

	hello = () => {
		API.hello()
		.then(function(response) {
	    	console.log(response.status);
	    	console.log(response.data);
	    })
	    .catch(function (error) {
	    	console.log(error);
	    });
	};

	render() {
  		return (
  			<View>
  				<Text>Email: {this.state.user ? this.state.user.email : "loading"}</Text>
	        	<Text>Name: {this.state.user ? this.state.user.displayName : "loading"}</Text>
	        	<Image
	          		style={{ width: 50, height: 50 }}
	          		source={{ uri: this.state.user ? this.state.user.photoURL : "https://www.argentum.org/wp-content/uploads/2018/12/blank-profile-picture-973460_6404.png" }}
	        	/>
	        	<Button title="Sign Out" onPress={this.signOut} />
	        	<View style={{height: 50}}/>
	        	<Button title="Test Hello" onPress={this.hello} />
	        </View>
  		);
	}
}

RightScreen.navigationOptions = {
  title: 'app.json',
};

module.exports= RightScreen