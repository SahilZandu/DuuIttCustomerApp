import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../../components/header/Header';
import CardOrderDetails from '../../../../components/CardOrderDetails';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import { Wrapper } from '../../../../halpers/Wrapper';
import { AppEvents } from '../../../../halpers/events/AppEvents';
import { rootStore } from '../../../../stores/rootStore';




export default function OrderDetails({ navigation, route }) {
  const { item } = route.params;
  const { appUser } = rootStore.commonStore;

  console.log("item===", item);


  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'Help',
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
      handleAndroidBackButton(navigation);
    }, [])
  )



  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      onPress={() => {
        navigation.goBack();
      }}
      title={'Order Details'}
      backArrow={true}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
       onPress={()=>{ 
        // navigation.navigate('tab3', { 
        // tabText: item?.order_type?.toUpperCase() 
        // })
       navigation.goBack();
      }}
      title={'Order Details'}
       backArrow={true} /> */}
        <CardOrderDetails item={item} />
      </View>
    </Wrapper>
  );
}
