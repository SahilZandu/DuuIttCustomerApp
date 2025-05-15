import React, { useState, useEffect } from 'react';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
// import RNRestart from 'react-native-restart';
import { Alert, DeviceEventEmitter, AppState } from 'react-native';
import { rootStore } from '../stores/rootStore';

let data = {};

export function useNotifications(navigation) {
  const { setAddParcelInfo } = rootStore.parcelStore;

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const channelId = await notifee.createChannel({
        id: 'duuittcustomer.com',
        name: 'duuitt',
        priority: 'high',

      });

      (remoteMessage.notification.android = {
        channelId: channelId,
        smallIcon: 'ic_launcher', // Uses the app icon
        largeIcon: 'ic_launcher', // Uses the app icon
        // color: '#FFFFFF', // Optional: Sets the accent color
      }),
        console.log('forground notification:', remoteMessage);
      const newa = remoteMessage.notification;

      data = remoteMessage?.data;

      if (remoteMessage?.data?.route == 'chat') {
        let chatData = JSON.parse(remoteMessage?.data?.notification_data);
        console.log('chatData notification', chatData);
        DeviceEventEmitter.emit('chatData', chatData);
      } else {
        // console.log('JSON.parse notification',JSON.parse(remoteMessage?.data?.notification_data));
        await notifee.displayNotification(newa);

        if (remoteMessage?.data?.route == "searchingRide") {
          let acceptedDetails = JSON.parse(remoteMessage?.data?.notification_data)
          setAddParcelInfo(acceptedDetails)
          console.log('JSON.parse searchingRide notification', acceptedDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('newOrder', acceptedDetails)
        }

        if (remoteMessage?.data?.route == "home") {
          let cancelDetails = JSON.parse(remoteMessage?.data?.notification_data)
          setAddParcelInfo(cancelDetails)
          console.log('JSON.parse cancelDetails notification', cancelDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('cancelOrder', cancelDetails)
        }
        if (remoteMessage?.data?.route == "picked") {
          let pickedDetails = JSON.parse(remoteMessage?.data?.notification_data)
          setAddParcelInfo(pickedDetails)
          console.log('JSON.parse picked notification', pickedDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('picked', pickedDetails)
        }
        if (remoteMessage?.data?.route == "dropped") {
          let droppedDetails = JSON.parse(remoteMessage?.data?.notification_data)
          //  setAddParcelInfo({})
          console.log('JSON.parse notification', droppedDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('dropped', droppedDetails)
        }
      }

    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().setBackgroundMessageHandler(
  //     async remoteMessage => {
  //       const channelId = await notifee.createChannel({
  //       id: 'duuittcustomer.com',
  //       name: 'duuitt',
  //       priority: 'high',
  //       });
  //       (remoteMessage.notification.android = {
  //         channelId: channelId,
  //       }),
  //         console.log('background notification:testing', remoteMessage);
  //       // await notifee.incrementBadgeCount();
  //       // console.log('JSON.parse notification',JSON.parse(remoteMessage?.data?.notification_data));
  //       if (remoteMessage?.data?.route == "searchingRide") {
  //         let acceptedDetails = JSON.parse(remoteMessage?.data?.notification_data)
  //         setAddParcelInfo(acceptedDetails)
  //         console.log('JSON.parse searchingRide notification',acceptedDetails);
  //         // navigation.navigate('newOrder');
  //         DeviceEventEmitter.emit('newOrder', acceptedDetails)
  //        } 

  //        if (remoteMessage?.data?.route == "home") {
  //         let cancelDetails = JSON.parse(remoteMessage?.data?.notification_data)
  //          setAddParcelInfo(cancelDetails)
  //          console.log('JSON.parse cancelDetails notification',cancelDetails);
  //          DeviceEventEmitter.emit('cancelOrder', cancelDetails)
  //        } 
  //        if (remoteMessage?.data?.route == "picked") {
  //         let pickedDetails = JSON.parse(remoteMessage?.data?.notification_data)
  //          setAddParcelInfo(pickedDetails)
  //          console.log('JSON.parse picked notification',pickedDetails);
  //          DeviceEventEmitter.emit('picked', pickedDetails)
  //        } 

  //        if (remoteMessage?.data?.route == "dropped") {
  //         let droppedDetails = JSON.parse(remoteMessage?.data?.notification_data)
  //         //  setAddParcelInfo({})
  //          console.log('JSON.parse notification',droppedDetails);
  //          DeviceEventEmitter.emit('dropped', droppedDetails)
  //        } 

  //     },
  //   );
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const unsubscribe = notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('User pressed notification', detail.notification);
      // console.log('User pressed notification', detail.notification,type,EventType.PRESS);
      if (type === EventType.PRESS) {
        console.log('User pressed notification', detail.notification);
        detail.notification.data = data;
        const route = data?.order_type == 'parcel' ? 'parcel' : "ride"
        if (detail?.notification?.data?.route == "searchingRide") {
          let acceptedDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(acceptedDetails)
          console.log('searchingRide notification newOrder', acceptedDetails);
          navigation.navigate(route, { screen: 'searchingRide' })
          DeviceEventEmitter.emit('newOrder', acceptedDetails)
        }

        if (detail?.notification?.data?.route == "home") {
          let cancelDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(cancelDetails)
          console.log('cancelDetails notification cancelOrder', cancelDetails);
          navigation.navigate(route, { screen: 'home' });
          DeviceEventEmitter.emit('cancelOrder', cancelDetails)
        }
        if (detail?.notification?.data?.route == "picked") {
          let pickedDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(pickedDetails)
          console.log('picked notification picked', pickedDetails);
          if (route == "ride") {
            navigation.navigate(route, { screen: 'searchingRide' });
          } else {
            navigation.navigate(route, { screen: 'trackingOrder' });
          }
          DeviceEventEmitter.emit('picked', pickedDetails)
        }

        if (detail?.notification?.data?.route == "dropped") {
          let droppedDetails = JSON.parse(detail.notification?.data?.notification_data)
          //  setAddParcelInfo({})
          console.log('notification dropped', droppedDetails);
          navigation.navigate(route, { screen: 'home' });
          DeviceEventEmitter.emit('dropped', droppedDetails)
        }

        if (detail?.notification?.data?.route == 'chat') {
          let chatData = JSON.parse(detail.notification?.data?.notification_data);
          setAddParcelInfo(chatData)
          console.log('chatPage notification', chatData);
          if (route == "ride") {
            navigation.navigate(route, { screen: 'searchingRide' });
          } else {
            navigation.navigate(route, { screen: 'trackingOrder' });
          }
          DeviceEventEmitter.emit('chatPage', chatData);
        }

      }
    });
    return unsubscribe;
  }, []);


  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('User pressed notification', detail.notification);
        detail.notification.data = data;
        const route = data?.order_type == 'parcel' ? 'parcel' : "ride"

        if (detail?.notification?.data?.route == "searchingRide") {
          let acceptedDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(acceptedDetails)
          console.log('searchingRide notification newOrder', acceptedDetails);
          navigation.navigate(route, { screen: 'searchingRide' })
          DeviceEventEmitter.emit('newOrder', acceptedDetails)
        }

        if (detail?.notification?.data?.route == "home") {
          let cancelDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(cancelDetails)
          console.log('cancelDetails notification cancelOrder', cancelDetails);
          navigation.navigate(route, { screen: 'home' });
          DeviceEventEmitter.emit('cancelOrder', cancelDetails)
        }
        if (detail?.notification?.data?.route == "picked") {
          let pickedDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(pickedDetails)
          console.log('picked notification picked', pickedDetails);
          if (route == "ride") {
            navigation.navigate(route, { screen: 'searchingRide' });
          } else {
            navigation.navigate(route, { screen: 'trackingOrder' });
          }
          DeviceEventEmitter.emit('picked', pickedDetails)
        }

        if (detail?.notification?.data?.route == "dropped") {
          let droppedDetails = JSON.parse(detail.notification?.data?.notification_data)
          //  setAddParcelInfo({})
          console.log('notification dropped', droppedDetails);
          navigation.navigate(route, { screen: 'home' });
          DeviceEventEmitter.emit('dropped', droppedDetails)
        }
        if (detail?.notification?.data?.route == 'chat') {
          let chatData = JSON.parse(detail.notification?.data?.notification_data);
          setAddParcelInfo(chatData)
          console.log('chatPage notification', chatData);
          if (route == "ride") {
            navigation.navigate(route, { screen: 'searchingRide' });
          } else {
            navigation.navigate(route, { screen: 'trackingOrder' });
          }
          DeviceEventEmitter.emit('chatPage', chatData);
        }
      }
    });
    return unsubscribe;
  }, []);

  return 'register Notification';
}
