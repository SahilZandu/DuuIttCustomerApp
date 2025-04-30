import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormikContext} from 'formik';
import InputField from '../components/InputField';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {forgotValidations} from './formsValidation/forgotValidations';
import { rootStore } from '../stores/rootStore';



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

const ForgotForm = ({navigation}) => {

  const {forgotPass}=rootStore.authStore;
   
  const [loading, setLoading] = useState(false);
  const [initialValues ,setInitialValues] =useState({
    email: '',
  });

  const handleForgot = async(values) => {
      console.log('values', values);
       await forgotPass(values,navigation,handleLoading)
    // navigation.navigate('verifyOtp', {value: values, loginType: 'forgot'});
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
          autoCapitalize={'none'}
          textColor={'#000000'}
          keyboardType="email-address"
          name={'email'}
          label={''}
          placeholder={'example@gmail.com'}
        />
        <Spacer space={'12%'} />
        <FormButton loading={loading} onPress={handleForgot} />
      </View>
    </Formik>
  );
};

export default ForgotForm;
