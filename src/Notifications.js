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
    alert("You need to grant notification permissions first.");
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

  async function sendPushToken(enable, token) {
    try {
      var response = await API.putPushToken(token);
      global.user.pushToken=token;
      setUser();
      DeviceEventEmitter.emit('notificationsEnabledChangedListener',  {enabled: enable});
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  export async function setNotificationsEnabled(enable) {
    var token = "";
    if (enable) {
      try {
        token = await getPushNotificationsTokenAsync();
        if (!token) {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    if (!enable || (enable && !!token)) {
      var success = await sendPushToken(enable, token);
      if (!success) {
        alert("Error updating push notifications settings");
      }
      return success;
    } else {
      return enable;
    }
  }