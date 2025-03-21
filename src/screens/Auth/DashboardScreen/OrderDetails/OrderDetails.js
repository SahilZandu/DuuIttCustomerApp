import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
} from 'react-native';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../../../components/header/Header';
import CardOrderDetails from '../../../../components/CardOrderDetails';
import AppInputScroll from '../../../../halpers/AppInputScroll';




export default function OrderDetails({navigation, route}) {
    const {item}=route.params;

    console.log("item===",item);
 
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    },[])
  )

 

  return (
    <View style={styles.container}>
         <Header
      onPress={()=>{navigation.goBack()}}
      title={'Order Details'}
       backArrow={true} />
      <CardOrderDetails item={item} />
    </View>
  );
}
