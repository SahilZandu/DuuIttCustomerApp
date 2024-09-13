import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormikContext} from 'formik';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import AppInputScroll from '../halpers/AppInputScroll';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';
import InputField from '../components/InputField';
import {senderReceiverValidations} from './formsValidation/senderReceiverValidations';
import {Surface} from 'react-native-paper';
import PickDropAddressEdit from '../components/PickDropAddressEdit';


const FormButton = ({loading, onPress}) => {
  const {dirty, isValid, values} = useFormikContext();

  return (
    <CTA
      disable={!(isValid && dirty)}
      title={'Proceed'}
      onPress={() => onPress(values)}
      loading={loading}
      isBottom={true}
      width={'90%'}
      textTransform={'capitalize'}
    />
  );
};

const SenderReceiverForm = ({navigation,route}) => {

    const {pickDrop}=route.params
    console.log("pickDrop--sr",pickDrop)
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    address: '',
    landmark: '',
    name: '',
    mobile: '',
  });

  const handleLogin = values => {
    console.log('values', values);
    navigation.navigate('setLocationHistory')
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={senderReceiverValidations()}>
      <View style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
            <View style={styles.main}>
             <PickDropAddressEdit 
             item={{name:'TDI TAJ PLAZA Block-505',address:' Airport Road, Sector 118....'}}
             onPressEdit ={() => {
              navigation.goBack();
               }} />
              <View
                style={styles.lineView}
              />
              <Spacer space={'3%'}/>
              <InputField
                textColor={'#000000'}
                name={'address'}
                label={''}
                placeholder={'Enter Address'}
              />
              <InputField
                textColor={'#000000'}
                name={'landmark'}
                label={''}
                placeholder={'Landmark (optional)'}
              />
              <InputField
                textColor={'#000000'}
                keyboardType="number-pad"
                name={'name'}
                label={''}
                placeholder={'Name (optional)'}
              />
              <InputField
                textColor={'#000000'}
                keyboardType="number-pad"
                maxLength={10}
                name={'mobile'}
                label={''}
                placeholder={'Enter mobile number'}
              />
            </View>
          </AppInputScroll>
        </KeyboardAvoidingView>
        <View>
          <FormButton loading={loading} onPress={handleLogin} />
        </View>
      </View>
    </Formik>
  );
};

export default SenderReceiverForm;

const styles = StyleSheet.create({
  main:{
    flex: 1, marginHorizontal: 20, marginTop: '5%'
  },
  lineView:{
    height: 1,
    backgroundColor: '#D9D9D9',
    marginTop: '7%',
    marginHorizontal: -20,
  }

});
