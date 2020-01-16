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
    	text: "#707070",
    	text_opacity3: 'rgba(112,112, 112, 0.3)'
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
    	text_opacity3: 'rgba(6,35,67,0.3)'
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
  	}

});
export {GlobalStyles}

//Sample Questions
global.SAMPLE_QUESTIONS = [
	{
		questionId: 0,
		questionText: "This is the text for question 1?",
		questionAnswers: [
			{ answerId: 0, answerText: "This is the first answer to the first question" },
			{ answerId: 1, answerText: "This is the second answer to the first question. It's longer than the rest." },
			{ answerId: 2, answerText: "This is the third answer to the first question" },
			{ answerId: 3, answerText: "This is the fourth answer to the first question" },

		]
	},
	{
		questionId: 1,
		questionText: "This is the text for question 2?",
		questionAnswers: [
			{ answerId: 0, answerText: "This is the first answer to the second question" },
			{ answerId: 1, answerText: "This is the second answer to the second question. It's longer than the rest." },
			{ answerId: 2, answerText: "This is the third answer to the second question" },
			{ answerId: 3, answerText: "This is the fourth answer to the second question" },

		]
	},
	{
		questionId: 2,
		questionText: "This is the text for question 3?",
		questionAnswers: [
			{ answerId: 0, answerText: "This is the first answer to the third question" },
			{ answerId: 1, answerText: "This is the second answer to the third question. It's longer than the rest." },
			{ answerId: 2, answerText: "This is the third answer to the third question" },
			{ answerId: 3, answerText: "This is the fourth answer to the third question" },

		]
	},
	{
		questionId: 3,
		questionText: "This is the text for question 4?",
		questionAnswers: [
			{ answerId: 0, answerText: "This is the first answer to the fourth question" },
			{ answerId: 1, answerText: "This is the second answer to the fourth question. It's longer than the rest." },
			{ answerId: 2, answerText: "This is the third answer to the fourth question" },
			{ answerId: 3, answerText: "This is the fourth answer to the fourth question" },

		]
	}
]