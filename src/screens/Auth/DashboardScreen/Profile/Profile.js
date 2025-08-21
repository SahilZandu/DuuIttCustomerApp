import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DeviceEventEmitter, Text, View, } from 'react-native';
import { styles } from './styles';
import Header from '../../../../components/header/Header';
import ProfileForm from '../../../../forms/ProfileForm';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';
import { Wrapper } from '../../../../halpers/Wrapper';


export default function Profile({ navigation, route }) {
  const [internet, setInternet] = useState(true);
  const { screenName } = route.params;

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

    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      onPress={()=>{navigation.goBack()}}
      title={'Edit Profile'}
       backArrow={true}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header 
      onPress={()=>{navigation.goBack()}}
      title={'Edit Profile'}
       backArrow={true} /> */}
        {internet == false ? (
          <NoInternet />
        ) : (
          <>
            <ProfileForm navigation={navigation} screenName={screenName} />
          </>
        )}
      </View>
    </Wrapper>
  );

}
