import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import NameScreen from '../screens/NameScreen';

const VoterInfoStack = createStackNavigator(
	{
		Name: NameScreen
	}
);

export default VoterInfoStack;