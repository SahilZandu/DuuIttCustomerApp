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
      });

      const newa = remoteMessage.notification;

      data = remoteMessage?.data;
      // await notifee.displayNotification(newa);
      if (remoteMessage?.data?.route == 'chat') {
        let chatData = JSON.parse(remoteMessage?.data?.notification_data ?? {});
        console.log('chatData notification', chatData);
        DeviceEventEmitter.emit('chatData', chatData);
        if (chatNotificationStatus === true) {
          await notifee.displayNotification(newa);
        }
      } else {
        // console.log('JSON.parse notification',JSON.parse(remoteMessage?.data?.notification_data));
        await notifee.displayNotification(newa);
        if (remoteMessage?.data?.route == "searchingRide") {
          let acceptedDetails = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          setAddParcelInfo(acceptedDetails)
          console.log('JSON.parse searchingRide notification', acceptedDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('newOrder', acceptedDetails)
        }

        if (remoteMessage?.data?.route == "home") {
          let cancelDetails = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          setAddParcelInfo(cancelDetails)
          console.log('JSON.parse cancelDetails notification', cancelDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('cancelOrder', cancelDetails)
        }
        if (remoteMessage?.data?.route == "picked") {
          let pickedDetails = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          setAddParcelInfo(pickedDetails)
          console.log('JSON.parse picked notification', pickedDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('picked', pickedDetails)
        }
        if (remoteMessage?.data?.route == "dropped") {
          let droppedDetails = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          //  setAddParcelInfo({})
          console.log('JSON.parse notification', droppedDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('dropped', droppedDetails)
        }

        if (remoteMessage?.data?.route == "foodOrderReadyToPickup") {
          let acceprtFoodOrderDetails = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          console.log('acceprtFoodOrderDetails notification', acceprtFoodOrderDetails);
          DeviceEventEmitter.emit('acceptedFoodOrder', acceprtFoodOrderDetails)
        }
        if (remoteMessage?.data?.route == "foodOrderPicked") {
          let pickupFoodOrderDetails = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          console.log('pickupFoodOrderDetails notification', pickupFoodOrderDetails);
          DeviceEventEmitter.emit('picked', pickupFoodOrderDetails)
        }
        if (remoteMessage?.data?.route == "foodOrderCompleted") {
          let droppedFoodOrderDetails = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          console.log('droppedFoodOrderDetails notification', droppedFoodOrderDetails);
          DeviceEventEmitter.emit('dropped', droppedFoodOrderDetails)
        }

        if (remoteMessage?.data?.route == "foodOrderStatusUpdate") {
          let foodOrderStatusUpdate = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          console.log('foodOrderStatusUpdate notification', foodOrderStatusUpdate);
          DeviceEventEmitter.emit('foodOrderUpdate', foodOrderStatusUpdate)
        }

        if (remoteMessage?.data?.route == "foodOrderCooking") {
          let foodOrderCooking = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          console.log('foodOrderCooking notification', foodOrderCooking);
          // DeviceEventEmitter.emit('picked', pickupFoodOrderDetails)
          DeviceEventEmitter.emit('foodOrderUpdate', foodOrderCooking)
        }
        if (remoteMessage?.data?.route == "foodOrderPacking") {
          let foodOrderPacking = JSON.parse(remoteMessage?.data?.notification_data ?? {})
          console.log('foodOrderPacking notification', foodOrderPacking);
          // DeviceEventEmitter.emit('dropped', droppedFoodOrderDetails)
          DeviceEventEmitter.emit('foodOrderUpdate', foodOrderPacking)
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
        let notificationData = JSON.parse(detail.notification?.data?.notification_data)
        const route = (notificationData?.order_type) == 'parcel' ? 'parcel' : notificationData?.order_type == 'ride' ? "ride" : "food"

        if (detail?.notification?.data?.route == "searchingRide") {
          let acceptedDetails = JSON.parse(detail.notification?.data?.notification_data ?? {})
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
          let cancelDetails = JSON.parse(detail.notification?.data?.notification_data ?? {})
          setAddParcelInfo(cancelDetails)
          console.log('cancelDetails notification cancelOrder', cancelDetails);
          // navigation.navigate(route, { screen: 'home' });
          navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
          DeviceEventEmitter.emit('cancelOrder', cancelDetails)
        }
        if (detail?.notification?.data?.route == "picked") {
          let pickedDetails = JSON.parse(detail.notification?.data?.notification_data ?? {})
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
          let droppedDetails = JSON.parse(detail.notification?.data?.notification_data ?? {})
          setAddParcelInfo({})
          console.log('notification dropped', droppedDetails);
          // navigation.navigate(route, { screen: 'home' });
          navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
          DeviceEventEmitter.emit('dropped', droppedDetails)
        }
        if (detail?.notification?.data?.route == 'chat') {
          let chatData = JSON.parse(detail.notification?.data?.notification_data ?? {});
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

        if (detail?.notification?.data?.route == "foodOrderReadyToPickup") {
          let acceprtFoodOrderDetails = JSON.parse(detail?.notification?.data?.notification_data ?? {})
          console.log('acceprtFoodOrderDetails notification', acceprtFoodOrderDetails);
          DeviceEventEmitter.emit('acceptedFoodOrder', acceprtFoodOrderDetails)
          navigation.navigate(route, { screen: 'trackingFoodOrderList' });
        }
        if (detail?.notification?.data?.route == "foodOrderPicked") {
          let pickupFoodOrderDetails = JSON.parse(detail?.notification?.data?.notification_data ?? {})
          console.log('pickupFoodOrderDetails notification', pickupFoodOrderDetails);
          DeviceEventEmitter.emit('picked', pickupFoodOrderDetails)
          navigation.navigate(route, { screen: 'trackingFoodOrderList' });
        }
        if (detail?.notification?.data?.route == "foodOrderCompleted") {
          let droppedFoodOrderDetails = JSON.parse(detail?.notification?.data?.notification_data ?? {})
          console.log('droppedFoodOrderDetails notification', droppedFoodOrderDetails);
          DeviceEventEmitter.emit('dropped', droppedFoodOrderDetails)
          navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
        }

        if (detail?.notification?.data?.route == "foodOrderStatusUpdate") {
          let foodOrderStatusUpdate = JSON.parse(detail?.notification?.data?.notification_data ?? {})
          console.log('foodOrderStatusUpdate notification', foodOrderStatusUpdate);
          DeviceEventEmitter.emit('foodOrderUpdate', foodOrderStatusUpdate)
          navigation.navigate(route, { screen: 'trackingFoodOrderList' });
        }

        if (detail?.notification?.data?.route == "foodOrderCooking") {
          let foodOrderCooking = JSON.parse(detail?.notification?.data?.notification_data ?? {})
          console.log('foodOrderCooking notification', foodOrderCooking);
          DeviceEventEmitter.emit('foodOrderUpdate', foodOrderCooking)
          navigation.navigate(route, { screen: 'trackingFoodOrderList' });
        }
        if (detail?.notification?.data?.route == "foodOrderPacking") {
          let foodOrderPacking = JSON.parse(detail?.notification?.data?.notification_data ?? {})
          console.log('foodOrderPacking notification', foodOrderPacking);
          DeviceEventEmitter.emit('foodOrderUpdate', foodOrderPacking)
          navigation.navigate(route, { screen: 'trackingFoodOrderList' });
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
    // let route = data?.order_type == 'parcel' ? 'parcel' : "ride"
    const route = data?.order_type == 'parcel' ? 'parcel' : data?.order_type == 'ride' ? "ride" : "food"
    if (routeType === "searchingRide") {
      let acceptedDetails = JSON.parse(notification?.payload?.notification_data ?? {})
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
      let cancelDetails = JSON.parse(notification?.payload?.notification_data ?? {})
      setAddParcelInfo(cancelDetails)
      console.log('cancelDetails notification cancelOrder', cancelDetails);
      // navigation.navigate(route, { screen: 'home' });
      navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
      DeviceEventEmitter.emit('cancelOrder', cancelDetails)
    }
    if (routeType === "picked") {
      let pickedDetails = JSON.parse(notification?.payload?.notification_data ?? {})
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
      let droppedDetails = JSON.parse(notification?.payload?.notification_data ?? {})
      //  setAddParcelInfo({})
      console.log('notification dropped', droppedDetails);
      // navigation.navigate(route, { screen: 'home' });
      navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
      DeviceEventEmitter.emit('dropped', droppedDetails)
    }

    if (routeType === 'chat') {
      let chatData = JSON.parse(notification?.payload?.notification_data ?? {});
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

    if (routeType == "foodOrderReadyToPickup") {
      let acceprtFoodOrderDetails = JSON.parse(notification?.payload?.notification_data ?? {})
      console.log('acceprtFoodOrderDetails notification', acceprtFoodOrderDetails);
      DeviceEventEmitter.emit('acceptedFoodOrder', acceprtFoodOrderDetails)
      navigation.navigate(route, { screen: 'trackingFoodOrderList' });
    }
    if (routeType == "foodOrderPicked") {
      let pickupFoodOrderDetails = JSON.parse(notification?.payload?.notification_data ?? {})
      console.log('pickupFoodOrderDetails notification', pickupFoodOrderDetails);
      DeviceEventEmitter.emit('picked', pickupFoodOrderDetails)
      navigation.navigate(route, { screen: 'trackingFoodOrderList' });
    }
    if (routeType == "foodOrderCompleted") {
      let droppedFoodOrderDetails = JSON.parse(notification?.payload?.notification_data ?? {})
      console.log('droppedFoodOrderDetails notification', droppedFoodOrderDetails);
      DeviceEventEmitter.emit('dropped', droppedFoodOrderDetails)
      navigation.navigate('dashborad', { screen: 'tab3', params: { tabText: 'All Orders' } });
    }

    if (routeType == "foodOrderStatusUpdate") {
      let foodOrderStatusUpdate = JSON.parse(notification?.payload?.notification_data ?? {})
      console.log('foodOrderStatusUpdate notification', foodOrderStatusUpdate);
      DeviceEventEmitter.emit('foodOrderUpdate', foodOrderStatusUpdate)
      navigation.navigate(route, { screen: 'trackingFoodOrderList' });
    }

    if (routeType == "foodOrderCooking") {
      let foodOrderCooking = JSON.parse(notification?.payload?.notification_data ?? {})
      console.log('foodOrderCooking notification', foodOrderCooking);
      DeviceEventEmitter.emit('foodOrderUpdate', foodOrderCooking)
      navigation.navigate(route, { screen: 'trackingFoodOrderList' });
    }

    if (routeType == "foodOrderPacking") {
      let foodOrderPacking = JSON.parse(notification?.payload?.notification_data ?? {})
      console.log('foodOrderPacking notification', foodOrderPacking);
      DeviceEventEmitter.emit('foodOrderUpdate', foodOrderPacking)
      navigation.navigate(route, { screen: 'trackingFoodOrderList' });
    }



  }

  return 'register Notification';
}
