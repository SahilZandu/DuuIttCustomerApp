import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MapRoute from '../../../components/MapRoute';
import {styles} from './styles';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import CTA from '../../../components/cta/CTA';
import Spacer from '../../../halpers/Spacer';
import AutoCompleteGooglePlaceHolder from '../../../components/AutoCompleteGooglePlaceHolder';
import Header from '../../../components/header/Header';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';

const ChooseMapLocation = ({navigation, route}) => {
  const {pickDrop, item} = route.params;
  console.log('pickDrop--', pickDrop, item);
  const [geoLocation, setGeoLocation] = useState({
    lat: '',
    lng: '',
  });
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');

  const onPressAddress = (data, details) => {
    console.log('data ,details 333', data, details);
    setName(details?.name);
    setAddress(details?.formatted_address);
    setGeoLocation(details?.geometry?.location);
  };

  useEffect(() => {
    if (Object?.keys(item)?.length > 0) {
      setGeoLocation(item?.geo_location);
      setAddress(item?.address);
      setName(item?.name);
    }
  }, [item]);

  const onHandleConfirm = () => {
    const newItem = {
      ...item,
      address: address,
      geo_location: geoLocation,
    };
    // console.log("newItem---",newItem)

    navigation.navigate('senderReceiverDetails', {
      pickDrop: pickDrop,
      item: newItem,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Choose On Map Location'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1}}>
        <MapRoute mapContainerView={{height: hp('70%')}} />
        <AutoCompleteGooglePlaceHolder onPressAddress={onPressAddress} />
      </View>
      <View style={styles.bottomPopUpContainer}>
        <View style={{paddingHorizontal: 30, marginTop: '3%'}}>
          {!address?.length > 0 ? (
            <AnimatedLoader type={'addMyAddress'} />
          ) : (
            <>
              <LocationHistoryCard
                bottomLine={true}
                item={{name: name, address: address}}
                index={0}
                onPress={() => {}}
              />
              <Spacer space={'12%'} />
              <CTA
                onPress={() => {
                  onHandleConfirm();
                }}
                title={'Confirm'}
                textTransform={'capitalize'}
                bottomCheck={10}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChooseMapLocation;
