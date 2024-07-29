import React, {useState} from 'react';
import {Text, View} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormikContext} from 'formik';
import {loginValidations} from './formsValidation/loginValidations';
import InputField from '../components/InputField';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import { Strings } from '../translates/strings';
// import {rootStore} from '../stores/rootStore';

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

//   const {emailLogin, sendOtp} = rootStore.authStore;

  const handleLogin = values => {
    // console.log('values', values);
      navigation.navigate("verifyOtp",{value:values,loginType:type})

    if (type == 'Email') {
    //   emailLogin(values, navigation, handleLoading);
    } else {
    //   sendOtp(values, navigation, handleLoading);
    }
  };
  const handleLoading = v => {
    setLoading(v);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidations(type)}>
      <View style={{width:widthPercentageToDP('85%') , alignSelf: 'center',}}>
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
          <Spacer space={'13%'}/>
        <FormButton loading={loading} onPress={handleLogin} />
      </View>
    </Formik>
  );
};

export default LoginForm;
