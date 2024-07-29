import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
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



export default function Login({navigation}) {
  const [type, setType] = useState('Mobile');
  const [update, setUpdate] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
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

  useEffect(() => {
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
          <View
            style={styles.imageTextView}>
            <SvgXml xml={appImagesSvg.logoIcon} />
            <Text
              style={styles.singInText}>
              {Strings?.sign_In}
            </Text>
            <Text
              style={styles.accessAccountText}>
             {Strings?.accessYourAccount}
            </Text>
          </View>
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
              <TouchableOpacity activeOpacity={0.8} style={{}}>
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
              <TouchableOpacity activeOpacity={0.8}>
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

