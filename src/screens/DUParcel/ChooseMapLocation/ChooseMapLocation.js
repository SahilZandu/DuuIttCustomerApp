import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MapRoute from '../../../components/MapRoute';
import { styles } from './styles';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import CTA from '../../../components/cta/CTA';
import Spacer from '../../../halpers/Spacer';
import AutoCompleteGooglePlaceHolder from '../../../components/AutoCompleteGooglePlaceHolder';
import Header from '../../../components/header/Header';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import { screenHeight } from '../../../halpers/matrics';
import { rootStore } from '../../../stores/rootStore';
import { appImages } from '../../../commons/AppImages';
import { filterAddress, getCurrentLocation } from '../../../components/GetAppLocation';
import { getGeoCodes, setMpaDaltaInitials } from '../../../components/GeoCodeAddress';
import MapLocationRoute from '../../../components/MapLocationRoute';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { Wrapper } from '../../../halpers/Wrapper';

let currentLocation = {
  lat: null,
  lng: null,
};
const ChooseMapLocation = ({ navigation, route }) => {
  const { setSenderAddress, setReceiverAddress, senderAddress, receiverAddress } =
    rootStore.myAddressStore;
  const { pickDrop, item, screenName } = route.params;
  const debounceTimeout = useRef(null);
  const getLocation = type => {
    // console.log('gettt', getCurrentLocation());
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  console.log('pickDrop--', pickDrop, item);
  const [geoLocation, setGeoLocation] = useState({
    lat: '',
    lng: '',
  });
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [LocationId, setLocationId] = useState('')
  const [loading, setLoading] = useState(false)

  const onPressAddress = (data, details) => {
    console.log('data ,details 333', data, details);
    setName(details?.name);
    const shortAddress = filterAddress(details?.formatted_address)
    // console.log("shortAddress----",shortAddress);
    setAddress(shortAddress);
    setGeoLocation(details?.geometry?.location);
    setLocationId(details?.place_id);
  };

  const mohaliChandigarhBounds = {
    north: 30.8258,
    south: 30.6600,
    west: 76.6600,
    east: 76.8500,
  };

  const isWithinBounds = (latitude, longitude) => {
    return (
      latitude <= mohaliChandigarhBounds.north &&
      latitude >= mohaliChandigarhBounds.south &&
      longitude >= mohaliChandigarhBounds.west &&
      longitude <= mohaliChandigarhBounds.east
    );
  };

  const handleRegionChangeComplete = (region) => {
    onHandleConfirm();
    // if (debounceTimeout.current) {
    //   clearTimeout(debounceTimeout.current);
    // }

    // debounceTimeout.current = setTimeout(() => {
    //   if (!isWithinBounds(region.lat, region.lng)) {
    //     Alert.alert(" ", `Oops! we currently don't service your ${(pickDrop == 'pick' ?"pickup":'drop')} location. Please select different location.`);
    //   } else {
    //     if (pickDrop !== 'pick' && senderAddress?.address?.length > 0) {
    //       if (!isWithinBounds(senderAddress?.geo_location?.lat, senderAddress?.geo_location?.lng)) {
    //         Alert.alert(" ", "Oops! we currently don't service your pickup location. Please select different location.");
    //       }else {
    //         onHandleConfirm()
    //        }
    //     } else if (pickDrop !== 'drop' && receiverAddress?.address?.length > 0) {
    //       if (!isWithinBounds(receiverAddress?.geo_location?.lat, receiverAddress?.geo_location?.lng)) {
    //         Alert.alert(" ", "Oops! we currently don't service your drop location. Please select different location.");
    //       }
    //       else {
    //         onHandleConfirm()
    //        }
    //     }
    //      else {
    //       onHandleConfirm()
    //      }
    //   }
    // },300); // Delay in milliseconds
  };

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation)
      setMpaDaltaInitials();
    }, [])
  )

  useEffect(() => {
    setTimeout(() => {
      if (Object?.keys(item || {})?.length > 0) {
        setGeoLocation(item?.geo_location);
        if (pickDrop == 'pick' || screenName == "priceDetails") {
          setAddress(item?.address);
          setName(item?.name);
          setLocationId(item?.location_id)
        }
      }
    }, 1000);
  }, [item]);

  useEffect(() => {
    currentLocation = {
      lat: getLocation('lat'),
      lng: getLocation('lng'),
    };
  }, []);

  const onHandleConfirm = () => {
    setLoading(true)
    const newItem = {
      ...item,
      address: address,
      geo_location: geoLocation,
      location_id: LocationId
    };
    console.log('newItem---', newItem, pickDrop);

    // console.log('newItem---', newItem, pickDrop, senderAddress, receiverAddress);

    // const isSameLocation =
    //   (newItem?.location_id || newItem?.geo_location) &&
    //   ((pickDrop === 'pick' && newItem?.location_id === receiverAddress?.location_id) ||
    //     (parseFloat(newItem?.geo_location?.lat) === parseFloat(receiverAddress?.geo_location?.lat) &&
    //       parseFloat(newItem?.geo_location?.lng) === parseFloat(receiverAddress?.geo_location?.lng)) ||
    //     (pickDrop !== 'pick' && newItem?.location_id === senderAddress?.location_id) ||
    //     (parseFloat(newItem?.geo_location?.lat) === parseFloat(senderAddress?.geo_location?.lat) &&
    //       parseFloat(newItem?.geo_location?.lng) === parseFloat(senderAddress?.geo_location?.lng)));


    // // console.log("isSameLocation--", isSameLocation);

    // if (isSameLocation) {
    //   alert("You can't choose the same location. Please choose another location.");
    //   return;
    // }

    if (
      (newItem?.location_id || newItem?.geo_location) &&
      pickDrop === 'pick' &&
      (parseFloat(newItem?.geo_location?.lat) === parseFloat(receiverAddress?.geo_location?.lat) &&
        parseFloat(newItem?.geo_location?.lng) === parseFloat(receiverAddress?.geo_location?.lng)
        || newItem?.location_id === receiverAddress?.location_id)
    ) {
      setLoading(false)
      alert("You can't choose the same location. Please choose another location.");
      return;
    } else if (
      (newItem?.location_id || newItem?.geo_location) &&
      pickDrop !== 'pick' &&
      (parseFloat(newItem?.geo_location?.lat) === parseFloat(senderAddress?.geo_location?.lat) &&
        parseFloat(newItem?.geo_location?.lng) === parseFloat(senderAddress?.geo_location?.lng)
        || newItem?.location_id === senderAddress?.location_id)
    ) {
      setLoading(false)
      alert("You can't choose the same location. Please choose another location.");
      return;
    }

    // navigation.navigate('senderReceiverDetails', {
    //   pickDrop: pickDrop,
    //   item: newItem,
    // });
    // if (pickDrop == 'pick') {
    //   setSenderAddress(newItem);
    //   setTimeout(() => {
    //     if (receiverAddress?.address?.length > 0) {
    //       navigation.navigate('priceDetails');
    //     } else {
    //       navigation.navigate('setLocationHistory');
    //     }
    //   }, 500);
    // } else {
    //   setReceiverAddress(newItem);
    //   setTimeout(() => {
    //     if (senderAddress?.address?.length > 0) {
    //       navigation.navigate('priceDetails');
    //     } else {
    //       navigation.navigate('setLocationHistory');
    //     }
    //   }, 500);
    // }
    if (pickDrop === 'pick') {
      setSenderAddress(newItem);
    } else {
      setReceiverAddress(newItem);
    }
    setTimeout(() => {

      const senderSet = pickDrop === 'pick' ? newItem : senderAddress;
      const receiverSet = pickDrop === 'drop' ? newItem : receiverAddress;
      if (senderSet?.address?.length > 0 && receiverSet?.address?.length > 0) {
        setTimeout(() => {
          navigation.navigate('priceDetails');
        },100)
      } else {
        navigation.navigate('setLocationHistory');
      }
      setLoading(false)
    }, 800);
  };

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
    setGeoLocation(addressData?.geo_location);
    setLocationId(addressData?.place_Id)
  };

  const handleTouchAddress = async loaction => {
    console.log('loaction---', loaction);
    const addressData = await getGeoCodes(
      loaction?.latitude,
      loaction?.longitude,
    );
    // console.log('addressData', addressData);
    const nameData = addressData?.address?.split(',');
    // console.log('nameData--',nameData, nameData[0]);
    let newLocation = {
      lat: loaction?.latitude,
      lng: loaction?.longitude,
    };
    setName(nameData[0]);
    setAddress(addressData?.address);
    // setGeoLocation(addressData?.geo_location);
    setGeoLocation(newLocation);
    setLocationId(addressData?.place_Id)
  };

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      title={'Choose On Map Location'}
      backArrow={true}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
        title={'Choose On Map Location'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        <View style={{ flex: 1 }}>
          <MapLocationRoute
            mapContainerView={
              Platform.OS == 'ios'
                ? { height: (pickDrop == 'pick' || screenName == "priceDetails" || address?.length > 0) ? screenHeight(70) : screenHeight(100) }
                : { height: (pickDrop == 'pick' || screenName == "priceDetails" || address?.length > 0) ? screenHeight(74) : screenHeight(100) }
            }
            origin={geoLocation}
            onTouchLocation={handleTouchAddress}
            height={Platform.OS == 'ios'
              ? (pickDrop == 'pick' || screenName == "priceDetails" || address?.length > 0) ? screenHeight(70) : screenHeight(100)
              : (pickDrop == 'pick' || screenName == "priceDetails" || address?.length > 0) ? screenHeight(74) : screenHeight(100)}
          />
          {/* <MapRoute
          mapContainerView={
            Platform.OS == 'ios'
              ? {height: screenHeight(70)}
              : {height: screenHeight(74)}
          }
          origin={geoLocation}
        /> */}
          <AutoCompleteGooglePlaceHolder
            onPressAddress={onPressAddress}
            address={address}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              handleCurrentAddress();
            }}
            style={[styles.currentLocTouch, { bottom: (pickDrop == 'pick' || screenName == "priceDetails" || address?.length > 0) ? hp('24%') : hp('4%') }]}>
            <View style={styles.currentLocView}>
              <Image
                resizeMode="contain"
                style={styles.currentLocImage}
                source={appImages.currentLocationIcon}
              />
              <Text style={styles.currentLocText}>Current location</Text>
            </View>
          </TouchableOpacity>
        </View>
        {(pickDrop == 'pick' || screenName == "priceDetails" || address?.length > 0) &&
          <View style={styles.bottomPopUpContainer}>
            <View style={{ paddingHorizontal: 30, marginTop: '3%' }}>
              {!address?.length > 0 ? (
                <AnimatedLoader type={'addMyAddress'} />
              ) : (
                <>

                  <LocationHistoryCard
                    bottomLine={true}
                    item={{ name: name, address: address }}
                    index={0}
                    onPress={() => { }}
                  />
                  <Spacer space={'10%'} />
                  <CTA
                    loading={loading}
                    onPress={() => {
                      // onHandleConfirm();
                      handleRegionChangeComplete(geoLocation);
                    }}
                    title={'Confirm'}
                    textTransform={'capitalize'}
                    bottomCheck={10}
                  />
                </>
              )}
            </View>
          </View>
        }
      </View>
    </Wrapper>
  );
};

export default ChooseMapLocation;
