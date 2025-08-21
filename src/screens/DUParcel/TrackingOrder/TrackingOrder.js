import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import Header from '../../../components/header/Header';
import TrackingOrderForm from '../../../forms/TrackingOrderForm';
import { Wrapper } from '../../../halpers/Wrapper';

const TrackingOrder = ({ navigation }) => {


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
