import {StyleSheet} from 'react-native';
import { DefaultTheme } from 'react-native-paper';

//THEMES
const MainTheme = {
	...DefaultTheme,
  	colors: {
    	...DefaultTheme.colors,
    	primary: "#0CBAE3",
    	accent: "#FFFFFF",
    	background: "#FFFFFF",
    	text: "#707070"
  	},
  	roundness: 30
};

global.CURRENT_THEME = MainTheme;

//STYLES
const GlobalStyles = StyleSheet.create({

    headerStyle: {
		backgroundColor: global.CURRENT_THEME.colors.primary,
		elevation: 0
	},

	headerTintColor: global.CURRENT_THEME.colors.accent,

	backLayerContainer: {
    	flex: 1,
    	backgroundColor: global.CURRENT_THEME.colors.primary
  	},

  	frontLayerContainer: {
	    flex: 1,
	    backgroundColor: global.CURRENT_THEME.colors.background,
	    borderTopLeftRadius: global.CURRENT_THEME.roundness,
	    borderTopRightRadius: global.CURRENT_THEME.roundness,
  	}

});
export {GlobalStyles}

