import React, {useCallback, useEffect,useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import CTA from '../components/cta/CTA';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../commons/AppImages';
import AppInputScroll from '../halpers/AppInputScroll';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';
import PickDropLocation from '../components/PickDropLocation';
import {useFocusEffect} from '@react-navigation/native';
import {rootStore} from '../stores/rootStore';
import HomeSlider from '../components/slider/homeSlider';
import ModalPopUp from '../components/ModalPopUp';
import SenderReceiverForm from './SenderReceiverForm';
import { silderArray } from '../stores/DummyData/Home';


const RidePriceForm = ({navigation}) => {
  const {senderAddress, receiverAddress, setSenderAddress, setReceiverAddress} =
    rootStore.myAddressStore;
  const {addRequestParcelRide} = rootStore.parcelStore;
  const [loading, setLoading] = useState(false);
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [weight, setWeight] = useState(20);
  const [quantity, setQuantity] = useState(1);
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [isAddressModal, setIsAddressModal] = useState(false);
  const [isStatus, setIsStatus] = useState('');
  const [isSecure, setIsSecure] = useState(false);
 

  useFocusEffect(
    useCallback(() => {
      getCheckSenderReceiverData();
    }, []),
  );

  const getCheckSenderReceiverData = () => {
    const {senderAddress, receiverAddress} = rootStore.myAddressStore;
    console.log(
      'senderAddress,receiverAddress',
      senderAddress,
      receiverAddress,
    );
    setPickUpLocation(senderAddress?.address);
    setDropLocation(receiverAddress?.address);
  };

  const handlePrice = async () => {
    
    const newdata = {
      weight: weight,
      quantity: quantity,
      type: 'Others',
      sender_address: senderAddress,
      receiver_address: receiverAddress,
      billing_detail: {delivery_fee: 9, discount: 0, platform_fee: 10, gst: 18},
      isSecure: isSecure,
      order_type:'ride',
    };
    console.log('newdata--', newdata);

    await addRequestParcelRide(newdata, navigation, handleLoading);

  };

  const handleLoading = v => {
    setLoading(v);
  };

  const FormButton = ({loading, onPress}) => {

    return (
      <CTA
        title={'Proceed'}
        onPress={() => onPress()}
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
    <View style={{flex: 1}}>
        <>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <AppInputScroll
              Pb={'22%'}
              padding={true}
              keyboardShouldPersistTaps={'handled'}>
              <View style={{flex: 1, marginHorizontal: 20}}>
                <PickDropLocation
                  pickUpLocation={pickUpLocation}
                  dropLocation={dropLocation}
                  onChangePress={() => {
                    onChangePress();
                  }}
                  onPressPickLocation={onPressPickLocation}
                  onPressDropLocation={onPressDropLocation}
                  pick={'Pickup'}
                  drop={'Dropped'}
               
                />
              </View>
              <View style={{marginHorizontal: 10}}>
                <HomeSlider data={sliderItems} />
              </View>
            </AppInputScroll>
          </KeyboardAvoidingView>

          <View style={{backgroundColor: colors.white, height: hp('9%')}}>
            <FormButton loading={loading} onPress={handlePrice} />
          </View>
        </>

      <ModalPopUp
        isVisible={isAddressModal}
        onClose={() => {
          setIsAddressModal(false);
        }}>
        <View style={{height: hp('58%'), backgroundColor: colors.white}}>
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

const styles = StyleSheet.create({
  
});
