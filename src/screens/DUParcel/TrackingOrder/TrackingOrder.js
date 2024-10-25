import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import Header from '../../../components/header/Header';
import TrackingOrderForm from '../../../forms/TrackingOrderForm';

const TrackingOrder = ({navigation}) => {
  
 
  return (
    <View style={styles.container}>
      <Header
        title={'Order Tracking'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
        <TrackingOrderForm navigation={navigation}/>
     
    </View>
  );
};

export default TrackingOrder;
