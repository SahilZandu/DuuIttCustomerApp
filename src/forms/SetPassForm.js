import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormikContext} from 'formik';
import InputField from '../components/InputField';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {setPassValidations} from './formsValidation/setPassValidations';
import { rootStore } from '../stores/rootStore';
import { colors } from '../theme/colors';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../halpers/handleAndroidBackButton';



const FormButton = ({loading, onPress}) => {
  const {dirty, isValid, values} = useFormikContext();
  return (
    <CTA
      disable={!(isValid && dirty)}
      title={Strings?.save}
      onPress={() => onPress(values)}
      loading={loading}
    />
  );
};

const SetPassForm = ({navigation, route}) => {
  const {data}=route.params;
  const {updatePassword}=rootStore.authStore
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setsecureTextEntry] = useState(true);
  const [secureTextEntry2, setsecureTextEntry2] = useState(true);
  const [initialValues,setInitialValues]=useState(
    {
    password: '',
    confirm: '',
  }
  );

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const handleSetPass = async(values) => {
    // console.log('values', values);
    // navigation.navigate('verifyOtp', {value: values, loginType: type});
   await updatePassword(data,values,navigation,handleLoading)
      // navigation.navigate('login');
  };

  const handleLoading = v => {
    setLoading(v);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={setPassValidations()}>
      <View style={{width: wp('85%'), alignSelf: 'center'}}>
        <InputField
          textColor={colors.black}
          autoCapitalize={'none'}
          name={'password'}
          label={''}
          placeholder={'********'}
          secureTextEntry={secureTextEntry}
          onPressEye={() => setsecureTextEntry(!secureTextEntry)}
          rightIconName={!secureTextEntry ? 'eye' : 'eye-off'}
        />
        <InputField
         textColor={colors.black}
          autoCapitalize={'none'}
          name={'confirm'}
          label={''}
          placeholder={'********'}
          secureTextEntry={secureTextEntry2}
          onPressEye={() => setsecureTextEntry2(!secureTextEntry2)}
          rightIconName={!secureTextEntry2 ? 'eye' : 'eye-off'}
        />
        <Spacer space={'12%'} />
        <FormButton loading={loading} onPress={handleSetPass} />
      </View>
    </Formik>
  );
};

export default SetPassForm;
