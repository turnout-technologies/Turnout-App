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

const DropStack = createStackNavigator(
  {
    Drop: DropScreen
  },
  {
    headerMode: 'none',
  }
);

DropStack.navigationOptions = {
  tabBarLabel: 'Drop',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'parachute-box'} />
  ),
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
      <TabBarIcon focused={focused} name={'turnout'} />
    ),
    tabBarVisible
  });

};

const InviteStack = createStackNavigator(
  {
    Invite: InviteScreen
  }
);

InviteStack.navigationOptions = {
  tabBarLabel: 'Invite',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-contacts'} />
  ),
};

const ProfileStack = createStackNavigator(
  {
    Right: ProfileScreen,
    Feedback: FeedbackScreen,
    About: AboutScreen,
    //Invite: InviteScreen,
    Licenses: LicensesScreen,
    //Drop: DropScreen
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
    DropStack,
    HomeStack,
    InviteStack,
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
