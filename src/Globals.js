import {StyleSheet, Platform, Alert} from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import * as firebase from 'firebase';
var moment = require('moment-timezone');

import {setUser, setLastRefreshUserTimestamp} from './AsyncStorage';
import * as API from './APIClient';

//constants
global.IOS = Platform.OS === 'ios';

//USER INFO
/*global.user = {
    "avatarURL": "",
    "createdAt": 0,
    "email": "",
    "id": "",
    "name": "",
    "points": 0,
    "pushToken": "",

};*/

//THEMES
const MainTheme = {
	...DefaultTheme,
  	colors: {
    	...DefaultTheme.colors,
    	primary: "#0CBAE3",
        primary_75: "#86e4f9",
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

export async function refreshUser() {
    try {
        var response = await API.getUser();
        if (response.data) {
            response.data.name = response.data.firstName + " " + response.data.lastName;
            global.user = response.data;
            console.log(global.user)
            setUser();
            setLastRefreshUserTimestamp(moment().unix());
        }
    } catch(error) {
        firebase.auth().signOut();
        Alert.alert("Error Getting User Data", "You've been signed out. Please sign in again.");
        console.log(error);
    }
}


//Dummy Data

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
		{ id: "1", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:800 },
		{ id: "2", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:800 },
		{ id: "3", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:770 },
		{ id: "4", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:770 },
		{ id: "5", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:700 },
		{ id: "6", name: "Person Name", avatarURL: "https://i.pravatar.cc/150", points:700 },
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

//Dummy Result:
global.RESULTS_DATA = {
    "date": 1582498800,
    "id": "f6a3c5f0-56bc-11ea-a9e9-2742320751ba",
    "questions": [
        {
            "title": "Hijavco ji seuju revi ihizaf?",
            "id": "f6a3ed00-56bc-11ea-a9e9-2742320751ba",
            "createdAt": 1582518018,
            "answers": [
                {
                    "text": "Wa zic.",
                    "id": "f6a3ed01-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "id": "f6a3ed02-56bc-11ea-a9e9-2742320751ba",
                    "text": "Ejuika julirju."
                },
                {
                    "text": "Agineti fiwuzru.",
                    "id": "f6a3ed03-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Fonide fegiuda.",
                    "id": "f6a3ed04-56bc-11ea-a9e9-2742320751ba"
                }
            ]
        },
        {
            "id": "f6a41410-56bc-11ea-a9e9-2742320751ba",
            "createdAt": 1582518018,
            "answers": [
                {
                    "text": "Dur kuzdoc.",
                    "id": "f6a41411-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Vehte offupuk.",
                    "id": "f6a41412-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Vosci dotil.",
                    "id": "f6a43b20-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Otabocmej gutla.",
                    "id": "f6a43b21-56bc-11ea-a9e9-2742320751ba"
                }
            ],
            "title": "Bekeziva etawumuh ukpi ap wil?"
        },
        {
            "id": "f6a43b22-56bc-11ea-a9e9-2742320751ba",
            "createdAt": 1582518018,
            "answers": [
                {
                    "text": "Alaafadeb pifpipe.",
                    "id": "f6a43b23-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Wajaccu arcep.",
                    "id": "f6a43b24-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Zoz wo.",
                    "id": "f6a43b25-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Efikaina uro.",
                    "id": "f6a43b26-56bc-11ea-a9e9-2742320751ba"
                }
            ],
            "title": "Co lopfev vi saivijip omaewiw?"
        },
        {
            "id": "f6a43b27-56bc-11ea-a9e9-2742320751ba",
            "createdAt": 1582518018,
            "answers": [
                {
                    "id": "f6a43b28-56bc-11ea-a9e9-2742320751ba",
                    "text": "Heg pialu."
                },
                {
                    "id": "f6a43b29-56bc-11ea-a9e9-2742320751ba",
                    "text": "Siig uvebowju."
                },
                {
                    "text": "Voijoluh buekjov.",
                    "id": "f6a43b2a-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Cobiro ki.",
                    "id": "f6a43b2b-56bc-11ea-a9e9-2742320751ba"
                }
            ],
            "title": "Jafo izse nocuaw mudhec punvo?"
        },
        {
            "title": "Sej oniub uzuotudu asotad omeul?",
            "id": "f6a43b2c-56bc-11ea-a9e9-2742320751ba",
            "createdAt": 1582518018,
            "answers": [
                {
                    "text": "Lekwodazi hiz.",
                    "id": "f6a43b2d-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Unore najvu.",
                    "id": "f6a43b2e-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "text": "Uf diwi.",
                    "id": "f6a43b2f-56bc-11ea-a9e9-2742320751ba"
                },
                {
                    "id": "f6a43b30-56bc-11ea-a9e9-2742320751ba",
                    "text": "Ul remvesa."
                }
            ]
        }
    ],
    // question_id: { "answer_id": <count>, ... }
    "aggregate": {
        "f6a43b2c-56bc-11ea-a9e9-2742320751ba": {
            "f6a43b2e-56bc-11ea-a9e9-2742320751ba": 16,
            "f6a43b2f-56bc-11ea-a9e9-2742320751ba": 10,
            "f6a43b30-56bc-11ea-a9e9-2742320751ba": 16,
            "f6a43b2d-56bc-11ea-a9e9-2742320751ba": 9
        },
        "f6a3ed00-56bc-11ea-a9e9-2742320751ba": {
            "f6a3ed03-56bc-11ea-a9e9-2742320751ba": 12,
            "f6a3ed02-56bc-11ea-a9e9-2742320751ba": 12,
            "f6a3ed01-56bc-11ea-a9e9-2742320751ba": 12,
            "f6a3ed04-56bc-11ea-a9e9-2742320751ba": 15
        },
        "f6a43b22-56bc-11ea-a9e9-2742320751ba": {
            "f6a43b24-56bc-11ea-a9e9-2742320751ba": 10,
            "f6a43b26-56bc-11ea-a9e9-2742320751ba": 17,
            "f6a43b25-56bc-11ea-a9e9-2742320751ba": 9,
            "f6a43b23-56bc-11ea-a9e9-2742320751ba": 15
        },
        "f6a43b27-56bc-11ea-a9e9-2742320751ba": {
            "f6a43b28-56bc-11ea-a9e9-2742320751ba": 8,
            "f6a43b2a-56bc-11ea-a9e9-2742320751ba": 17,
            "f6a43b2b-56bc-11ea-a9e9-2742320751ba": 11,
            "f6a43b29-56bc-11ea-a9e9-2742320751ba": 15
        },
        "f6a41410-56bc-11ea-a9e9-2742320751ba": {
            "f6a41411-56bc-11ea-a9e9-2742320751ba": 10,
            "f6a41412-56bc-11ea-a9e9-2742320751ba": 12,
            "f6a43b21-56bc-11ea-a9e9-2742320751ba": 16,
            "f6a43b20-56bc-11ea-a9e9-2742320751ba": 13
        }
    },
    // question_id: ["answer_id", ...] if there are multiple winning answers
    "winningAnswers": {
        "f6a43b2c-56bc-11ea-a9e9-2742320751ba": [
            "f6a43b2e-56bc-11ea-a9e9-2742320751ba",
            "f6a43b30-56bc-11ea-a9e9-2742320751ba"
        ],
        "f6a3ed00-56bc-11ea-a9e9-2742320751ba": [
            "f6a3ed04-56bc-11ea-a9e9-2742320751ba"
        ],
        "f6a43b22-56bc-11ea-a9e9-2742320751ba": [
            "f6a43b26-56bc-11ea-a9e9-2742320751ba"
        ],
        "f6a43b27-56bc-11ea-a9e9-2742320751ba": [
            "f6a43b2a-56bc-11ea-a9e9-2742320751ba"
        ],
        "f6a41410-56bc-11ea-a9e9-2742320751ba": [
            "f6a43b21-56bc-11ea-a9e9-2742320751ba"
        ]
    },
    "userPoints": 1,
    "response": {
        "f6a43b2c-56bc-11ea-a9e9-2742320751ba": "f6a43b2f-56bc-11ea-a9e9-2742320751ba",
        "f6a43b27-56bc-11ea-a9e9-2742320751ba": "f6a43b29-56bc-11ea-a9e9-2742320751ba",
        "f6a41410-56bc-11ea-a9e9-2742320751ba": "f6a43b21-56bc-11ea-a9e9-2742320751ba",
        "userId": "DtI7puD3g9MSbEp41oZ9XSPmtJh2",
        "f6a3ed00-56bc-11ea-a9e9-2742320751ba": "f6a3ed01-56bc-11ea-a9e9-2742320751ba",
        "f6a43b22-56bc-11ea-a9e9-2742320751ba": "f6a43b25-56bc-11ea-a9e9-2742320751ba"
    }
}