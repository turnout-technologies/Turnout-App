import Constants from "expo-constants";
import { Platform } from "react-native";

import * as AsyncStorage from './AsyncStorage';

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 	// What is __DEV__ ?
 	// This variable is set to true when react-native is running in Dev mode.
 	// __DEV__ is true when run locally, but false when published.
	if (__DEV__ || env === 'dev') {
   		return Constants.manifest.extra.dev;
 	} else {
   		return Constants.manifest.extra.prod;
	}
};

const _isDevEnv = __DEV__ || Constants.manifest.releaseChannel === 'dev';

export function isDevEnv() {
	return _isDevEnv;
}

envConfig = getEnvVars();

export function getFirebaseConfig() {
	return envConfig.firebaseConfig;
}

export async function getAPIHostname() {
	if (isDevEnv) {
		var savedHostname = await AsyncStorage.getServerHostname();
		return !!savedHostname ? savedHostname : envConfig.apiUrl;
	}
	return envConfig.apiUrl;
}

export function getEnvName() {
	return Constants.manifest.releaseChannel;
}