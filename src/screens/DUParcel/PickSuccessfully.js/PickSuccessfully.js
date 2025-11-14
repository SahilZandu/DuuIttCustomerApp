import React, { useEffect, useState, useCallback } from 'react';
import { Text, TouchableOpacity, View, Image, } from 'react-native';
import { appImages } from '../../../commons/AppImages';
import { styles } from './styles';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import BTN from '../../../components/cta/BTN';
import Spacer from '../../../halpers/Spacer';
import socketServices from '../../../socketIo/SocketServices';
import { Wrapper } from '../../../halpers/Wrapper';
import { AppEvents } from '../../../halpers/events/AppEvents';
import { rootStore } from '../../../stores/rootStore';
import { stopKeepAwakeScreen } from '../../../components/ScreenKeepAlive';

export default function PickSuccessfully({ navigation }) {

  const { appUser } = rootStore.commonStore;

  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'PickSuccessfullyParcel',
        payload: {
          name: appUser?.name ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }


  useFocusEffect(
    useCallback(() => {
      stopKeepAwakeScreen();
      handleAndroidBackButton('', 'parcel', 'parcel', navigation);
      socketServices.removeListener('update-location');
      socketServices.removeListener('remaining-distance');
      // socketServices.disconnectSocket();

      const timeOut = setTimeout(() => {
        navigation.navigate('parcel', { screen: 'home' });
      }, 10000)
      return () => {
        clearTimeout(timeOut);
      };
    }, []),
  );

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
    >
      <View style={styles.container}>
        <View style={styles.main}>
          <Image
            resizeMode="cover"
            style={styles.pickedImage}
            source={appImages.pickedGreenImage}
          />

          <Text style={styles.title}>Picked Sucessfully</Text>
          <Text style={styles.message}>
            Order picked successfully. Our rider will deliver your order at your
            given place
          </Text>

          <Spacer space={'10%'} />
          <BTN
            title={'Track Your Order'}
            onPress={() => {
              navigation.navigate('trackingOrder');
            }}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('parcel', { screen: 'home' });
            }}
            style={styles.backToHomeView}>
            <Text style={styles.backToHomeText}>Back to home</Text>
            <View style={styles.backHomeBottonLine} />
          </TouchableOpacity>
        </View>
      </View>
    </Wrapper>
  );
}
