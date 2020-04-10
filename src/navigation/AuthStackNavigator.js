import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import SignInScreen from '../screens/SignInScreen';

const AuthStack = createStackNavigator(
	{
		SignIn: SignInScreen
	},
	{
    	headerMode: 'none',
  	}
);

export default AuthStack;