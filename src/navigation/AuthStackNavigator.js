import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';

const AuthStack = createStackNavigator(
	{
		Onboarding: OnboardingScreen,
		SignIn: SignInScreen
	},
	{
    	headerMode: 'none',
    	initialRouteName: "Onboarding",
  	}
);

export default AuthStack;