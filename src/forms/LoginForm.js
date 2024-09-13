import React, {useState} from 'react';
import {Text, View, TouchableOpacity,StyleSheet} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormikContext} from 'formik';
import {loginValidations} from './formsValidation/loginValidations';
import InputField from '../components/InputField';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import { rootStore } from '../stores/rootStore';

const initialValues = {
  email: '',
  password: '',
  mobile: '',
};

const FormButton = ({loading, onPress}) => {
  const {dirty, isValid, values} = useFormikContext();
  return (
    <CTA
      disable={!(isValid && dirty)}
      title={Strings.login}
      onPress={() => onPress(values)}
      loading={loading}
    />
  );
};

const LoginForm = ({navigation, type}) => {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setsecureTextEntry] = useState(true);

    const {login} = rootStore.authStore;

  const handleLogin = async (values) => {
    // console.log('values', values);
    // navigation.navigate('verifyOtp', {value: values, loginType: type});
        await login(values,type,navigation,handleLoading)
  };
  const handleLoading = v => {
    setLoading(v);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidations(type)}>
      <View style={styles.main}>
        {type == 'Email' ? (
          <InputField
            textColor={'#000000'}
            keyboardType="email-address"
            name={'email'}
            label={''}
            placeholder={'example@gmail.com'}
          />
        ) : (
          <InputField
            textColor={'#000000'}
            keyboardType="number-pad"
            maxLength={10}
            // prefix={'+91'}
            name={'mobile'}
            label={''}
            placeholder={'Enter mobile number'}
          />
        )}

        {type == 'Email' && (
          <InputField
            textColor={'#000000'}
            autoCapitalize={'none'}
            name={'password'}
            label={''}
            placeholder={'********'}
            secureTextEntry={secureTextEntry}
            onPressEye={() => setsecureTextEntry(!secureTextEntry)}
            rightIconName={!secureTextEntry ? 'eye' : 'eye-off'}
          />
        )}

     {type == 'Email' && (
     <View style={styles.forgotView}>
          <TouchableOpacity
          onPress={()=>{navigation.navigate("forgotPass")}}
            activeOpacity={0.8}
            style={styles.forgotTouch}>
            <Text
              style={styles.forgotText}>
              {Strings.forgotPassword}
            </Text>
          </TouchableOpacity>
        </View>
        )}

        <Spacer space={'12%'} />
        <FormButton loading={loading} onPress={handleLogin} />
      </View>
    </Formik>
  );
};

export default LoginForm;

const styles = StyleSheet.create({

  main:{
    width: wp('85%'), alignSelf: 'center'
  },

  forgotView:{
    justifyContent: 'flex-end', alignItems: 'flex-end'
  },
  forgotTouch:{
    width: wp('35%'),
    height: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotText:{
    fontSize: RFValue(12),
    fontFamily: fonts.bold,
    textAlign: 'right',
    color: '#28B056',
  }

})