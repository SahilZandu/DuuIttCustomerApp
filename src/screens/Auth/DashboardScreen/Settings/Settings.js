import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import Header from '../../../../components/header/Header';
import {useFocusEffect, CommonActions} from '@react-navigation/native';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {styles} from '../Help/styles';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import TouchableTextSwitch from '../../../../components/TouchableTextSwitch';
import PopUp from '../../../../components/appPopUp/PopUp';
import {rootStore} from '../../../../stores/rootStore';
import socketServices from '../../../../socketIo/SocketServices';

export default function Settings({navigation}) {
  const {deleteAccount} = rootStore.dashboardStore;
  const {appUser, setToken, setAppUser} = rootStore.commonStore;
  const [activateSwitch, setActivateSwitch] = useState(true);
  const [switchWallet, setSwitchWallet] = useState(true);
  const [isDelete, setIsDelete] = useState(false);

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

  const handleDelete = async () => {
    const res = await deleteAccount(appUser, handleLoading);
    console.log('res delete--', res, res?.statusCode);
    if (res?.statusCode == 200) {
      setIsDelete(false);
      setTimeout(async () => {
        let query = {
          user_id: appUser?._id,
        };
        socketServices.emit('remove-user', query);
        socketServices.disconnectSocket();
        await setToken(null);
        await setAppUser(null);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'auth'}],
          }),
        );
      }, 500);
    } else {
      setIsDelete(false);
    }
  };

  const handleLoading = () => {
    setIsDelete(false);
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
            onPress={() => {
              setIsDelete(true);
            }}
          />

          <TouchableTextSwitch
            toggle={true}
            activateSwitch={switchWallet}
            onTogglePress={onToggleWallet}
            title={'Wallet Settings'}
            text={'Show/Hide your wallet on home'}
          />
        </View>
        <PopUp
          visible={isDelete}
          type={'delete'}
          onClose={() => setIsDelete(false)}
          title={'Are you sure you want to delete your account?'}
          text={
            'This action is permanent and will remove all your data. Do you really want to continue?'
          }
          onDelete={handleDelete}
        />
      </AppInputScroll>
    </View>
  );
}
