import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DeviceEventEmitter, StatusBar, Text, View, } from 'react-native';
import { styles } from './styles';
import Header from '../../../../components/header/Header';
import ProfileForm from '../../../../forms/ProfileForm';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';
import { Wrapper } from '../../../../halpers/Wrapper';
import { AppEvents } from '../../../../halpers/events/AppEvents';
import { rootStore } from '../../../../stores/rootStore';


export default function Profile({ navigation, route }) {
  const [internet, setInternet] = useState(true);
  const { appUser } = rootStore.commonStore;
  const { screenName } = route.params;

  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'Profile',
        payload: {
          name: appUser?.name ?? '',
          email: appUser?.email ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      checkInternet();
      setTimeout(() => {
        StatusBar.setBarStyle("dark-content", true);
      }, 300)
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
      onPress={() => { navigation.goBack() }}
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
