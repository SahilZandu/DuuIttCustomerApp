import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import Header from '../../../components/header/Header';
import TrackingFoodOrderForm from '../../../forms/TrackingFoodOrderForm';

const TrackingFoodOrderList = ({navigation}) => {
  
  return (
    <View style={styles.container}>
      <Header
        title={'Food Order Tracking'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
        <TrackingFoodOrderForm navigation={navigation} />
     
    </View>
  );
};

export default TrackingFoodOrderList;
