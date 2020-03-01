import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import {DeviceEventEmitter } from 'react-native';

import {setUser} from './AsyncStorage';
import * as API from './APIClient';

//const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

export async function getPushNotificationsTokenAsync() {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    alert('No notification permissions!');
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return token;
}

 export async function setupNotificationChannels() {
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('poll-notifications', {
        name: 'Poll Notifications',
        sound: true,
        priority: "max",
        vibrate: true,
      });
    }
  }

  function sendPushToken(enable, token) {
    API.putPushToken(global.user.id, token)
      .then(function(response) {
        global.user.pushToken=token;
        setUser();
        DeviceEventEmitter.emit('notificationsEnabledChangedListener',  {enabled: enable});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  export async function setNotificationsEnabled(enable) {
    if (enable) {
      getPushNotificationsTokenAsync()
        .then(function(token) {
          sendPushToken(enable, token);
        })
        .catch(function (error) {
          console.log(error);
        });
    }  else {
      sendPushToken(enable, "");
    }
  }