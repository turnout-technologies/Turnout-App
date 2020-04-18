import * as firebase from 'firebase';
import axios from 'axios';
import * as Sentry from 'sentry-expo';

import * as Env from './Environment';

const turnoutAPIInstance = axios.create();

const successHandler = (response) => {
  	return response
}

const errorHandler = (error) => {
  	Sentry.captureException(error.response);
  	return Promise.reject({ ...error })
}

async function initAPI() {
	setBaseURL(await Env.getAPIHostname());
	turnoutAPIInstance.defaults.timeout = 5000;
	turnoutAPIInstance.interceptors.request.use(async config => {
		config.headers["Authorization"] = "Bearer " + await firebase.auth().currentUser.getIdToken();
		return config
	}, (error) => {
	 return Promise.reject(error)
	});

	turnoutAPIInstance.interceptors.response.use(
	  response => successHandler(response),
	  error => errorHandler(error)
	)
}
initAPI();

export function setBaseURL(url) {
	turnoutAPIInstance.defaults.baseURL = url + "/v1";
}

//USERS
export function addUser(user) {
	return turnoutAPIInstance.post("/users", user);
}

export function getUser() {
	return turnoutAPIInstance.get("/users/self");
}

export function putPushToken(token) {
	return turnoutAPIInstance.put("/users/self/push-token", {pushToken: token});
}

export function getLeaderboard() {
	return turnoutAPIInstance.get("/users/leaderboard");
}

export function turbovoteComplete() {
	return turnoutAPIInstance.put("/users/self/turbovote");
}

//BALLOTS
export function getBallotToday() {
	return turnoutAPIInstance.get("/ballots/today");
}

export function submitBallot(ballotId, userId, questionResponse) {
	return turnoutAPIInstance.post("/ballots/today/"+ballotId, {
	    userId: userId,
	    response: questionResponse
	 });
}

export function getLatestBallotResults() {
	return turnoutAPIInstance.get("/ballots/latest/results");
}

export function autocorrect(autocorrectInfo) {
	return turnoutAPIInstance.put("/ballots/latest/results/self", autocorrectInfo);
}

//DROPS
export function getLiveDrop() {
	return turnoutAPIInstance.get("/drops/live");
}