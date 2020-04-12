import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';


import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import NoteScreen from '../screens/NoteScreen';
import AuthStackNavigator from './AuthStackNavigator';
import VoterInfoStackNavigator from './VoterInfoStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import DebugOptionsScreen from '../screens/DebugOptionsScreen';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Note: NoteScreen,
    Auth: AuthStackNavigator,
    VoterInfo: VoterInfoStackNavigator,
    Main: MainTabNavigator,
    DebugOptions: DebugOptionsScreen
  })
);
