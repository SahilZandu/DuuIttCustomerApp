import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../theme/fonts/fonts';
import { colors } from '../../../theme/colors';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/header/Header';
import MapRouteMarker from '../../../components/MapRouteMarker';
import AutoCompleteGooglePlaceHolder from '../../../components/AutoCompleteGooglePlaceHolder';
import { Formik, useFormikContext } from 'formik';
import FieldInput from '../../../components/FieldInput';
import Spacer from '../../../halpers/Spacer';
import CTA from '../../../components/cta/CTA';
import { Strings } from '../../../translates/strings';
import { addMyAddressValidations } from '../../../forms/formsValidation/addMyAddressValidations';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import { getCurrentLocation } from '../../../components/GetAppLocation';
import { getGeoCodes, setMpaDaltaInitials } from '../../../components/GeoCodeAddress';
import { appImages } from '../../../commons/AppImages';
import Modal from 'react-native-modal';
import Tabs2 from '../../../components/Tabs2';
import { Surface } from 'react-native-paper';
import { rootStore } from '../../../stores/rootStore';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import InputFieldLabel from '../../../components/InputFieldLabel';
import MapLocationRoute from '../../../components/MapLocationRoute';

let currentLocation = {
  lat: null,
  lng: null,
};
export default function AddMyAddress({ navigation, route }) {
  const { type, data, screenName } = route.params;

  console.log("type, data, screenName", type, data, screenName);

  const { myAddress } = rootStore.myAddressStore;

  const getLocation = type => {
    // console.log('gettt', getCurrentLocation());
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  const [loading, setLoading] = useState(false);
  const [geoLocation, setGeoLocation] = useState({
    lat: getLocation('lat'),
    lng: getLocation('lng'),
  });
  const [address, setAddress] = useState('');
  const [loactionId, setLocationId] = useState('');
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('Home');

  const [initialValues, setInitialValues] = useState({
    changeAdress: address ?? '',
    changeTitle: 'Home',
    name: '',
    phone: '',
    house: '',
    landmark: '',
    id: data?._id,
  });
  const [loadingAddress, setLoadingAddress] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setMpaDaltaInitials();
      handleAndroidBackButton(navigation);
      if (type == 'add') {
        getCurrentAddress();
      }
    }, [type]),
  );

  const tabs = [
    { id: 0, text: 'Home', icon: appImages.homeLocation },
    { id: 1, text: 'Work', icon: appImages.workLocation },
    { id: 2, text: 'Hotel', icon: appImages.hotelLocation },
    { id: 3, text: 'Other', icon: appImages.addressLocation },
  ];

  useEffect(() => {

    if (data) {
      console.log('data---', data);
      const nameData = data?.address?.split(',');
      setGeoLocation(data?.geo_location);
      setAddress(data?.address);
      setLocationId(data?.location_id);
      setName(nameData[0]);
      setTitle(data?.title);
      setInitialValues({
        name: data?.name,
        phone: data?.phone?.toString(),
        house: data?.address_detail,
        landmark: data?.landmark,
        id: data?._id,
      });
    }
    else {
      setGeoLocation({
        lat: getLocation('lat'),
        lng: getLocation('lng'),
      });
    }
  }, [data]);

  useEffect(() => {
    currentLocation = {
      lat: getLocation('lat'),
      lng: getLocation('lng'),
    }
  }, []);

  useEffect(() => {
    if (address?.length > 0) {
      setLoadingAddress(false);
    } else {
      setTimeout(() => {
        setLoadingAddress(false);
      }, 2000);
    }
  }, [address]);

  const getCurrentAddress = async () => {
    const addressData = await getGeoCodes(geoLocation?.lat?.toString(), geoLocation?.lng?.toString());
    // console.log('addressData', addressData);
    const nameData = addressData?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    setName(nameData[0]);
    setAddress(addressData?.address);
    setLocationId(addressData?.place_Id);
    setGeoLocation(addressData?.geo_location);
  };

  const FormButton = ({ loading, onPress }) => {
    const { dirty, isValid, values } = useFormikContext();
    return (
      <CTA
        width={wp('90%')}
        disable={!(isValid && dirty)}
        title={Strings.save}
        onPress={() => onPress(values)}
        loading={loading}
      />
    );
  };

  const handleSvae = async values => {
    // console.log('values--', values,address ,title,geoLocation);
    await myAddress(
      type,
      values,
      title,
      address,
      geoLocation,
      loactionId,
      onSuccess,
      handleLoading,
    );
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onSuccess = () => {
    setVisible(false);
    setTimeout(() => {
      if (screenName == 'home' || screenName == 'cart') {
        navigation.goBack();
      } else {
        navigation.navigate(screenName, { screen: 'home' });
      }
    }, 300);
  };

  const onPressAddress = (data, details) => {
    setName(details?.name);
    setAddress(details?.formatted_address);
    setGeoLocation(details?.geometry?.location);
    setLocationId(details?.place_id);
  };

  const handleConfirm = () => {
    console.log('geoLocation--', geoLocation, name, address);
    setVisible(true);
  };


  const TabsWithFormik = ({ tabs }) => {
    const { setFieldValue, values } = useFormikContext();
    const handleTabPress = (text) => {
      console.log('Selected Tab:', text);
      setFieldValue('changeTitle', text);
      setTitle(text);
    };

    return (
      <Tabs2
        tabs={tabs}
        tabPress={handleTabPress}
        title={title}
      />
    );
  };


  // const handleTabPress = async text => {
  //   const {
  //       setFieldTouched,
  //       handleChange,
  //       values,
  //       errors,
  //       touched,
  //       isValid,
  //       dirty,
  //       setFieldValue,
  //     } = useFormikContext();
  //   console.log('text--', text);
  //   setFieldValue('changeTitle', text);
  //   setTitle(text);

  // };

  const OpenDetails = () => {

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={addMyAddressValidations()}>
        <View style={{ marginTop: '2%', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: RFValue(17),
              fontFamily: fonts.semiBold,
              color: colors.black,
              marginHorizontal: 20,
            }}>
            Add New Address
          </Text>
          <Spacer space={'2%'} />
          {/* <Tabs2 tabs={tabs} tabPress={handleTabPress} title={title} /> */}
          {<TabsWithFormik tabs={tabs} />}
          <Surface
            elevation={3}
            style={{
              shadowColor: colors.black50,
              backgroundColor: colors.white,
              borderRadius: 10,
              height: hp('11%'),
              justifyContent: 'center',
              marginTop: '5%',
              marginHorizontal: 20,
            }}>
            <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
              <Text
                style={{
                  width: wp('66%'),
                  fontSize: RFValue(12),
                  fontFamily: fonts.medium,
                  color: colors.color95,
                  lineHeight: 22,
                }}>
                {address}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setVisible(false);
                }}
                style={{ justifyContent: 'center', marginLeft: '1%' }}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontFamily: fonts.semiBold,
                    color: '#E70000',
                  }}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          </Surface>
          <View style={{ marginHorizontal: 20 }}>
            <InputFieldLabel
              borderWidth={1}
              inputLabel={'Flat / House no / Floor / Building'}
              name={'house'}
              placeholder={'e.g. #109'}
              maxLength={100}
            />
            <InputFieldLabel
              borderWidth={1}
              inputLabel={'Nearby landmark (Optional)'}
              name={'landmark'}
              placeholder={'e.g. Bidu biotique'}
              maxLength={100}
            />
            <InputFieldLabel
              borderWidth={1}
              inputLabel={'User Name'}
              name={'name'}
              placeholder={'Enter your name'}
              maxLength={50}
            />
            <InputFieldLabel
              keyboardType={'phone-pad'}
              borderWidth={1}
              inputLabel={'User Phone Number'}
              name={'phone'}
              placeholder={'Enter your phone number'}
              maxLength={10}
            />
          </View>

          <Spacer space={'10%'} />
          <FormButton loading={loading} onPress={handleSvae} />
        </View>
      </Formik>
    );
  };

  // const OpenDetails = () => {
  //   const [visible, setVisible] = useState(false);
  //   const [loading, setLoading] = useState(false);

  //   // const initialValues = {
  //   //   title: '',         // For Tabs2 selected value
  //   //   address: '',       // For address
  //   //   house: '',
  //   //   landmark: '',
  //   //   name: '',
  //   //   phone: '',
  //   // };

  //   const handleSave = (values) => {
  //     console.log('Form submitted values:', values);
  //     // Submit your form logic here
  //   };

  //   return (
  //     <Formik
  //       initialValues={initialValues}
  //       validationSchema={addMyAddressValidations()}
  //       onSubmit={handleSave}
  //       enableReinitialize
  //     >
  //       {({ handleSubmit, setFieldValue, values }) => (

  //         <View style={{ marginTop: '2%', justifyContent: 'center'}}>
  //           <Text
  //             style={{
  //               fontSize: RFValue(17),
  //               fontFamily: fonts.semiBold,
  //               color: colors.black,
  //               marginHorizontal: 20,
  //             }}
  //           >
  //             Add New Address
  //           </Text>

  //           <Spacer space={'2%'} />

  //           {/* Tabs2 with Formik update */}
  //           <Tabs2
  //             tabs={tabs}
  //             tabPress={(selectedTab) => {handleTabPress(selectedTab), setFieldValue('changeTitle', selectedTab) }}
  //             title={values.title}
  //           />

  //           {/* Address Surface */}
  //           <Surface
  //             elevation={3}
  //             style={{
  //               shadowColor: colors.black50,
  //               backgroundColor: colors.white,
  //               borderRadius: 10,
  //               height: hp('11%'),
  //               justifyContent: 'center',
  //               marginTop: '5%',
  //               marginHorizontal: 20,
  //             }}
  //           >
  //             <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
  //               <Text
  //                onPressIn={()=> {setFieldValue('changeAdress', address)}}
  //                 style={{
  //                   width: wp('66%'),
  //                   fontSize: RFValue(12),
  //                   fontFamily: fonts.medium,
  //                   color: colors.color95,
  //                   lineHeight: 22,
  //                 }}
  //                 > {address ? address : 'Select address'}
  //               </Text>

  //               <TouchableOpacity
  //                 activeOpacity={0.8}
  //                 onPress={() => {
  //                   setVisible(false)  // open address picker modal
  //                 }}
  //                 style={{ justifyContent: 'center', marginLeft: '1%' }}
  //               >
  //                 <Text
  //                   style={{
  //                     fontSize: RFValue(14),
  //                     fontFamily: fonts.semiBold,
  //                     color: '#E70000',
  //                   }}
  //                 >
  //                   Change
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           </Surface>

  //           <View style={{ marginHorizontal: 20 }}>
  //             <InputFieldLabel
  //               borderWidth={1}
  //               inputLabel={'Flat / House no / Floor / Building'}
  //               name={'house'}
  //               placeholder={'e.g. #109'}
  //               maxLength={100}
  //             />

  //             <InputFieldLabel
  //               borderWidth={1}
  //               inputLabel={'Nearby landmark (Optional)'}
  //               name={'landmark'}
  //               placeholder={'e.g. Bidu biotique'}
  //               maxLength={100}
  //             />

  //             <InputFieldLabel
  //               borderWidth={1}
  //               inputLabel={'User Name'}
  //               name={'name'}
  //               placeholder={'Enter your name'}
  //               maxLength={50}
  //             />

  //             <InputFieldLabel
  //               keyboardType={'phone-pad'}
  //               borderWidth={1}
  //               inputLabel={'User Phone Number'}
  //               name={'phone'}
  //               placeholder={'Enter your phone number'}
  //               maxLength={10}
  //             />
  //           </View>

  //           <Spacer space={'10%'} />

  //           {/* Submit button */}
  //           <FormButton loading={loading} onPress={handleSubmit} />
  //         </View>
  //       )}
  //     </Formik>
  //   );
  // };




  const handleCurrentAddress = async () => {
    const addressData = await getGeoCodes(
      currentLocation?.lat,
      currentLocation?.lng,
    );
    // console.log('addressData', addressData);
    const nameData = addressData?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    setName(nameData[0]);
    setAddress(addressData?.address);
    setLocationId(addressData?.place_Id);
    setGeoLocation(addressData?.geo_location);
  };

  const handleTouchAddress = async loaction => {
    console.log('loaction---', loaction);
    const addressData = await getGeoCodes(
      loaction?.latitude,
      loaction?.longitude,
    );
    // console.log('addressData', addressData);
    let newLocation = {
      lat: loaction?.latitude,
      lng: loaction?.longitude,
    };
    const nameData = addressData?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    setName(nameData[0]);
    setAddress(addressData?.address);
    setLocationId(addressData?.place_Id);
    //setGeoLocation(addressData?.geo_location);
    setGeoLocation(newLocation);
  };

  return (
    <View style={styles.container}>
      <Header
        title={type == 'add' ? 'Add My Address' : 'Update My Address'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.main}>
        {/* <MapRouteMarker
          mapContainerView={{
            height: Platform.OS == 'ios' ? hp('66%') : hp('74%'),
          }}
          origin={geoLocation}
        /> */}
        {(geoLocation?.lat && geoLocation?.lng) &&
          <>
            <MapLocationRoute
              mapContainerView={{
                height: Platform.OS == 'ios' ? hp('66%') : hp('74%'),
              }}
              origin={geoLocation}
              onTouchLocation={handleTouchAddress}
              height={Platform.OS == 'ios' ? hp('66%') : hp('74%')}
            />

            <AutoCompleteGooglePlaceHolder
              onPressAddress={onPressAddress}
              address={address}
            />
          </>}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleCurrentAddress();
          }}
          style={styles.currentLocTouch}>
          <View style={styles.currentLocView}>
            <Image
              resizeMode="contain"
              style={styles.currentLocImage}
              source={appImages.currentLocationIcon}
            />
            <Text style={styles.currentLocText}>Current location</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.addressView}>
          {!address?.length > 0 ? (
            <View>
              {loadingAddress == true ? (
                <AnimatedLoader type={'addMyAddress'} />
              ) : (
                <Text style={styles.chooseText}>Please choose location...</Text>
              )}
            </View>
          ) : (
            <View style={styles.addressContainView}>
              <LocationHistoryCard
                bottomLine={true}
                item={{
                  name: name,
                  address: address,
                }}
                index={0}
                onPress={() => { }}
              />
              <Spacer space={hp('3.5%')} />
              <CTA
                disable={!(address || name)}
                onPress={() => {
                  handleConfirm();
                }}
                title={'Confirm'}
                textTransform={'capitalize'}
                bottomCheck={10}
              />
            </View>
          )}
        </View>

        <Modal
          animationType="slide"
          isVisible={visible}
          // swipeDirection="down"
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ justifyContent: 'flex-end', margin: 0 }}>
          <TouchableOpacity
            onPress={() => {
              setVisible(false);
            }}
            activeOpacity={0.8}
            style={{ alignSelf: 'center' }}>
            <Image
              resizeMode="contain"
              style={{ height: 45, width: 45 }}
              source={appImages.crossClose} // Your icon image
            />
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginTop: '2%',
            }}>
            <View
              style={{
                backgroundColor: colors.appBackground,
                width: '100%',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                // paddingBottom: '12%',
                height: hp('82%'),
              }}>
              <Spacer space={'2%'} />
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust if needed
                behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <AppInputScroll
                  padding={true}
                  keyboardShouldPersistTaps={'handled'}
                  Pb={hp('15%')}>
                  {OpenDetails()}
                </AppInputScroll>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import Popover, { PopoverPlacement } from 'react-native-popover-view';

// function AddMyAddress() {
//   const [showPopover, setShowPopover] = useState(false);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {/* Button to open Popover */}
//       <TouchableOpacity onPress={() => setShowPopover(true)} style={styles.button}>
//         <Text style={styles.buttonText}>Open Popover</Text>
//       </TouchableOpacity>

//       {/* Popover Component */}
//       <Popover
//         placement={PopoverPlacement.BOTTOM}
//         isVisible={showPopover}
//         onRequestClose={() => setShowPopover(false)} // Close on tap outside
//         from={(
//           <TouchableOpacity onPress={() => setShowPopover(true)}>
//             <Text>Press here to open popover!</Text>
//           </TouchableOpacity>
//         )}
//       >
//         <View style={{ padding: 20 }}>
//           <Text style={{ marginBottom: 10 }}>Choose an Option</Text>

//           {/* First Button */}
//           <TouchableOpacity style={styles.popoverButton} onPress={() => setShowPopover(false)}>
//             <Text style={styles.buttonText}>Button 1</Text>
//           </TouchableOpacity>

//           {/* Second Button */}
//           <TouchableOpacity style={styles.popoverButton} onPress={() => setShowPopover(false)}>
//             <Text style={styles.buttonText}>Button 2</Text>
//           </TouchableOpacity>
//         </View>
//       </Popover>
//     </View>
//   );
// }

// const styles = {
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//   },
//   popoverButton: {
//     backgroundColor: '#28a745',
//     padding: 10,
//     marginTop: 10,
//     borderRadius: 5,
//   },
// };

// export default AddMyAddress;
