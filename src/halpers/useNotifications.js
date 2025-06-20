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
import { Notifications } from 'react-native-notifications';

let data = {};

export function useNotifications(navigation) {
  const { setAddParcelInfo } = rootStore.parcelStore;
  const { chatNotificationStatus } = rootStore.chatStore;

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { chatNotificationStatus } = rootStore.chatStore;
      console.log('forground notification:', remoteMessage);
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
      });
      // const androidNotification = {
      //   ...remoteMessage.notification,
      //   android: {
      //     channelId: channelId,
      //     smallIcon: 'ic_launcher',
      //     largeIcon: 'ic_launcher',
      //   },
      // };

      const newa = remoteMessage.notification;

      data = remoteMessage?.data;

      if (remoteMessage?.data?.route == 'chat') {
        let chatData = JSON.parse(remoteMessage?.data?.notification_data);
        console.log('chatData notification', chatData);
        DeviceEventEmitter.emit('chatData', chatData);
        if (chatNotificationStatus === true) {
          await notifee.displayNotification(newa);
        }
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

  // useEffect(() => {
  //   const unsubscribe = notifee.onBackgroundEvent(async ({ type, detail }) => {
  //     console.log('User pressed notification', detail.notification);
  //     // console.log('User pressed notification', detail.notification,type,EventType.PRESS);
  //     if (type === EventType.PRESS) {
  //       console.log('User pressed notification', detail.notification);
  //       detail.notification.data = data;
  //       const route = data?.order_type == 'parcel' ? 'parcel' : "ride"
  //       if (detail?.notification?.data?.route == "searchingRide") {
  //         let acceptedDetails = JSON.parse(detail.notification?.data?.notification_data)
  //         setAddParcelInfo(acceptedDetails)
  //         console.log('searchingRide notification newOrder', acceptedDetails);
  //         navigation.navigate(route, { screen: 'searchingRide' })
  //         DeviceEventEmitter.emit('newOrder', acceptedDetails)
  //       }

  //       if (detail?.notification?.data?.route == "home") {
  //         let cancelDetails = JSON.parse(detail.notification?.data?.notification_data)
  //         setAddParcelInfo(cancelDetails)
  //         console.log('cancelDetails notification cancelOrder', cancelDetails);
  //         navigation.navigate(route, { screen: 'home' });
  //         DeviceEventEmitter.emit('cancelOrder', cancelDetails)
  //       }
  //       if (detail?.notification?.data?.route == "picked") {
  //         let pickedDetails = JSON.parse(detail.notification?.data?.notification_data)
  //         setAddParcelInfo(pickedDetails)
  //         console.log('picked notification picked', pickedDetails);
  //         if (route == "ride") {
  //           navigation.navigate(route, { screen: 'searchingRide' });
  //         } else {
  //           navigation.navigate(route, { screen: 'trackingOrder' });
  //         }
  //         DeviceEventEmitter.emit('picked', pickedDetails)
  //       }

  //       if (detail?.notification?.data?.route == "dropped") {
  //         let droppedDetails = JSON.parse(detail.notification?.data?.notification_data)
  //         //  setAddParcelInfo({})
  //         console.log('notification dropped', droppedDetails);
  //         navigation.navigate(route, { screen: 'home' });
  //         DeviceEventEmitter.emit('dropped', droppedDetails)
  //       }

  //       if (detail?.notification?.data?.route == 'chat') {
  //         let chatData = JSON.parse(detail.notification?.data?.notification_data);
  //         setAddParcelInfo(chatData)
  //         console.log('chatPage notification', chatData);
  //         if (route == "ride") {
  //           navigation.navigate(route, { screen: 'searchingRide' });
  //         } else {
  //           navigation.navigate(route, { screen: 'trackingOrder' });
  //         }
  //         DeviceEventEmitter.emit('chatPage', chatData);
  //       }

  //     }
  //   });
  //   return unsubscribe;
  // }, []);


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
          navigation.navigate(route, {
            screen: 'searchingRide', params: {
              paymentMethod: '',
              totalAmount: 0
            }
          })
          DeviceEventEmitter.emit('newOrder', acceptedDetails)
        }

        if (detail?.notification?.data?.route == "home") {
          let cancelDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(cancelDetails)
          console.log('cancelDetails notification cancelOrder', cancelDetails);
          // navigation.navigate(route, { screen: 'home' });
          navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
          DeviceEventEmitter.emit('cancelOrder', cancelDetails)
        }
        if (detail?.notification?.data?.route == "picked") {
          let pickedDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo(pickedDetails)
          console.log('picked notification picked', pickedDetails);
          if (route == "ride") {
            navigation.navigate(route, {
              screen: 'searchingRide', params: {
                paymentMethod: '',
                totalAmount: 0
              }
            });
          } else {
            navigation.navigate(route, { screen: 'trackingOrder' });
          }
          DeviceEventEmitter.emit('picked', pickedDetails)
        }

        if (detail?.notification?.data?.route == "dropped") {
          let droppedDetails = JSON.parse(detail.notification?.data?.notification_data)
          setAddParcelInfo({})
          console.log('notification dropped', droppedDetails);
          // navigation.navigate(route, { screen: 'home' });
          navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
          DeviceEventEmitter.emit('dropped', droppedDetails)
        }
        if (detail?.notification?.data?.route == 'chat') {
          let chatData = JSON.parse(detail.notification?.data?.notification_data);
          setAddParcelInfo(chatData)
          console.log('chatPage notification', chatData);
          if (route == "ride") {
            navigation.navigate(route, {
              screen: 'searchingRide', params: {
                paymentMethod: '',
                totalAmount: 0
              }
            });
          } else if ((route == "parcel" && chatData?.status == "accepted")) {
            navigation.navigate(route, {
              screen: 'searchingRide', params: {
                paymentMethod: '',
                totalAmount: 0
              }
            });
          }
          else {
            navigation.navigate(route, { screen: 'trackingOrder' });
          }
          DeviceEventEmitter.emit('chatPage', chatData);
        }
      }
    });
    return unsubscribe;
  }, []);


  // ✅ Handle Background & Killed App Touch Event

  useEffect(() => {
    const backgroundNotificationListener = Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log("🔔 Notification Tapped (Foreground/Background):", notification);
      handleNotificationTap(notification, navigation);
      completion();
    });

    // 🔹 2. Handle notifications when the app is COMPLETELY CLOSED (killed)
    Notifications.getInitialNotification()
      .then(notification => {
        if (notification) {
          console.log("📩 App Launched from Notification (Killed State):", notification);
          handleNotificationTap(notification, navigation);
        }
      })
      .catch(err => console.error("Error getting initial notification:", err));

    return () => backgroundNotificationListener.remove(); // Cleanup
  }, []);

  // ✅ Notification Tap Handler

  const handleNotificationTap = (notification, navigation) => {
    console.log("route---", notification,);
    const routeType = notification?.payload?.route;
    // console.log("route---", route);
    let data = JSON.parse(notification?.payload?.notification_data)
    let route = data?.order_type == 'parcel' ? 'parcel' : "ride"
    if (routeType === "searchingRide") {
      let acceptedDetails = JSON.parse(notification?.payload?.notification_data)
      setAddParcelInfo(acceptedDetails)
      console.log('searchingRide notification newOrder', acceptedDetails);
      navigation.navigate(route, {
        screen: 'searchingRide', params: {
          paymentMethod: '',
          totalAmount: 0
        }
      })
      DeviceEventEmitter.emit('newOrder', acceptedDetails)
    }

    if (routeType === "home") {
      let cancelDetails = JSON.parse(notification?.payload?.notification_data)
      setAddParcelInfo(cancelDetails)
      console.log('cancelDetails notification cancelOrder', cancelDetails);
      // navigation.navigate(route, { screen: 'home' });
      navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
      DeviceEventEmitter.emit('cancelOrder', cancelDetails)
    }
    if (routeType === "picked") {
      let pickedDetails = JSON.parse(notification?.payload?.notification_data)
      setAddParcelInfo(pickedDetails)
      console.log('picked notification picked', pickedDetails);
      if (route == "ride") {
        navigation.navigate(route, {
          screen: 'searchingRide', params: {
            paymentMethod: '',
            totalAmount: 0
          }
        });
      } else {
        navigation.navigate(route, { screen: 'trackingOrder' });
      }
      DeviceEventEmitter.emit('picked', pickedDetails)
    }

    if (routeType === "dropped") {
      let droppedDetails = JSON.parse(notification?.payload?.notification_data)
      //  setAddParcelInfo({})
      console.log('notification dropped', droppedDetails);
      // navigation.navigate(route, { screen: 'home' });
      navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
      DeviceEventEmitter.emit('dropped', droppedDetails)
    }

    if (routeType === 'chat') {
      let chatData = JSON.parse(notification?.payload?.notification_data);
      setAddParcelInfo(chatData)
      console.log('chatPage notification', chatData);
      if (route == "ride") {
        navigation.navigate(route, {
          screen: 'searchingRide', params: {
            paymentMethod: '',
            totalAmount: 0
          }
        });
      }
      else if ((route == "parcel" && chatData?.status == "accepted")) {
        navigation.navigate(route, {
          screen: 'searchingRide', params: {
            paymentMethod: '',
            totalAmount: 0
          }
        });
      }
      else {
        navigation.navigate(route, { screen: 'trackingOrder' });
      }
      DeviceEventEmitter.emit('chatPage', chatData);
    }



  }

  return 'register Notification';
}
