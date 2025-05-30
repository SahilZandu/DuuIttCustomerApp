import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Spacer from '../../../halpers/Spacer';
import { Strings } from '../../../translates/strings';
import {styles} from './styles';
import AuthScreenContent from '../../../components/AuthScreenContent';
import Header from '../../../components/header/Header';
import ForgotForm from '../../../forms/ForgotForm';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';



export default function ForgotPass({navigation}) {

  useFocusEffect(
    useCallback(()=>{
      handleAndroidBackButton(navigation)
    })
  )

  return (
    <View style={styles.container}>
         <Header
        onPress={() => {
          navigation.goBack();
        }}
        backArrow={true}
      />
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        style={{flex: 1}}>
        <View style={styles.screen}>
          <AuthScreenContent title={Strings?.emailAddress}  subTitle={Strings?.forgotReceiveVerification} />
          <Spacer space={'6%'} />
         <ForgotForm navigation={navigation}/>
        </View>
      </ScrollView>
    </View>
  );
}

