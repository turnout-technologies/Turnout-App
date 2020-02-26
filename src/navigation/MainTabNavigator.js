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
import DebugOptionsScreen from '../screens/DebugOptionsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

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

LeftStack.path = '';

const MiddleStack = createStackNavigator(
  {
    Middle: MiddleScreen,
    Question: QuestionScreen,
    Results: ResultsScreen
  },
  config
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

MiddleStack.path = '';

const RightStack = createStackNavigator(
  {
    Right: RightScreen,
    DebugOptions: DebugOptionsScreen
  },
  config
);

RightStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-contact'} />
  ),
};

RightStack.path = '';

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

tabNavigator.path = '';

const styles = StyleSheet.create({
});

export default tabNavigator;
