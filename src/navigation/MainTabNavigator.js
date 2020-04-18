import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuestionScreen from '../screens/QuestionScreen';
import ResultsScreen from '../screens/ResultsScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AboutScreen from '../screens/AboutScreen';
import InviteScreen from '../screens/InviteScreen';
import LicensesScreen from '../screens/LicensesScreen';
import DropScreen from '../screens/DropScreen';

const LeaderboardStack = createStackNavigator(
  {
    Left: LeaderboardScreen,
  },
  {
    headerMode: 'none',
  }
);

LeaderboardStack.navigationOptions = {
  tabBarLabel: 'Leaderboard',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-trophy'} />
  )
};

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Question: QuestionScreen,
    Results: ResultsScreen
  }
);

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = navigation.state.index == 0;
  return ({
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={'md-checkbox'} />
    ),
    tabBarVisible
  });

};

const ProfileStack = createStackNavigator(
  {
    Right: ProfileScreen,
    Feedback: FeedbackScreen,
    About: AboutScreen,
    Invite: InviteScreen,
    Licenses: LicensesScreen,
    Drop: DropScreen
  }
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-contact'} />
  ),
};

const tabNavigator = createBottomTabNavigator(
  {
    LeaderboardStack,
    HomeStack,
    ProfileStack,
  },
  {
    initialRouteName: "HomeStack",
    tabBarOptions: {
      activeTintColor: global.CURRENT_THEME.colors.primary
    }
  }
);

export default tabNavigator;
