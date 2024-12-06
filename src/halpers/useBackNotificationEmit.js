import React from 'react';
import {DeviceEventEmitter, Platform} from 'react-native';
import { rootStore } from '../stores/rootStore';


function handleBackNotification(remoteMessage) {
    const {setAddParcelInfo}=rootStore.parcelStore;
    
  console.log('remoteMessage--==--', remoteMessage);
          if (remoteMessage?.data?.route == "searchingRide") {
          let acceptedDetails = JSON.parse(remoteMessage?.data?.notification_data)
          setAddParcelInfo(acceptedDetails)
          console.log('JSON.parse searchingRide notification',acceptedDetails);
          // navigation.navigate('newOrder');
          DeviceEventEmitter.emit('newOrder', acceptedDetails)
         } 
  
         if (remoteMessage?.data?.route == "home") {
          let cancelDetails = JSON.parse(remoteMessage?.data?.notification_data)
           setAddParcelInfo(cancelDetails)
           console.log('JSON.parse cancelDetails notification',cancelDetails);
           DeviceEventEmitter.emit('cancelOrder', cancelDetails)
         } 
         if (remoteMessage?.data?.route == "picked") {
          let pickedDetails = JSON.parse(remoteMessage?.data?.notification_data)
           setAddParcelInfo(pickedDetails)
           console.log('JSON.parse picked notification',pickedDetails);
           DeviceEventEmitter.emit('picked', pickedDetails)
         } 
  
         if (remoteMessage?.data?.route == "dropped") {
          let droppedDetails = JSON.parse(remoteMessage?.data?.notification_data)
           console.log('JSON.parse notification',droppedDetails);
           DeviceEventEmitter.emit('dropped', droppedDetails)
         } 

 
}

export default handleBackNotification;