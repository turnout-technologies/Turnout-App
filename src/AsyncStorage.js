import { AsyncStorage } from 'react-native';

const USER_KEY = 'user';
const LAST_REFRESH_USER_TIMESTAMP = 'lastRefreshUserTimestamp';
const LAST_BALLOT_TIMESTAMP_KEY = 'lastBallotDate';

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
  return AsyncStorage.getItem(LAST_REFRESH_USER_TIMESTAMP);
}

export async function setLastRefreshUserTimestamp(timestamp) {
  try {
    await AsyncStorage.setItem(LAST_REFRESH_USER_TIMESTAMP, timestamp.toString());
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