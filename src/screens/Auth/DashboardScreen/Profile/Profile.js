import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, View,} from 'react-native';
import {styles} from './styles';
import Header from '../../../../components/header/Header';
import ProfileForm from '../../../../forms/ProfileForm';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';


export default function Profile({navigation}) {

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header 
      onPress={()=>{navigation.goBack()}}
      title={'Edit Profile'}
       backArrow={true} />
     <ProfileForm navigation={navigation} />
    </View>
  );

}
