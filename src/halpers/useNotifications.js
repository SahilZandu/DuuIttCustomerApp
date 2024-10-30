import React, {useState, useEffect} from 'react';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
// import {rootStore} from '../stores/rootStore';
// import RNRestart from 'react-native-restart';
// import {Alert, DeviceEventEmitter,AppState} from 'react-native'; 

let data = {};

export function useNotifications(navigation) {
//   const {setOrg, appOrg} = rootStore.commonStore;

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const channelId = await notifee.createChannel({
        id: 'duuittcustomer.com',
        name: 'duuitt',
        priority: 'high',
      });

      (remoteMessage.notification.android = {
        channelId: channelId,
      }),
        console.log('forground notification:', remoteMessage);
      const newa = remoteMessage.notification;

    //   data = remoteMessage?.data;

      // const noti = newa.notification.data = remoteMessage.data

    //   if (remoteMessage?.data?.route == 'newOrder') {
    //     navigation.navigate('newOrder');
    //   }
    //    else {
    //     if(remoteMessage?.data?.route == 'orderhistory'){
    //       DeviceEventEmitter.emit('refreshOrderStatus', true)
    //     }
        //  notifee.displayNotification(newa);
    //     }

      notifee.displayNotification(newa);

      // if (remoteMessage.data.id == 'FL-V-12'   || remoteMessage.data.id == "FL-V-25" || remoteMessage.data.id == "FL-V-19") {
      //   DeviceEventEmitter.emit('refreshOrgStep', 'refresh');
      // }

    //   DeviceEventEmitter.emit('refreshOrgStep', 'refresh');

    //   if (remoteMessage?.data?.route == 'changeStatus') {
    //     rootStore.authStore.logout(navigation);
    //   }

    //   if (remoteMessage?.data?.route == 'changePers') {
    //     Alert.alert(
    //       'Alert',
    //       'Your account permissions has been updated. Please login again.',
    //       [
    //         {
    //           text: 'OK',
    //           onPress: () => {
    //             rootStore.authStore.logoutWithRestart();
    //           },
    //         },
    //       ],
    //       // {cancelable: false}
    //     );
    //   }
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().setBackgroundMessageHandler(
  //     async remoteMessage => {
  //       const channelId = await notifee.createChannel({
  //         id: 'foodlemon.com',
  //         name: 'foodlemon',
  //         priority: 'high',
  //       });
  //       (remoteMessage.notification.android = {
  //         channelId: channelId,
  //       }),
  //         console.log('background notification:testing', remoteMessage);
  //       // data = remoteMessage?.data;
  //       // notifee.displayNotification(remoteMessage.notification);
  //       // await notifee.incrementBadgeCount();
  //     },
  //   );
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    //   body: 'Custom sound',
    //   ios: {
    //     // iOS resource (.wav, aiff, .caf)
    //     sound: 'countdown.mp3',
    //     critical: true,
    //     interruptionLevel: 'timeSensitive',
    //     criticalVolume: 0.9,
    //   },
    // });

    const unsubscribe = notifee.onBackgroundEvent(async ({type, detail}) => { 
      console.log('User pressed notification', detail.notification);
      // console.log('User pressed notification', detail.notification,type,EventType.PRESS);
      if (type === EventType.PRESS) {
        console.log('User pressed notification', detail.notification);
        // detail.notification.data = data;
        // if (detail?.notification?.data?.route) {
        //   console.log(JSON.parse(detail?.notification?.data?.data));
        //   let org =
        //     detail?.notification?.data?.data &&
        //     detail?.notification?.data?.data != 'null'
        //       ? JSON.parse(detail?.notification?.data?.data)
        //       : null;

        //   if (org) {
        //     setOrg(
        //       detail?.notification?.data?.route == 'addoffer' ? appOrg : org,
        //     );
        //   }

         
        //   if (detail?.notification?.data?.route == 'timeManagement') {
        //     navigation.navigate('restaurant');
        //   } else if (
        //     detail?.notification?.data?.route == 'offers' ||
        //     detail?.notification?.data?.route == 'addoffer'
        //   ) {
        //     navigation.navigate('tab4');
        //   } else if (detail?.notification?.data?.route == 'product') {
        //     navigation.navigate('tab1');
        //   } else if (detail?.notification?.data?.route == 'profile') {
        //     navigation.navigate('profile');
        //   } else if (detail?.notification?.data?.route == 'newOrder') {
        //     navigation.navigate('tab3');
        //   } else if (detail?.notification?.data?.route == 'orderhistory') {
        //     navigation.navigate('orderHis');
        //   }
        // }
      }
    });
    return unsubscribe;
  }, []);

 

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log('User pressed notification', detail.notification);
        // detail.notification.data = data;
        // if (detail?.notification?.data?.route) {
        //   console.log(JSON.parse(detail?.notification?.data?.data));
        //   let org =
        //     detail?.notification?.data?.data &&
        //     detail?.notification?.data?.data != 'null'
        //       ? JSON.parse(detail?.notification?.data?.data)
        //       : null;
        //   if (org) {
        //     setOrg(
        //       detail?.notification?.data?.route == 'addoffer' ? appOrg : org,
        //     );
        //   }

        
        //  if (detail?.notification?.data?.route == 'timeManagement') {
        //     navigation.navigate('restaurant');
        //   } else if (
        //     detail?.notification?.data?.route == 'offers' ||
        //     detail?.notification?.data?.route == 'addoffer'
        //   ) {
        //     navigation.navigate('tab4');
        //   } else if (detail?.notification?.data?.route == 'product') {
        //     navigation.navigate('tab1');
        //   } else if (detail?.notification?.data?.route == 'profile') {
        //     navigation.navigate('profile');
        //   } else if (detail?.notification?.data?.route == 'newOrder') {
        //     navigation.navigate('tab3');
        //   } else if (detail?.notification?.data?.route == 'orderhistory') {
        //     navigation.navigate('orderHis');
        //   }
        // }
      }
    });
    return unsubscribe;
  }, []);

  return 'register Notification';
}
