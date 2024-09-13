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
import { rootStore } from '../stores/rootStore';


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
  const {setSenderAddress , setReceiverAddress} = rootStore.myAddressStore;
    const {pickDrop,item}=route.params
    console.log("pickDrop--sr",pickDrop)
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    address_detail: item?.address ? item?.address_detail:'',
    landmark:  item?.landmark ? item?.landmark:'',
    name: (item?.name && item?.phone) ? item?.name:'',
    phone: item?.phone ? item?.phone?.toString() :'',
  });

  const handleLogin = values => {
    console.log('values', values,item,pickDrop);
    const newData ={
      ...values ,
      address:item?.address,
      geo_location:item?.geo_location,
      // phone:Number(phone)
    }
     console.log("newData--",newData)

    if(pickDrop == 'pick'){
      setSenderAddress(newData)
      navigation.navigate('setLocationHistory')
  
     } else {
      setReceiverAddress(newData)
      navigation.navigate('priceDetails')
     }
  };

  const getLocationName=(item)=>{
    const nameData = item?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    return nameData[0]
  }

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
             item={{name:getLocationName(item),address:item?.address}}
             onPressEdit ={() => {
              navigation.goBack();
               }} />
              <View
                style={styles.lineView}
              />
              <Spacer space={'3%'}/>
              <InputField
                textColor={'#000000'}
                name={'address_detail'}
                label={''}
                maxLength={100}
                placeholder={'Enter Address'}
              />
              <InputField
                textColor={'#000000'}
                name={'name'}
                label={''}
                maxLength={50}
                placeholder={'Name'}
              />
              <InputField
                textColor={'#000000'}
                keyboardType="number-pad"
                maxLength={10}
                name={'phone'}
                label={''}
                placeholder={'Enter mobile number'}
              />
                <InputField
                textColor={'#000000'}
                name={'landmark'}
                label={''}
                maxLength={50}
                placeholder={'Landmark (optional)'}
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
