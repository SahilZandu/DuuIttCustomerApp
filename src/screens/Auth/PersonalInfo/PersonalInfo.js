import React, {useState, useEffect,useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../../../halpers/Spacer';
import { Strings } from '../../../translates/strings';
import {styles} from './styles';
import AuthScreenContent from '../../../components/AuthScreenContent';
import AppInputScroll from '../../../halpers/AppInputScroll';
import PersonalInfoForm from '../../../forms/PersonalInfoForm';



export default function PersonalInfo({navigation ,route}) {
   
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
    }, []),
  );


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.screen}>
          <AuthScreenContent title={Strings.personalInformation}  subTitle={Strings.tellUsAboutYourself} />
          <Spacer space={'6%'} />
          {<PersonalInfoForm navigation={navigation} route={route} />}
        </View>
      </AppInputScroll>
      </KeyboardAvoidingView>
    </View>
  );
}

