import Constants from "expo-constants";
import { Platform } from "react-native";

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 	// What is __DEV__ ?
 	// This variable is set to true when react-native is running in Dev mode.
 	// __DEV__ is true when run locally, but false when published.
	if (__DEV__ || env === 'dev') {
   		return Constants.manifest.extra.dev;
 	} else if (env === 'alpha') {
   		return Constants.manifest.extra.prod;
	} else {
		console.log("ERROR: Unrecognized Environment");
		return "";
	}
};

envConfig = getEnvVars();

export function getFirebaseConfig() {
	return envConfig.firebaseConfig;
}

export function getAPIUrl() {
	return envConfig.apiUrl;
}

export function getEnvName() {
	return Constants.manifest.releaseChannel;
}