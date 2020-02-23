import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';


export default function TabBarIcon(props) {
  if (props.name === "md-checkbox") {
  	return (
		<Image
		    source={props.focused ? require('../../assets/images/logo_icon.png') : require('../../assets/images/logo_icon_grey.png')}
		    style={{width: 25}}
		    resizeMode="contain"
	  	/>
  	);
  }
  return (
    <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? global.CURRENT_THEME.colors.primary : global.CURRENT_THEME.colors.text_opacity5}
    />
  );
}