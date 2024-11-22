import React, {useEffect, useState, useRef, useCallback} from 'react';
import {DeviceEventEmitter, Text, View,} from 'react-native';
import {styles} from './styles';
import Header from '../../../../components/header/Header';
import ProfileForm from '../../../../forms/ProfileForm';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';


export default function Profile({navigation}) {
  const [internet, setInternet] = useState(true);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      checkInternet();
    }, []),
  );

  useEffect(() => {
    DeviceEventEmitter.addListener('profile', event => {
      console.log('event----profile', event);
      if (event != 'noInternet') {
      }
      setInternet(event == 'noInternet' ? false : true);
      console.log('internet event');
    });
  }, []);

  const checkInternet = () => {
    fetch().then(state => {
      // console.log("state -- checkInternet ",state);
      setInternet(state.isInternetReachable);
    });
  };

  return (
    <View style={styles.container}>
      <Header 
      onPress={()=>{navigation.goBack()}}
      title={'Edit Profile'}
       backArrow={true} />
        {internet == false ? (
        <NoInternet/>
      ) : (
        <>
     <ProfileForm navigation={navigation} />
     </>
     )}
    </View>
  );

}
