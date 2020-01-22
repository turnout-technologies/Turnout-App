import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import LeftScreen from '../screens/LeftScreen';
import MiddleScreen from '../screens/MiddleScreen';
import RightScreen from '../screens/RightScreen';
import QuestionScreen from '../screens/QuestionScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const LeftStack = createStackNavigator(
  {
    Left: LeftScreen,
  },
  config
);

LeftStack.navigationOptions = {
  tabBarLabel: 'Rewards',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'store'} />
  ),
};

LeftStack.path = '';

const MiddleStack = createStackNavigator(
  {
    Middle: MiddleScreen,
    Question: QuestionScreen
  },
  config
);

MiddleStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = navigation.state.index == 0;
  return ({
    tabBarLabel: 'Turnout',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={'check-box'} />
    ),
    tabBarVisible
  });

};

MiddleStack.path = '';

const RightStack = createStackNavigator(
  {
    Right: RightScreen,
  },
  config
);

RightStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'account-circle'} />
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
    initialRouteName: "MiddleStack"
  }
);

tabNavigator.path = '';

const styles = StyleSheet.create({
});

export default tabNavigator;
