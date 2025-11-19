import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, PermissionsAndroid, Platform, } from 'react-native';
import { appImages } from '../../../commons/AppImages';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { rootStore } from '../../../stores/rootStore';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { setCurrentLocation } from '../../../components/GetAppLocation';
import { colors } from '../../../theme/colors';
import {
  check,
  request,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';


export default function Splash({ navigation }) {

  // async function requestUserPermission() {
  //   const settings = await notifee.requestPermission();

  //   if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
  //     console.log('Permission settings:', settings);
  //   } else {
  //     console.log('User declined permissions');
  //   }
  // }

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


  useEffect(() => {
    // requestUserPermission();
    RequestPermission();
    setCurrentLocation()
    setTimeout(() => {
      const { token, appUser } = rootStore.commonStore;
      console.log('appUser splash', appUser, token);
      const route = token?.length > 0 ? 'dashborad' : 'auth';
      if (token?.length > 0) {
        if (appUser?.name && appUser?.name?.length > 0) {
          navigation.navigate(route, { screen: 'home' });
        } else {
          navigation.navigate('auth', {
            screen: 'personalInfo',
            params: {
              loginType: appUser?.email?.length > 0 ? 'Email' : 'Mobile',
            }
          });
        }

      } else {
        navigation.navigate(route, { screen: 'login' });
      }
    }, 4000);
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        resizeMode="contain"
        style={{ width: wp('100%'), height: hp('100%') }}
        source={appImages.splashBg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
