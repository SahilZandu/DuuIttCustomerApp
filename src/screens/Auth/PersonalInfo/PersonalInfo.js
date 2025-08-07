import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect,CommonActions } from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../../../halpers/Spacer';
import { Strings } from '../../../translates/strings';
import { styles } from './styles';
import AuthScreenContent from '../../../components/AuthScreenContent';
import AppInputScroll from '../../../halpers/AppInputScroll';
import PersonalInfoForm from '../../../forms/PersonalInfoForm';
import Header from '../../../components/header/Header';
import PopUp from '../../../components/appPopUp/PopUp';
import { rootStore } from '../../../stores/rootStore';
import socketServices from '../../../socketIo/SocketServices';
import { colors } from '../../../theme/colors';




export default function PersonalInfo({ navigation, route }) {
  const [isLogout, setIsLogout] = useState(false);
  const { appUser, setToken, setAppUser } = rootStore.commonStore;
  const {userLogout}=rootStore.dashboardStore;

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
      socketServices.initailizeSocket();
    }, []),
  );

  
  const handleLogout = async () => {
    await userLogout(handleLogoutLoading ,isSuccess ,onError)
    
   };
 
   const handleLogoutLoading = (v) => {
    console.log('v--', v);
   }
   const isSuccess = () => {
   
     setTimeout(async () => {
       let query = {
         user_id: appUser?._id,
       };
       socketServices.emit('remove-user', query);
       socketServices.disconnectSocket();
       await setToken(null);
       await setAppUser(null);
       setIsLogout(false);
       navigation.dispatch(
         CommonActions.reset({
           index: 0,
           routes: [{ name: 'auth' }],
         }),
       );
     }, 500);
   }
   const onError = () => {
     setIsLogout(false);
   }
  


  return (
    <View style={styles.container}>
      <Header
        rightTitle={'Logout'}
        onPressRight={() => {
          setIsLogout(true);
          // navigation.goBack();
        }}
        backArrow={false}
        rightColor={colors.red}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
          <View style={styles.screen}>
            <AuthScreenContent title={Strings.personalInformation} 
            subTitle={Strings.tellUsAboutYourself} />
            <Spacer space={'6%'} />
            {<PersonalInfoForm navigation={navigation} route={route} />}
          </View>
        </AppInputScroll>
      </KeyboardAvoidingView>
      <PopUp
        topIcon={true}
        visible={isLogout}
        type={'logout'}
        onClose={() => setIsLogout(false)}
        title={'Are you sure you want to log out?'}
        text={
          'You will be log out of your account. Do you want to continue?'
        }
        onDelete={handleLogout}
      />

    </View>
  );
}

