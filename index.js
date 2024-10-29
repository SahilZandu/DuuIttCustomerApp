/**
 * @format
 */

 import {AppRegistry,Text,TextInput} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 import messaging from '@react-native-firebase/messaging';
// import notifee, {
//   AndroidImportance,
//   AndroidCategory,
//   EventType,
// } from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // global.isBackGround = true
  // global.notificationData = remoteMessage?.data
  // await notifee.incrementBadgeCount();
});
 
 AppRegistry.registerComponent(appName, () => App);
 if (Text.defaultProps == null) {
     Text.defaultProps = {};
     Text.defaultProps.allowFontScaling = false;
   }
   if (TextInput.defaultProps == null) {
     TextInput.defaultProps = {};
     TextInput.defaultProps.allowFontScaling = false;
   }