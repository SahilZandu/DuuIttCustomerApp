import React, { useCallback, useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import CTA from '../components/cta/CTA';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../halpers/AppInputScroll';
import { colors } from '../theme/colors';
import PickDropLocation from '../components/PickDropLocation';
import { useFocusEffect } from '@react-navigation/native';
import { rootStore } from '../stores/rootStore';
import HomeSlider from '../components/slider/homeSlider';
import ModalPopUp from '../components/ModalPopUp';
import SenderReceiverForm from './SenderReceiverForm';
import { silderArray } from '../stores/DummyData/Home';
import IncompletedAppRule from '../halpers/IncompletedAppRule';
import MapRoute from '../components/MapRoute';
import Spacer from '../halpers/Spacer';

const RidePriceForm = ({ navigation }) => {
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
  const [isAddressModal, setIsAddressModal] = useState(false);
  const [isStatus, setIsStatus] = useState('');
  const [isSecure, setIsSecure] = useState(false);
  const [appUserData, setAppUserData] = useState(appUser ?? {});

  useFocusEffect(
    useCallback(() => {
      getCheckSenderReceiverData();
      const { appUser } = rootStore.commonStore;
      setAppUserData(appUser);
    }, []),
  );

  console.log('appUser ride --', appUser);

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
  const FormButton = ({ loading, onPress }) => {
    return (
      <CTA
        title={'Proceed'}
        onPress={() => onPress()}
        loading={loading}
        isBottom={true}
        width={'90%'}
        textTransform={'capitalize'}
      />
    )
  };


  const handlePrice = async () => {
    const newdata = {
      weight: weight,
      quantity: quantity,
      type: 'Others',
      sender_address: senderAddress,
      receiver_address: receiverAddress,
      billing_detail: {
        delivery_fee: 0,
        distance_fee: 0,
        discount: 0,
        platform_fee: 2,
        gst_fee: 18
      },
      isSecure:isSecure,
      order_type: 'ride',
    };
    console.log('newdata--', newdata);

    await addRequestParcelRide(newdata, navigation, handleLoading)
  };

  const handleLoading = (v) => {
    setLoading(v)
  }


  const onPressPickLocation = () => {
    navigation.navigate('chooseMapLocation', {
      pickDrop: 'pick',
      item: senderAddress,
    });
  };

  const onPressDropLocation = () => {
    navigation.navigate('chooseMapLocation', {
      pickDrop: 'drop',
      item: receiverAddress,
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

  return (
    <View style={{ flex: 1 }}>
      <>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <AppInputScroll
            Pb={'15%'}
            padding={true}
            keyboardShouldPersistTaps={'handled'}>
            <MapRoute
              origin={senderAddress?.geo_location}
              destination={receiverAddress?.geo_location}
              mapContainerView={{ height: Platform.OS == 'ios' ? hp('28%') : hp('28%') }}
            />
             <Spacer space={hp('2%')}/>
            <View style={{ flex: 1, marginHorizontal: 20, }}>
              <PickDropLocation
                pickUpLocation={pickUpLocation}
                dropLocation={dropLocation}
                onChangePress={() => {
                  onChangePress();
                }}
                onPressPickLocation={onPressPickLocation}
                onPressDropLocation={onPressDropLocation}
                pick={'Pickup location'}
                drop={'Dropped location'}
              />
            </View>
            <View style={{ marginHorizontal: 10 }}>
              <HomeSlider data={sliderItems} />
            </View>
          </AppInputScroll>
        </KeyboardAvoidingView>

        <View style={{ backgroundColor: colors.appBackground, height: hp('9%') }}>
          <FormButton loading={loading} onPress={handlePrice} />
        </View>
      </>

      {(appUserData?.profile_pic == null ||
        appUserData?.profile_pic?.length === 0) && (
          <IncompletedAppRule
            title={'App Confirmation'}
            message={'Please complete your profile first.'}
            onHanlde={() =>
              navigation.navigate('profile', { screenName: 'rideRoute' })
            }
          />
        )}

      <ModalPopUp
        isVisible={isAddressModal}
        onClose={() => {
          setIsAddressModal(false);
        }}>
        <View style={{ height: hp('58%'), backgroundColor: colors.white }}>
          <SenderReceiverForm
            navigation={navigation}
            pickDrop={isStatus}
            item={isStatus == 'pick' ? senderAddress : receiverAddress}
            onClose={() => {
              setIsAddressModal(false);
            }}
          />
        </View>
      </ModalPopUp>
    </View>
  );
};

export default RidePriceForm;

