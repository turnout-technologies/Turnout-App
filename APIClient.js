import * as firebase from 'firebase';
import axios from 'axios';
import * as Sentry from 'sentry-expo';

import getEnvVars from './auth/environment';

const env = getEnvVars();

const successHandler = (response) => {
  	return response
}

const errorHandler = (error) => {
  	Sentry.captureException(error.response);
  	return Promise.reject({ ...error })
}

axios.defaults.baseURL = env.apiUrl;
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


export function hello() {
	return axios.get("/hello");
}

export function addUser(name, email, phone, avatarURL) {
	return axios.post("/users", {
	    name: name,
	    email: email,
	    phone: phone,
	    avatarURL: avatarURL
	 });
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