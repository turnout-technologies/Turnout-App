import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import TurboVoteScreen from '../screens/TurboVoteScreen';
import NameScreen from '../screens/NameScreen';

const VoterInfoStack = createStackNavigator(
	{
		TurboVote: TurboVoteScreen,
		Name: NameScreen
	}
);

export default VoterInfoStack;