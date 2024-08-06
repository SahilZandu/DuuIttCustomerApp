import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, SafeAreaView} from 'react-native';
import {appImages} from '../../../commons/AppImages';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {rootStore} from '../../../stores/rootStore';

export default function Splash({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      const {token, appUser} = rootStore.commonStore;
      console.log('appUser splash', appUser, token);
      const route = token == 'true' ? 'dashborad' : 'auth';
      if (token == 'true') {
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
