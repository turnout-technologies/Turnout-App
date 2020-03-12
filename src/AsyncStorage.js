import { AsyncStorage } from 'react-native';

const USER_KEY = 'user';
const LAST_REFRESH_USER_TIMESTAMP_KEY = 'lastRefreshUserTimestamp';
const LAST_BALLOT_TIMESTAMP_KEY = 'lastBallotDate';
const LAST_VERSION_OPENED_KEY = 'lastVersionOpened';

export async function getUser() {
  return AsyncStorage.getItem(USER_KEY);
}

export async function setUser() {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(global.user));
  } catch (error) {
    console.log(error);
  }
}

export async function getLastRefreshUserTimestamp() {
  return AsyncStorage.getItem(LAST_REFRESH_USER_TIMESTAMP_KEY);
}

export async function setLastRefreshUserTimestamp(timestamp) {
  try {
    await AsyncStorage.setItem(LAST_REFRESH_USER_TIMESTAMP_KEY, timestamp.toString());
  } catch (error) {
    console.log(error);
  }
}

export async function setLastBallotTimestamp(date) {
  try {
    await AsyncStorage.setItem(LAST_BALLOT_TIMESTAMP_KEY, date);
  } catch (error) {
    console.log(error);
  }
}

export async function getLastBallotTimestamp() {
  return AsyncStorage.getItem(LAST_BALLOT_TIMESTAMP_KEY);
}

export async function removeLastBallotTimestamp() {
  return AsyncStorage.removeItem(LAST_BALLOT_TIMESTAMP_KEY);
}

export async function getLastVersionOpened() {
  return AsyncStorage.getItem(LAST_VERSION_OPENED_KEY);
}

export async function setLastVersionOpened(version) {
  try {
    await AsyncStorage.setItem(LAST_VERSION_OPENED_KEY, version);
  } catch (error) {
    console.log(error);
  }
}

export async function removeLastVersionOpened() {
  return AsyncStorage.removeItem(LAST_VERSION_OPENED_KEY);
}