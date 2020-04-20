import { AsyncStorage } from 'react-native';

const USER_KEY = 'user';
const LAST_REFRESH_USER_TIMESTAMP_KEY = 'lastRefreshUserTimestamp';
const LAST_BALLOT_TIMESTAMP_KEY = 'lastBallotDate';
const LAST_VERSION_OPENED_KEY = 'lastVersionOpened';
const LAST_BALLOT_RESULTS_OPENED_KEY = 'lastBallotResultOpenedId';
const BALLOT_RESULT_KEY = 'ballotResult';
const DROP_KEY = 'drop';
const SERVER_HOSTNAME_KEY = 'serverHostName';

//USER
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

export async function removeUser() {
  global.user = null;
  return AsyncStorage.removeItem(USER_KEY);
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

//BALLOT
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

export async function getLastBallotResultOpenedId() {
  return AsyncStorage.getItem(LAST_BALLOT_RESULTS_OPENED_KEY);
}

export async function setLastBallotResultOpenedId(id) {
  try {
    await AsyncStorage.setItem(LAST_BALLOT_RESULTS_OPENED_KEY, id.toString());
  } catch (error) {
    console.log(error);
  }
}

export async function getBallotResult() {
  return AsyncStorage.getItem(BALLOT_RESULT_KEY);
}

export async function setBallotResult(ballotResult) {
  try {
    await AsyncStorage.setItem(BALLOT_RESULT_KEY, JSON.stringify(ballotResult));
  } catch (error) {
    console.log(error);
  }
}

//DROP
export async function getDrop() {
  return AsyncStorage.getItem(DROP_KEY);
}

export async function setDrop(drop) {
  try {
    await AsyncStorage.setItem(DROP_KEY, JSON.stringify(drop));
  } catch (error) {
    console.log(error);
  }
}

//MISC
export async function getLastNoteVersionOpened() {
  return AsyncStorage.getItem(LAST_VERSION_OPENED_KEY);
}

export async function setLastNoteVersionOpened(noteVersion) {
  try {
    await AsyncStorage.setItem(LAST_VERSION_OPENED_KEY, noteVersion.toString());
  } catch (error) {
    console.log(error);
  }
}

export async function removeLastNoteVersionOpened() {
  return AsyncStorage.removeItem(LAST_VERSION_OPENED_KEY);
}

export async function setServerHostname(hostname) {
  try {
    await AsyncStorage.setItem(SERVER_HOSTNAME_KEY, hostname);
  } catch (error) {
    console.log(error);
  }
}

export async function getServerHostname() {
  return AsyncStorage.getItem(SERVER_HOSTNAME_KEY);
}