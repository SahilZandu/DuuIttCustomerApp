import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Spacer from '../../../halpers/Spacer';
import { Strings } from '../../../translates/strings';
import { styles } from './styles';
import AuthScreenContent from '../../../components/AuthScreenContent';
import Header from '../../../components/header/Header';
import SetPassForm from '../../../forms/SetPassForm';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { Wrapper } from '../../../halpers/Wrapper';



export default function SetPass({ navigation, route }) {

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation)
    })
  )
  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      onPress={() => {
        navigation.goBack();
      }}
      backArrow={true}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
        onPress={() => {
          navigation.goBack();
        }}
        backArrow={true}
      /> */}
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          style={{ flex: 1 }}>
          <View style={styles.screen}>
            <AuthScreenContent title={Strings?.setNewPassword} subTitle={Strings?.yourNewPasswordDifferent} />
            <Spacer space={'6%'} />
            <SetPassForm navigation={navigation} route={route} />
          </View>
        </ScrollView>
      </View>
    </Wrapper>
  );
}

