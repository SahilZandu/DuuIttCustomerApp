import React, {useEffect, useState} from 'react';
import {Text, View, KeyboardAvoidingView, Keyboard} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Strings} from '../../../translates/strings';
import Spacer from '../../../halpers/Spacer';
import CTA from '../../../components/cta/CTA';
import AppInputScroll from '../../../halpers/AppInputScroll';
import OtpInput from '../../../components/OtpInput';
import ResendOtp from '../../../components/ResendOtp';
import {styles} from './styles';
import SmsListener from 'react-native-android-sms-listener';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../../../commons/AppImages';
import Header from '../../../components/header/Header';
import { rootStore } from '../../../stores/rootStore';
import AuthScreenContent from '../../../components/AuthScreenContent';




export default function VerifyOtp({navigation, route}) {
  const {setToken}=rootStore.commonStore;
  const {verifyOtp}=rootStore.authStore;
  const {value, loginType} = route.params;
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(null);
  const [clearValue, setClearValue] = useState(false);
  const [mobileEmail, setMobileEmail] = useState(value);
  const [clearData, setClearData] = useState(false);

  useEffect(() => {
    setOtp('');
    setClearValue(!clearValue);
    if (value) {
      setMobileEmail(value);
    }
  }, [value]);

  useEffect(() => {
    if (Platform.OS == 'android') {
      const subscription = SmsListener.addListener(message => {
        console.log('message', message);
        // Check if the message contains the OTP pattern
        if (message.body.includes('revealhub')) {
          // Extract the OTP code from the message
          const otpRegex = /(\d{4})/; // Adjust the regex pattern based on your OTP format
          const otpMatch = message.body.match(otpRegex);
          const otpCode = otpMatch ? otpMatch[0] : null;

          // Now you have the OTP code, you can use it as needed
          console.log('Received OTP:', otpCode);
          setOtp(otpCode);
        }
      });

      return () => {
        // Clean up the listener when the component unmounts
        subscription.remove();
      };
    }
  }, []);

  const handleTextChange = t => {
    console.log('triger handle change:-', t);
    setOtp(t);
    if (t?.length == 4) {
      handleVerify(t);
    }
  };

  const FormButton = ({loading, onPress}) => {
    return (
      <CTA
        disable={otp?.length != 4}
        title={Strings.verify}
        onPress={() => {
          onPress(otp);
        }}
        loading={loading}
        theme={'primary'}
        isBottom={true}
      />
    );
  };

  const handleVerify = async otpValue => {
      Keyboard.dismiss();
      //  if(loginType == 'forgot'){
      //   navigation.navigate("setPass",{value:mobileEmail})
      //  }else{

         await verifyOtp(mobileEmail,loginType ,otpValue, navigation, handleLoading,onResendClear )
        
        // await setToken("true")
        // navigation.navigate('dashborad' , {screen:'home'})
      //  }
      
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onResendClear = async() => {
    console.log('resend');
    setOtp('');
    setClearData(!clearData);
  };

  return (
    <View style={styles.screen}>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
        backArrow={true}
      />
      <KeyboardAvoidingView
        style={styles.keyboradView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <AppInputScroll
          pb={0}
          padding={true}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.mainContainer}>
            {/* <View style={styles.imageTextView}>
              <SvgXml xml={appImagesSvg.logoIcon} />
              <Text style={styles.varificationText}>
                {Strings.verification}
              </Text>
              <Text style={styles.fourDigitText}>
                {`${Strings.otpVerificationText} ${
                  loginType == 'Mobile'
                    ? Strings.phoneNumber
                    : Strings.emailAddress
                } ${
                  loginType == 'Mobile'
                    ? mobileEmail?.mobile
                    : mobileEmail?.email
                }`}
              </Text>
            </View> */}
              <AuthScreenContent title={Strings.verification} 
              subTitle= {`${Strings.otpVerificationText} ${
                  loginType == 'Mobile'
                    ? Strings.phoneNumber
                    : Strings.emailAddress
                } ${
                  loginType == 'Mobile'
                    ? mobileEmail?.mobile
                    : mobileEmail?.email
                }`} />

            <Spacer space={'2%'} />
            <OtpInput
              clearData={clearData}
              handleTextChange={handleTextChange}
            />
            <Spacer space={'5%'} />
            <ResendOtp
              value={mobileEmail}
              type={loginType}
              onResendClear={onResendClear}
              handleLoading={handleLoading}
            />
            <View style={{marginTop: '30%'}}>
              <FormButton loading={loading} onPress={handleVerify} />
            </View>
          </View>
        </AppInputScroll>
      </KeyboardAvoidingView>
    </View>
  );
}
