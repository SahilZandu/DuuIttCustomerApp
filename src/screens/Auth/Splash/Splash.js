import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image,} from 'react-native';
import {appImages} from '../../../commons/AppImages';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {rootStore} from '../../../stores/rootStore';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import { setCurrentLocation } from '../../../components/GetAppLocation';
import { colors } from '../../../theme/colors';


export default function Splash({navigation}) {


  async function requestUserPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission settings:', settings);
    } else {
      console.log('User declined permissions');
    }
  }


  useEffect(() => {
    requestUserPermission();
    setCurrentLocation()
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
    backgroundColor:colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
