import {StyleSheet, Platform} from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import * as firebase from 'firebase';

//constants
global.IOS = Platform.OS === 'ios';

//USER INFO
var user = null;

export function getUser() {
	if (user == null) {
		user = firebase.auth().currentUser;
	}
	return user;
}

export function setUser(curUser) {
	user = curUser;
}

//THEMES
const MainTheme = {
	...DefaultTheme,
  	colors: {
    	...DefaultTheme.colors,
    	primary: "#0CBAE3",
    	accent: "#FFFFFF",
    	background: "#FFFFFF",
    	text: "#707070",
    	text_opacity3: 'rgba(112,112, 112, 0.3)',
    	text_opacity5: 'rgba(112,112, 112, 0.5)'
  	},
  	roundness: 30
};
const UMich = {
	...DefaultTheme,
  	colors: {
    	...DefaultTheme.colors,
    	primary: "#062343",
    	accent: "#ffcf02",
    	background: "#FFFFFF",
    	text: "#062343",
    	text_opacity3: 'rgba(6,35,67,0.3)',
    	text_opacity5: 'rgba(6,35,67,0.5)'
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
	backLayerContainer: {
    	flex: 1,
    	backgroundColor: global.CURRENT_THEME.colors.primary
  	},

  	frontLayerContainer: {
	    flex: 1,
	    backgroundColor: global.CURRENT_THEME.colors.background,
	    borderTopLeftRadius: global.CURRENT_THEME.roundness,
	    borderTopRightRadius: global.CURRENT_THEME.roundness,
  	},
  	bodyText: {
  		fontFamily: 'circularstd-book',
  		color: global.CURRENT_THEME.colors.text
  	},
  	titleText: {
  		fontFamily: 'circularstd-medium',
  		color: global.CURRENT_THEME.colors.text
  	},
  	headerText: {
  		fontFamily: 'circularstd-bold',
  		color: global.CURRENT_THEME.colors.text
  	}

});
export {GlobalStyles}

//Sample Questions
global.SAMPLE_QUESTIONS =
{
	createdAt: 1580917462,
	date: null,
	id: "612f5990-482e-11ea-b8f4-f90e5695c36a",
	questions: [
		{
			id: 0,
			title: "This is the text for question 1?",
			answers: [
				{ id: 0, text: "This is the first answer to the first question" },
				{ id: 1, text: "This is the second answer to the first question. It's really a lot longer than the rest and tests that the question views scale properly. It would be a shame if they didn't.It's really a lot longer than the rest and tests that the question views scale properly. It would be a shame if they didn't.It's really a lot longer than the rest and tests that the question views scale properly. It would be a shame if they didn't." },
				{ id: 2, text: "This is the third answer to the first question" },
				{ id: 3, text: "This is the fourth answer to the first question" },

			]
		},
		{
			id: 1,
			title: "This is the text for question 2?",
			answers: [
				{ id: 0, text: "This is the first answer to the second question" },
				{ id: 1, text: "This is the second answer to the second question. It's longer than the rest." },
				{ id: 2, text: "This is the third answer to the second question" },
				{ id: 3, text: "This is the fourth answer to the second question" },

			]
		},
		{
			id: 2,
			title: "This is the text for question 3?",
			answers: [
				{ id: 0, text: "This is the first answer to the third question" },
				{ id: 1, text: "This is the second answer to the third question" },
				{ id: 2, text: "This is the third answer to the third question" },
				{ id: 3, text: "This is the fourth answer to the third question" },

			]
		},
		{
			id: 3,
			title: "This is the text for question 4?",
			answers: [
				{ id: 0, text: "This is the first answer to the fourth question" },
				{ id: 1, text: "This is the second answer to the fourth question. It's longer than the rest." },
				{ id: 2, text: "This is the third answer to the fourth question" },
				{ id: 3, text: "This is the fourth answer to the fourth question" },

			]
		}
	]
}

//Dummy Leaderboard
global.LEADERBOARD_DATA = {
	leaderboard: [
		{ id: "1", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:1000 },
		{ id: "2", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:900 },
		{ id: "3", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:800 },
		{ id: "4", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:700 },
		{ id: "5", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:600 },
		{ id: "6", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:500 },
		{ id: "7", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:400 },
		{ id: "8", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:300 },
		{ id: "9", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:200 },
		{ id: "10", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:100 },
		{ id: "11", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:90 },
		{ id: "12", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:80 },
		{ id: "13", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:70 },
		{ id: "14", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:60 },
		{ id: "15", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:50 },
		{ id: "16", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:40 },
		{ id: "17", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:30 },
		{ id: "18", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:20 },
		{ id: "19", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:10 },
		{ id: "20", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:5 },

	],
	self: { id: "21", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:1 }
}