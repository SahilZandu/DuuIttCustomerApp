import React, {useState, useEffect,useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native';
import {colors} from '../../../theme/colors';
import LoginForm from '../../../forms/LoginForm';
import {RFValue} from 'react-native-responsive-fontsize';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../../theme/fonts/fonts';
import {appImagesSvg} from '../../../commons/AppImages';
import Spacer from '../../../halpers/Spacer';
import { Strings } from '../../../translates/strings';
import {styles} from './styles';
import AuthScreenContent from '../../../components/AuthScreenContent';



export default function Login({navigation}) {
  const [type, setType] = useState('Mobile');
  const [update, setUpdate] = useState(true);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
      clearInputs();
    }, []),
  );

  const requestSMSpermission = async () => {
    const userResponse = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    ]);
    console.log('userResponse', userResponse);
    return userResponse;
  };

  const testBaseURL = async () => {
    try {
      const response = await fetch('http://duuitt.hashsoft.io:3001');
      if (response.ok) {
        Alert.alert('Success', 'The base URL is accessible.');
      } else {
        Alert.alert('Error', 'The base URL returned an error.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to access the base URL: ${error.message}`);
    }
  };
  
  useEffect(() => {
    // testBaseURL()

    if (Platform.OS === 'android') {
      setTimeout(() => {
        requestSMSpermission();
      }, 1000);
    }
  }, []);

  const clearInputs = () => {
    setUpdate(false);

    setTimeout(() => {
      setUpdate(true);
    }, 10);
  };

  const handleType = () => {
    clearInputs();
    setType(type == 'Mobile' ? 'Email' : 'Mobile');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        style={{flex: 1}}>
        <View style={styles.screen}>
          <AuthScreenContent marginTop={'20%'} title={Strings?.sign_In}  subTitle={Strings?.accessYourAccount} />
          <Spacer space={'6%'} />
          {update && <LoginForm navigation={navigation} type={type} />}
          <Text
            style={styles.orText}>
            {Strings.Or}
          </Text>
          <Pressable
            style={styles.touchView}
            onPress={handleType}>
            <Text style={styles.login}>
               {type == 'Mobile' ? `${Strings?.loginWithEmail}` :  `${Strings?.loginWithMobile}`}{' '}
            </Text>
          </Pressable>

          <View
            style={styles.termsPolicyMainView}>
            <Text
              style={styles.agreeText}>
              By proceeding, you agree with our
            </Text>
            <View
              style={styles.termsPolicyView}>
              <TouchableOpacity 
               onPress={()=>{
                navigation.navigate('myWebComponent', {
                  type: 'terms',
                })
              }}
               activeOpacity={0.8} >
                <Text
                  style={styles.termsText}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
              <Text
                style={styles.andText}>
                {' '}
                &{' '}
              </Text>
              <TouchableOpacity 
               onPress={()=>{
                navigation.navigate('myWebComponent', {
                  type: 'policy',
                })
              }}
              activeOpacity={0.8}>
                <Text
                  style={styles.privacyText}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

