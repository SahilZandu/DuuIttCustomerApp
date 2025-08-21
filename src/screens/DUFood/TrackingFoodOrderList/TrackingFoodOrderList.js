import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import Header from '../../../components/header/Header';
import TrackingFoodOrderForm from '../../../forms/TrackingFoodOrderForm';
import { Wrapper } from '../../../halpers/Wrapper';

const TrackingFoodOrderList = ({ navigation }) => {

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      title={'Food Order Tracking'}
      backArrow={true}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
        title={'Food Order Tracking'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        <TrackingFoodOrderForm navigation={navigation} />

      </View>
    </Wrapper>
  );
};

export default TrackingFoodOrderList;
