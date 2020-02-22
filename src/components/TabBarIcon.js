import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? global.CURRENT_THEME.colors.primary : global.CURRENT_THEME.colors.text_opacity5}
    />
  );
}