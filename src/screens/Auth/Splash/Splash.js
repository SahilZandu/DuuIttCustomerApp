import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, SafeAreaView,PermissionsAndroid, Platform,Alert} from 'react-native';
import {appImages} from '../../../commons/AppImages';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {rootStore} from '../../../stores/rootStore';
import {
  check,
  request,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import { setCurrentLocation } from '../../../components/GetAppLocation';


export default function Splash({navigation}) {



  async function RequestPermission() {
    if (Platform.OS === 'android') {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      console.log('userResponse', userResponse);
      return userResponse;
    } else {
      Platform.OS === 'ios';
      {
        requestMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]).then(result => {
          console.log(result);
        });
      }
    }
  }

  async function requestUserPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission settings:', settings);
    } else {
      console.log('User declined permissions');
    }
  }

  // async function checkApplicationPermision() {
  //   const settings = await notifee.requestPermission();

  //   if (Platform.OS === 'android') {
  //     try {
  //       await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //       );
  //     } catch (error) {
        
  //     }
  //     console.log('Permission settings android:', settings);
  //   } else {
  //     console.log('User declined permissions android');
  //   }
  // }

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }





  useEffect(() => {
    // checkApplicationPermision();
    setCurrentLocation()
    // requestNotificationPermission()
    // RequestPermission();
    requestUserPermission();
    setTimeout(() => {
      const {token, appUser} = rootStore.commonStore;
      console.log('appUser splash', appUser, token);
      const route = token?.length > 0 ? 'dashborad' : 'auth';
      if (token?.length > 0) {
        navigation.navigate(route, {screen: 'home'});
      } else {
        navigation.navigate(route, {screen: 'login'});
      }
    }, 4000);
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        resizeMode="contain"
        style={{width: wp('100%'), height: hp('100%')}}
        source={appImages.splashBg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#28B056',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
