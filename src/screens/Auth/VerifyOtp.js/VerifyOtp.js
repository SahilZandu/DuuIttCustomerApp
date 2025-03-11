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
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../../../commons/AppImages';
import Header from '../../../components/header/Header';
import {rootStore} from '../../../stores/rootStore';
import AuthScreenContent from '../../../components/AuthScreenContent';
import {
  getHash,
  startOtpListener,
  getOtp,
  removeListener,
  useOtpVerify,
} from 'react-native-otp-verify';



export default function VerifyOtp({navigation, route}) {
  const {setToken} = rootStore.commonStore;
  const {verifyOtp} = rootStore.authStore;
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

  
   // using methods only for android
    useEffect(() => {
      if (Platform.OS === 'android') {
      getHash().then(hash => {
        console.log('hash>',hash);
        // use this hash in the message.
      }).catch(console.log);
  
      startOtpListener(message => {
        console.log('message>',message);
        if (message.includes('is OTP')) {
        // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
        const otp = /(\d{4})/g.exec(message)[1];
        setOtp(otp);
        }
      });
  
      getOtp().then(pp => {
        console.log('getOtp>',pp);
        // use this hash in the message.
      }).catch(console.log);
  
      return () => removeListener();
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
    // await setToken("true")
    // navigation.navigate('dashborad' , {screen:'home'})
    //  }

    await verifyOtp(
      mobileEmail,
      loginType,
      otpValue,
      navigation,
      handleLoading,
      onResendClear,
    );
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onResendClear = async () => {
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
            <AuthScreenContent
              marginTop={'25%'}
              title={Strings.verification}
              subTitle={`${Strings.otpVerificationText} ${
                loginType == 'Mobile'
                  ? Strings.phoneNumber
                  : Strings.emailAddress
              } ${
                loginType == 'Mobile' ? mobileEmail?.mobile : mobileEmail?.email
              }`}
            />

            <Spacer space={'2%'} />
            <OtpInput
              value={otp}
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
