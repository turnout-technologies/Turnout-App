import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import LeftScreen from '../screens/LeftScreen';
import MiddleScreen from '../screens/MiddleScreen';
import RightScreen from '../screens/RightScreen';
import QuestionScreen from '../screens/QuestionScreen';
import ResultsScreen from '../screens/ResultsScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AboutScreen from '../screens/AboutScreen';
import LicensesScreen from '../screens/LicensesScreen';
import DebugOptionsScreen from '../screens/DebugOptionsScreen';

const LeftStack = createStackNavigator(
  {
    Left: LeftScreen,
  },
  {
    headerMode: 'none',
  }
);

LeftStack.navigationOptions = {
  tabBarLabel: 'Leaderboard',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-trophy'} />
  )
};

const MiddleStack = createStackNavigator(
  {
    Middle: MiddleScreen,
    Question: QuestionScreen,
    Results: ResultsScreen
  }
);

MiddleStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = navigation.state.index == 0;
  return ({
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={'md-checkbox'} />
    ),
    tabBarVisible
  });

};

const RightStack = createStackNavigator(
  {
    Right: RightScreen,
    Feedback: FeedbackScreen,
    About: AboutScreen,
    Licenses: LicensesScreen,
    DebugOptions: DebugOptionsScreen
  }
);

RightStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-contact'} />
  ),
};

const tabNavigator = createBottomTabNavigator(
  {
    LeftStack,
    MiddleStack,
    RightStack,
  },
  {
    initialRouteName: "MiddleStack",
    tabBarOptions: {
      activeTintColor: global.CURRENT_THEME.colors.primary
    }
  }
);

export default tabNavigator;
