import * as firebase from 'firebase';
import axios from 'axios';

import getEnvVars from './auth/environment';

const env = getEnvVars();

axios.defaults.baseURL = env.apiUrl;
axios.interceptors.request.use(async config => {
	config.headers["Authorization"] = "Bearer " + await firebase.auth().currentUser.getIdToken();
	return config
}, (error) => {
 return Promise.reject(error)
})

//axios.defaults.headers.common = {'Authorization': 'Bearer ' + token};


export function hello() {
	return axios.get("/hello");
}

export function addUser(name, email, phone) {
	return axios.post("/users", {
	    name: name,
	    email: email,
	    phone: phone
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