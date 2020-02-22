import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';


import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStackNavigator,
    Main: MainTabNavigator,
  })
);
