// import React, {useState} from 'react';
// import {View, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
// import CTA from '../components/cta/CTA';
// import {Formik, useFormikContext} from 'formik';
// import Spacer from '../halpers/Spacer';
// import AppInputScroll from '../halpers/AppInputScroll';
// import InputField from '../components/InputField';
// import {senderReceiverValidations} from './formsValidation/senderReceiverValidations';
// import PickDropAddressEdit from '../components/PickDropAddressEdit';
// import {rootStore} from '../stores/rootStore';
// import InputFieldLabel from '../components/InputFieldLabel';

// const FormButton = ({loading, onPress}) => {
//   const {dirty, isValid, values} = useFormikContext();

//   return (
//     <CTA
//       disable={!(isValid && dirty)}
//       title={'Proceed'}
//       onPress={() => onPress(values)}
//       loading={loading}
//       isBottom={true}
//       width={'90%'}
//       textTransform={'capitalize'}
//     />
//   );
// };

// const SenderReceiverForm = ({navigation, route}) => {
//   const {setSenderAddress, setReceiverAddress} = rootStore.myAddressStore;
//   const {pickDrop, item} = route.params;
//   console.log('pickDrop--', pickDrop);
//   const [loading, setLoading] = useState(false);

//   const [initialValues, setInitialValues] = useState({
//     address_detail: item?.address ? item?.address_detail : '',
//     landmark: item?.landmark ? item?.landmark : '',
//     name: '',
//     // name: (item?.name && item?.phone) ? item?.name:'',
//     phone: item?.phone ? item?.phone?.toString() : '',
//   });

//   const handleLogin = values => {
//     console.log('values', values, item, pickDrop);
//     const newData = {
//       ...values,
//       address: item?.address,
//       geo_location: item?.geo_location,
//       // phone:Number(phone)
//     };
//     console.log('newData--', newData);

//     if (pickDrop == 'pick') {
//       setSenderAddress(newData);
//       navigation.navigate('setLocationHistory');
//     } else {
//       setReceiverAddress(newData);
//       navigation.navigate('priceDetails');
//     }
//   };

//   const getLocationName = item => {
//     const nameData = item?.address?.split(',');
//     // console.log('nameData--', nameData[0]);
//     return nameData[0];
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={senderReceiverValidations()}>
//       <View style={{flex: 1}}>
//         <KeyboardAvoidingView
//           style={{flex: 1}}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//           <AppInputScroll
//             Pb={'20%'}
//             padding={true}
//             keyboardShouldPersistTaps={'handled'}>
//             <View style={styles.main}>
//               <PickDropAddressEdit
//                 item={{name: getLocationName(item), address: item?.address}}
//                 onPressEdit={() => {
//                   navigation.goBack();
//                   navigation.navigate('chooseMapLocation', {
//                     pickDrop: pickDrop,
//                     item: item,
//                   });
//                 }}
//               />
//               <View style={styles.lineView} />
//               <Spacer space={'3%'} />
//               <InputFieldLabel
//                 marginTop={'8%'}
//                 borderWidth={1}
//                 inputLabel={'Address'}
//                 name={'address_detail'}
//                 maxLength={100}
//                 placeholder={'Enter Address'}
//               />
//               <InputFieldLabel
//                 marginTop={'8%'}
//                 borderWidth={1}
//                 inputLabel={
//                   pickDrop == 'pick' ? "Sender's Name" : "Receiver's Name"
//                 }
//                 name={'name'}
//                 maxLength={50}
//                 placeholder={'Enter your name'}
//               />
//               <InputFieldLabel
//                 marginTop={'8%'}
//                 borderWidth={1}
//                 keyboardType="number-pad"
//                 inputLabel={
//                   pickDrop == 'pick'
//                     ? "Sender's mobile number"
//                     : "Receiver's mobile number"
//                 }
//                 name={'phone'}
//                 maxLength={10}
//                 placeholder={'Enter mobile number'}
//               />
//               <InputFieldLabel
//                 marginTop={'8%'}
//                 borderWidth={1}
//                 inputLabel={'Nearby Landmark (Optional)'}
//                 name={'landmark'}
//                 maxLength={100}
//                 placeholder={'Landmark (optional)'}
//               />
//             </View>
//           </AppInputScroll>
//         </KeyboardAvoidingView>
//         <View>
//           <FormButton loading={loading} onPress={handleLogin} />
//         </View>
//       </View>
//     </Formik>
//   );
// };

// export default SenderReceiverForm;

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     marginHorizontal: 20,
//     marginTop: '5%',
//   },
//   lineView: {
//     height: 1,
//     backgroundColor: '#D9D9D9',
//     marginTop: '7%',
//     marginHorizontal: -20,
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CTA from '../components/cta/CTA';
import { Formik, useFormikContext } from 'formik';
import Spacer from '../halpers/Spacer';
import AppInputScroll from '../halpers/AppInputScroll';
import { rootStore } from '../stores/rootStore';
import InputFieldLabel from '../components/InputFieldLabel';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { senderReceiverValidations } from './formsValidation/senderReceiverValidations';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';
import { colors } from '../theme/colors';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';

const FormButton = ({ loading, onPress }) => {
  const { dirty, isValid, values } = useFormikContext();

  return (
    <CTA
      disable={!(isValid && dirty)}
      title={'Save'}
      onPress={() => onPress(values)}
      loading={loading}
      isBottom={true}
      width={'90%'}
      textTransform={'capitalize'}
    />
  );
};

const SenderReceiverForm = ({ navigation, pickDrop, item, onClose, onPressSecure, isSecure }) => {
  const { setSenderAddress, setReceiverAddress } = rootStore.myAddressStore;

  console.log('pickDrop--item', pickDrop, item);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    address_detail: item?.address ? item?.address_detail : '',
    landmark: item?.landmark ? item?.landmark : '',
    name: item?.name ? item?.name : '',
    phone: item?.phone ? item?.phone?.toString() : '',
  });

  const handleLogin = values => {
    console.log('values', values, item, pickDrop);
    const newData = {
      ...values,
      address: item?.address,
      geo_location: item?.geo_location,
      // phone:Number(phone)
    };
    console.log('newData--', newData);

    if (pickDrop == 'pick') {
      setSenderAddress(newData);
      // navigation.navigate('setLocationHistory');
      onClose();
    } else {
      setReceiverAddress(newData);
      onClose();
      // navigation.navigate('priceDetails');
    }
  };

  const getLocationName = item => {
    const nameData = item?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    return nameData[0];
  };


  const SecureTextData = () => {
    const {values, setFieldValue} = useFormikContext();
    const {receiverAddress} = rootStore.myAddressStore;
    useEffect(() => {
      if (isSecure) {
        setFieldValue('phone', receiverAddress?.phone?.toString());
      }
    }, [receiverAddress]);
    return (
     
        <TouchableOpacity
          style={styles.secureTouch}
          onPress={() => {
            onPressSecure(!isSecure);
            if (isSecure) {
              setFieldValue('phone', receiverAddress?.phone?.toString());
            }
          }}
          activeOpacity={0.9}>
          {isSecure == true ? (
            <SvgXml xml={appImagesSvg.checkBox} />
          ) : (
            <SvgXml xml={appImagesSvg.unCheckBox} />
          )}
          <Text style={styles.secureText}>Secure parcel delivery</Text>
        </TouchableOpacity>
    );
  };

  const OpenDetails = () => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={senderReceiverValidations()}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.upperText}>{pickDrop == 'pick' ? "Sender Address " : "Receiver Address"}</Text>
          <View style={styles.main}>
            <InputFieldLabel
              marginTop={'2%'}
              borderWidth={1}
              inputLabel={'Address *'}
              name={'address_detail'}
              maxLength={100}
              placeholder={'Enter Address'}
            />
            <InputFieldLabel
              marginTop={'8%'}
              borderWidth={1}
              keyboardType="number-pad"
              inputLabel={
                pickDrop == 'pick'
                  ? "Sender's mobile number *"
                  : "Receiver's mobile number *"
              }
              name={'phone'}
              maxLength={10}
              placeholder={'Enter mobile number'}
            />
            <InputFieldLabel
              marginTop={'8%'}
              borderWidth={1}
              inputLabel={
                pickDrop == 'pick' ? "Sender's Name (Optional)" : "Receiver's Name (Optional)"
              }
              name={'name'}
              maxLength={50}
              placeholder={'Enter your name'}
            />

            <InputFieldLabel
              marginTop={'8%'}
              borderWidth={1}
              inputLabel={'Nearby Landmark (Optional)'}
              name={'landmark'}
              maxLength={100}
              placeholder={'Landmark'}
            />
           {/* {pickDrop == 'drop' &&  <SecureTextData/>} */}
          </View>
          <View style={{ marginTop:hp('13%')}}>
          <FormButton loading={loading} onPress={handleLogin} />
          </View>
        </View>
      </Formik>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust if needed
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Spacer space={'3%'} />
      <AppInputScroll
        padding={true}
        keyboardShouldPersistTaps={'handled'}>
        {OpenDetails()}
      </AppInputScroll>
    </KeyboardAvoidingView>
  );
};

export default SenderReceiverForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: '5%',
  },
  lineView: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '7%',
    marginHorizontal: -20,
  },
  upperText: {
    marginHorizontal: 20,
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black
  },
  secureTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('5%'),
    width: wp('52%'),
    marginTop: '2%'
  },
  secureText: {
    marginLeft: '2%',
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black85,
  },
});
