import { AsyncStorage } from 'react-native';

const LAST_BALLOT_TIMESTAMP_KEY = 'lastBallotDate';

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