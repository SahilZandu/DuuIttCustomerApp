import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import CTA from '../components/cta/CTA';
import { Formik, useFormik, useFormikContext } from 'formik';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import { appImages, appImagesSvg } from '../commons/AppImages';
import { SvgXml } from 'react-native-svg';
import AppInputScroll from '../halpers/AppInputScroll';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';
import { colors } from '../theme/colors';
import PickDropLocation from '../components/PickDropLocation';
import { useFocusEffect } from '@react-navigation/native';
import { rootStore } from '../stores/rootStore';
import HomeSlider from '../components/slider/homeSlider';
import DotTextComp from '../components/DotTextComp';
import ModalPopUp from '../components/ModalPopUp';
import SenderReceiverForm from './SenderReceiverForm';
import InputFieldLabel from '../components/InputFieldLabel';
import { senderReceiverValidations } from './formsValidation/senderReceiverValidations';
import { silderArray } from '../stores/DummyData/Home';
import IncompletedAppRule from '../halpers/IncompletedAppRule';
import MapRoute from '../components/MapRoute';

const parcelInst = [
  {
    id: 0,
    title: 'Parcel items maximum weight up to 20kg',
  },
  {
    id: 1,
    title: 'Avoid illegal items in package',
  },
  {
    id: 2,
    title: 'Don’t send glass products. It can cause damage issue',
  },
  {
    id: 3,
    title: 'You can send liquid products upto (1kg-5kg)',
  },
];

const PriceDetailsForm = ({ navigation }) => {
  const { senderAddress, receiverAddress, setSenderAddress, setReceiverAddress } =
    rootStore.myAddressStore;
  const { addRequestParcelRide } = rootStore.parcelStore;
  const { appUser } = rootStore.commonStore;
  const [loading, setLoading] = useState(false);
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [weight, setWeight] = useState(20);
  const [quantity, setQuantity] = useState(1);
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [isAddressModal, setIsAddressModal] = useState(true);
  const [isStatus, setIsStatus] = useState('drop');
  const [isSecure, setIsSecure] = useState(true);
  const [initialValues, setInitialValues] = useState({
    phone: receiverAddress?.phone?.toString(),
  });
  const [appUserData, setAppUserData] = useState(appUser ?? {});

  useFocusEffect(
    useCallback(() => {
      getCheckSenderReceiverData();
      const { appUser } = rootStore.commonStore;
      setAppUserData(appUser);
    }, []),
  );
  console.log('appUser parcel --', appUser);

  const getCheckSenderReceiverData = () => {
    const { senderAddress, receiverAddress } = rootStore.myAddressStore;
    console.log(
      'senderAddress,receiverAddress',
      senderAddress,
      receiverAddress,
    );
    setPickUpLocation(senderAddress?.address);
    setDropLocation(receiverAddress?.address);
  };

  const handlePrice = async values => {
    Keyboard.dismiss();
    let newReceiverAddress = { ...receiverAddress };
    if (isSecure == true && values?.phone) {
      newReceiverAddress = {
        ...receiverAddress,
        phone: Number(values?.phone),
      };
    }

    const newdata = {
      weight: weight,
      quantity: quantity,
      type: 'Others',
      sender_address: senderAddress,
      receiver_address: newReceiverAddress,
      // billing_detail: {delivery_fee: 9, discount: 0, platform_fee: 10, gst: 18},
      billing_detail: {
        delivery_fee: 0,
        distance_fee: 0,
        discount: 0,
        platform_fee: 2,
        gst_fee: 18,
      },
      isSecure: isSecure,
      order_type: 'parcel',
    };
    console.log('newdata--', newdata);

    await addRequestParcelRide(newdata, navigation, handleLoading);

    // navigation.navigate('priceConfirmed',{item:newdata});
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const FormButton = ({ loading, onPress }) => {
    const { dirty, isValid, values } = useFormikContext();
    return (
      <CTA
        // disable={weight == '' || weight > 20}
        disable={
          isSecure == true && values?.phone?.toString().length >= 10
            ? false
            : !(isValid && dirty) && isSecure == true
        }
        title={'Proceed'}
        onPress={() => onPress(values)}
        loading={loading}
        isBottom={true}
        width={'90%'}
        textTransform={'capitalize'}
      />
    );
  };

  const onPressPickLocation = () => {
    navigation.navigate('chooseMapLocation', {
      pickDrop: 'pick',
      item: senderAddress,
      screenName: 'priceDetails'
    });
  };

  const onPressDropLocation = () => {
    navigation.navigate('chooseMapLocation', {
      pickDrop: 'drop',
      item: receiverAddress,
      screenName: 'priceDetails'
    });
  };

  const onChangePress = () => {
    if (
      senderAddress?.address?.length > 0 &&
      receiverAddress?.address?.length > 0
    ) {
      setSenderAddress(receiverAddress);
      setPickUpLocation(receiverAddress?.address);
      setReceiverAddress(senderAddress);
      setDropLocation(senderAddress?.address);
    } else if (senderAddress?.address?.length > 0) {
      setReceiverAddress(senderAddress);
      setDropLocation(senderAddress?.address);
      setSenderAddress({});
    } else if (receiverAddress?.address?.length > 0) {
      setSenderAddress(receiverAddress);
      setPickUpLocation(receiverAddress?.address);
      setReceiverAddress({});
    }
  };

  const SecureTextData = () => {
    const { values, setFieldValue } = useFormikContext();
    const { receiverAddress } = rootStore.myAddressStore;
    useEffect(() => {
      if (isSecure) {
        setFieldValue('phone', receiverAddress?.phone?.toString());
      }
    }, [receiverAddress]);
    return (
      <View style={styles.secureMainView}>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={styles.secureTouch}
          onPress={() => {
            setIsSecure(!isSecure);
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
        <Spacer space={'-5%'} />
        {(isSecure && loading == false) && (
          <TouchableOpacity activeOpacity={0.9}
            style={{ overflow: 'visible' }}
            onPress={() => {
              setIsStatus('drop');
              setIsAddressModal(true);
            }}>
            <View pointerEvents="none">
              <InputFieldLabel
                // onRightPress={()=>{alert("yes")}}
                editable={false}
                //  rightIcon={true}
                borderWidth={1}
                inputLabel={"Receiver's mobile number"}
                keyboardType="number-pad"
                name={'phone'}
                placeholder={'Enter mobile number'}
                maxLength={10}
                showErrorMsg={true}
              />
            </View>
          </TouchableOpacity>

        )}
      </View>
    );
  };

  const onPressSecure = (data) => {
    setIsSecure(data)
  }

  return (
    <View style={{ flex: 1 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={senderReceiverValidations()}>
        <>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <AppInputScroll
              Pb={hp('40%')}
              padding={true}
              keyboardShouldPersistTaps={'handled'}>
              <MapRoute
                origin={senderAddress?.geo_location}
                destination={receiverAddress?.geo_location}
                mapContainerView={{
                  height: Platform.OS == 'ios' ? hp('25%') : hp('25%'),
                }}
              />
              <Spacer space={hp('2%')} />
              <View style={{ flex: 1, marginHorizontal: 20 }}>
                <PickDropLocation
                  pickUpLocation={pickUpLocation}
                  dropLocation={dropLocation}
                  onChangePress={() => {
                    onChangePress();
                  }}
                  onPressPickLocation={onPressPickLocation}
                  onPressDropLocation={onPressDropLocation}
                  addOnPick={() => {
                    setIsStatus('pick');
                    setIsAddressModal(true);
                  }}
                  addOnDrop={() => {
                    setIsStatus('drop');
                    setIsAddressModal(true);
                  }}
                />
                <SecureTextData />

                <View style={{ marginTop: hp('1%') }}>
                  <Text style={styles.parcelInstView}>Parcel Instructions</Text>

                  <View style={styles.parcelInstInnerView}>
                    {parcelInst?.map((item, i) => {
                      return (
                        <DotTextComp
                          title={item?.title}
                          index={i}
                          data={parcelInst}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
              <View style={{ marginHorizontal: 10 }}>
                <HomeSlider data={sliderItems} />
              </View>
            </AppInputScroll>
          </KeyboardAvoidingView>

          <View
            style={{ backgroundColor: colors.appBackground, height: hp('9%') }}>
            <FormButton loading={loading} onPress={handlePrice} />
          </View>
        </>
      </Formik>
      {/* {(appUserData?.profile_pic == null ||
        appUserData?.profile_pic?.length === 0) && (
        <IncompletedAppRule
          title={'App Confirmation'}
          message={'Please complete your profile first.'}
          onHanlde={() =>
            navigation.navigate('profile', {screenName: 'parcelRoute'})
          }
        />
      )} */}
      <ModalPopUp
        isVisible={isAddressModal}
        onClose={() => {
          setIsAddressModal(false);
        }}>
        <View
          style={{ height: hp('58%'), backgroundColor: colors.appBackground }}>
          <SenderReceiverForm
            navigation={navigation}
            pickDrop={isStatus}
            item={isStatus == 'pick' ? senderAddress : receiverAddress}
            onClose={() => {
              setIsAddressModal(false);
            }}
            onPressSecure={onPressSecure}
            isSecure={isSecure}
          />
        </View>
      </ModalPopUp>
    </View>
  );
};

export default PriceDetailsForm;

const styles = StyleSheet.create({
  weightText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  weightTextSurface: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    justifyContent: 'center',
    marginTop: '5%',
  },
  weightInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  weightImage: {
    width: 30,
    height: 30,
  },
  weightTextInput: {
    width: wp('64%'),
    height: hp('7%'),
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    marginHorizontal: 10,
  },
  weightKGText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  quantityText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  quantitySurface: {
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    justifyContent: 'center',
    marginTop: '5%',
  },
  quantitInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  quantity: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '4%',
  },
  touchNegative: {
    backgroundColor: colors.colorD9,
    height: 20,
    width: 20,
    borderRadius: 100,
    justifyContent: 'center',
  },
  negativeImage: {
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  touchPositive: {
    backgroundColor: colors.main,
    height: 20,
    width: 20,
    borderRadius: 100,
    justifyContent: 'center',
  },
  positiveImage: {
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  categoriesText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  parcelMaxWeight: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '3%',
  },
  parcelInstView: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '3%',
  },
  parcelInstInnerView: {
    backgroundColor: colors.colorD6,
    borderRadius: 10,
    marginTop: '3%',
  },
  secureMainView: {
    marginTop: '-2%',
    // marginHorizontal: 20,
  },
  secureTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('5%'),
    width: wp('52%'),
  },
  secureText: {
    marginLeft: '2%',
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black85,
  },
});
