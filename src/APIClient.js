import * as firebase from 'firebase';
import axios from 'axios';
import * as Sentry from 'sentry-expo';

import * as Env from './Environment';

const successHandler = (response) => {
  	return response
}

const errorHandler = (error) => {
  	Sentry.captureException(error.response);
  	return Promise.reject({ ...error })
}

axios.defaults.baseURL = Env.getAPIUrl();
axios.interceptors.request.use(async config => {
	config.headers["Authorization"] = "Bearer " + await firebase.auth().currentUser.getIdToken();
	return config
}, (error) => {
 return Promise.reject(error)
})

axios.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
)

export function addUser(name, email, avatarURL, pushToken) {
	return axios.post("/users", {
	    name: name,
	    email: email,
	    avatarURL: avatarURL,
	    pushToken: pushToken
	 });
}

export function getUser(uid) {
	return axios.get("/users/"+uid);
}

export function putPushToken(uid, token) {
	return axios.put("/users/"+uid+"/push-token", {pushToken: token});
}

export function getLeaderboard() {
	return axios.get("/users/leaderboard");
}

export function getBallotToday() {
	return axios.get("/ballots/today");
}

export function submitBallot(ballotId, userId, questionResponse) {
	return axios.post("/ballots/today/"+ballotId, {
	    userId: userId,
	    response: questionResponse
	 });
}

export function getLatestBallotResults() {
	return axios.get("/ballots/latest/results");
}

export function sendFeedback(type, message, filename, name, email) {
	return axios.post("/contact", {
	    type: type,
	    message: message,
	    filename: filename,
	    name: name,
	    email: email
	 });
}