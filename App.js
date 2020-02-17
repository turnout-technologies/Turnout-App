import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';
import * as firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';


if (!firebase.apps.length) {
    firebase.initializeApp(Constants.manifest.extra.firebaseConfig);
}

Sentry.init({
  dsn: Constants.manifest.extra.SentryDSN,
  //enableInExpoDevelopment: true,
  //debug: true
});

import './Globals.js';
import getEnvVars from './auth/environment';

export default function App(props) {
  if (!__DEV__) {
    console.log = () => {};
  } else {
    console.log("DEV Mode")
  }
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
        <PaperProvider theme={global.CURRENT_THEME}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        </PaperProvider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/logo_text.png'),
      require('./assets/images/google_logo.png'),
    ]),
    Font.loadAsync({
      'circularstd-book': require('./assets/fonts/CircularStd-Book.ttf'),
      'circularstd-medium': require('./assets/fonts/CircularStd-Medium.ttf'),
      'circularstd-bold': require('./assets/fonts/CircularStd-Bold.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});