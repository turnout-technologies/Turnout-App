import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

import './src/Globals.js';
import * as Env from './src/Environment';
import AppNavigator from './src/navigation/AppNavigator';

if (!firebase.apps.length) {
    firebase.initializeApp(Env.getFirebaseConfig());
}

Sentry.init({
  dsn: Constants.manifest.extra.SentryDSN,
  environment: Env.getEnvName(),
  //enableInExpoDevelopment: true,
  //debug: true
});

export default function App(props) {
  if (!__DEV__ && Constants.manifest.releaseChannel != "dev") {
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
        autoHideSplash={false}
      />
    );
  } else {
    return (
        <PaperProvider theme={global.CURRENT_THEME}>
          <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00000080" translucent={true} />
            <AppNavigator />
          </View>
        </PaperProvider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/google_logo.png'),
      require('./assets/images/logo_icon.png'),
      require('./assets/images/logo_icon_grey.png'),
      require('./assets/images/logo_text.png'),
      require('./assets/images/md-contact.png')
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
  Sentry.captureException(err);
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