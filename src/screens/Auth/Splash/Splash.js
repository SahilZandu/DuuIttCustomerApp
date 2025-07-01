import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, } from 'react-native';
import { appImages } from '../../../commons/AppImages';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { rootStore } from '../../../stores/rootStore';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { setCurrentLocation } from '../../../components/GetAppLocation';
import { colors } from '../../../theme/colors';


export default function Splash({ navigation }) {
  const { setToken,setAppUser} = rootStore.commonStore;
  async function requestUserPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission settings:', settings);
    } else {
      console.log('User declined permissions');
    }
  }


  useEffect(() => {
    setToken("cwVapDEYR8S2nv5CbVwv-t:APA91bFV5FTZRX3CxdPEBW4nZc9PxtraIYg3L_Lc0F4-JLuDDmKV-6jRBU6SCt0jx3sqyxHH38AwZn8ifAmOWtHyJqO_XkE-JVY6o9Bqt_P_NQ7nJawpWsk")
    setAppUser({
      "__v": 0,
      "_id": "685cdb5ab4c055504dbefa6e",
      "addresses": [
          [Object
          ]
      ],
      "createdAt": "2025-06-26T05:32:10.587Z",
      "date_of_birth": "2013-06-26T00:00:00.000Z",
      "device_id": "8e0c94cc73df4403",
      "email": "ayan@gmail.com",
      "fcm_token": "cwVapDEYR8S2nv5CbVwv-t:APA91bFV5FTZRX3CxdPEBW4nZc9PxtraIYg3L_Lc0F4-JLuDDmKV-6jRBU6SCt0jx3sqyxHH38AwZn8ifAmOWtHyJqO_XkE-JVY6o9Bqt_P_NQ7nJawpWsk",
      "gender": "male",
      "isDeleted": false,
      "isVerified": true,
      "lastLogin": "2025-06-26T05:32:10.598Z",
      "name": "Ayan malik",
      "noOfTries": 0,
      "password": "",
      "phone": 9876543222,
      "profile_pic": "public/uploads/customer/685cdb5ab4c055504dbefa6e/profile/profile_pic-1750933090812-763470547.png",
      "updatedAt": "2025-06-26T10:46:38.792Z"
  })
    requestUserPermission();
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
