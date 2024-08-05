import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
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
import {forgotValidations} from './formsValidation/forgotValidations';

const initialValues = {
  email: '',
};

const FormButton = ({loading, onPress}) => {
  const {dirty, isValid, values} = useFormikContext();
  return (
    <CTA
      disable={!(isValid && dirty)}
      title={Strings?.send}
      onPress={() => onPress(values)}
      loading={loading}
    />
  );
};

const ForgotForm = ({navigation, type}) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = values => {
    // console.log('values', values);
    navigation.navigate('verifyOtp', {value: values, loginType: 'forgot'});
    // navigation.navigate('setPass',);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotValidations()}>
      <View style={{width: wp('85%'), alignSelf: 'center'}}>
        <InputField
          textColor={'#000000'}
          keyboardType="email-address"
          name={'email'}
          label={''}
          placeholder={'example@gmail.com'}
        />
        <Spacer space={'12%'} />
        <FormButton loading={loading} onPress={handleLogin} />
      </View>
    </Formik>
  );
};

export default ForgotForm;
