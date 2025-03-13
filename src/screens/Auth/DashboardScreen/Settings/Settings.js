import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import Header from '../../../../components/header/Header';
import {useFocusEffect} from '@react-navigation/native';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {styles} from '../Help/styles';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import TouchableTextSwitch from '../../../../components/TouchableTextSwitch';

export default function Settings({navigation}) {
  const [activateSwitch, setActivateSwitch] = useState(true);
  const [switchWallet, setSwitchWallet] = useState(true);
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const onTogglePress = async () => {
    setActivateSwitch(!activateSwitch);
  };

  const onToggleWallet = async () => {
    setSwitchWallet(!switchWallet);
  };

  return (
    <View style={styles.container}>
      <Header
        bottomLine={true}
        onPress={() => {
          navigation.goBack();
        }}
        title={'Settings'}
        backArrow={true}
      />

      <AppInputScroll
        Pb={'20%'}
        padding={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={{marginHorizontal: 20, justifyContent: 'center'}}>
          <TouchableTextSwitch
            toggle={true}
            activateSwitch={activateSwitch}
            onTogglePress={onTogglePress}
            title={'Notification Settings'}
            text={'Define what alerts and notifications you want to see'}
          />

          <TouchableTextSwitch
            toggle={false}
            title={'Account Settings'}
            text={'Delete your account'}
          />

          <TouchableTextSwitch
            toggle={true}
            activateSwitch={switchWallet}
            onTogglePress={onToggleWallet}
            title={'Wallet Settings'}
            text={'Show/Hide your wallet on home'}
          />
        </View>
      </AppInputScroll>
    </View>
  );
}
