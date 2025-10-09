import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import Header from '../../../components/header/Header';
import TrackingOrderForm from '../../../forms/TrackingOrderForm';
import { Wrapper } from '../../../halpers/Wrapper';
import { AppEvents } from '../../../halpers/events/AppEvents';
import { rootStore } from '../../../stores/rootStore';

const TrackingOrder = ({ navigation }) => {

  const { appUser } = rootStore.commonStore;

  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'TrackingOrderParcel',
        payload: {
          name: appUser?.name ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }


  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      title={'Order Tracking'}
      backArrow={true}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
        title={'Order Tracking'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        <TrackingOrderForm navigation={navigation} />
      </View>
    </Wrapper>
  );
};

export default TrackingOrder;
