import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../../../commons/AppImages';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import CTA from '../../../components/cta/CTA';
import { getGeoCodes, getMpaDalta } from '../../../components/GeoCodeAddress';
import { getCurrentLocation } from '../../../components/GetAppLocation';
import Header from '../../../components/header/Header';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import PickDropLocation from '../../../components/PickDropLocation';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import Spacer from '../../../halpers/Spacer';
import { pickUpHistory } from '../../../stores/DummyData/Home';
import { rootStore } from '../../../stores/rootStore';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts/fonts';
import { styles } from './styles';

let geoLocation = {
  lat: null,
  lng: null,
}

const SetLocationHistory = ({ navigation }) => {
  const {
    getMyAddress,
    getAddress,
    setSenderAddress,
    setReceiverAddress,
    senderAddress,
    receiverAddress,
  } = rootStore.myAddressStore;

  const getLocation = type => {
    // console.log('gettt', getCurrentLocation());
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  const debounceTimeout = useRef(null);
  const [loading, setLoading] = useState(getAddress?.length > 0 ? false : true);
  const [pickDrop, setPickDrop] = useState('pick');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  // const [lat, setlat] = useState(30.7076);
  // const [long, setlong] = useState(76.715126);
  const [myAddress, setMyAddress] = useState(getAddress);
  const [geoLocation1, setGeoLocation] = useState({
    lat: getLocation('lat'),
    lng: getLocation('lng'),
  });
  const [geoLocation2, setGeoLocation2] = useState({
    lat: getLocation('lat'),
    lng: getLocation('lng'),
  });
  const [locationId, setLocationId] = useState('')
  const [currentAddress, setCurrentAddress] = useState('');
  const [name, setName] = useState('');

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      getAddressDetails();
      // getCheckSenderReciever();
    }, []),
  );

  useEffect(() => {
    getCheckSenderReciever();
  }, [senderAddress, receiverAddress])

  useEffect(() => {
    geoLocation = {
      lat: getLocation('lat'),
      lng: getLocation('lng'),
    };

    setTimeout(() => {
      getCurrentAddress();
    }, 500);
  }, []);

  const getCheckSenderReciever = () => {
    const { senderAddress, receiverAddress } = rootStore.myAddressStore;
    console.log(
      'senderAddress,receiverAddress--',
      senderAddress,
      receiverAddress,
      getAddress
    );
    if (Object?.keys(senderAddress || {})?.length == 0) {
      setPickUpLocation('');
      setPickDrop('pick');
    } else {
      setPickUpLocation(senderAddress?.address);
      setPickDrop('drop');
      setGeoLocation(senderAddress?.geo_location);

    }

    if (Object?.keys(receiverAddress || {})?.length == 0) {
      setDropLocation('');
    } else {
      setDropLocation(receiverAddress?.address);
      setGeoLocation2(receiverAddress?.geo_location);
    }
  };

  const getAddressDetails = async () => {
    const res = await getMyAddress();
    // console.log('res---getAddressDetails', res);
    setMyAddress(res);
    setLoading(false);
  };

  const getCurrentAddress = async () => {
    const addressData = await getGeoCodes(geoLocation?.lat, geoLocation?.lng);
    // console.log('addressData', addressData);
    const nameData = addressData?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    setName(nameData[0]);
    setCurrentAddress(addressData?.address);
    geoLocation = (addressData?.geo_location)
    setLocationId(addressData?.place_Id)
    if (pickDrop == 'pick') {
      const newData = {
        address: addressData?.address,
        geo_location: geoLocation,
        address: addressData?.address,
        location_id: addressData?.place_Id
      };
      console.log('newData--', newData);
      setSenderAddress(newData);
      setPickUpLocation(addressData?.address);
      setPickDrop('drop');
    } else {
      const newData = {
        address: addressData?.address,
        geo_location: geoLocation,
        location_id: addressData?.place_Id
      };
      console.log('newData--', newData);
      setReceiverAddress(newData);
      setDropLocation(addressData?.address);
      setPickDrop('pick');
    }
  };

  const mohaliChandigarhBounds = {
    north: 30.8258,
    south: 30.6600,
    west: 76.6600,
    east: 76.8500,
  };

  const isWithinBounds = (latitude, longitude) => {
    return (
      Number(latitude) <= mohaliChandigarhBounds.north &&
      Number(latitude) >= mohaliChandigarhBounds.south &&
      Number(longitude) >= mohaliChandigarhBounds.west &&
      Number(longitude) <= mohaliChandigarhBounds.east
    );
  };

  const handleRegionChangeComplete = (region) => {
    // console.log('region--', region);
    onPressTouch(region)
    // if (debounceTimeout.current) {
    //   clearTimeout(debounceTimeout.current);
    // }
    // debounceTimeout.current = setTimeout(() => {
    //   if (!isWithinBounds(region?.geo_location?.lat, region?.geo_location?.lng)) {
    //     Alert.alert(" ", `Oops! we currently don't service your ${(pickDrop == 'pick' ? "pickup" : 'drop')} location. Please select different location.`);
    //   } else {
    //     if (pickDrop !== 'pick' && senderAddress?.address?.length > 0) {
    //       if (!isWithinBounds(senderAddress?.geo_location?.lat, senderAddress?.geo_location?.lng)) {
    //         Alert.alert(" ", "Oops! we currently don't service your pickup location. Please select different location.");
    //       } else {
    //         onPressTouch(region)
    //       }
    //     } else if (pickDrop !== 'drop' && receiverAddress?.address?.length > 0) {
    //       if (!isWithinBounds(receiverAddress?.geo_location?.lat, receiverAddress?.geo_location?.lng)) {
    //         Alert.alert(" ", "Oops! we currently don't service your drop location. Please select different location.");
    //       }
    //       else {
    //         onPressTouch(region)
    //       }
    //     }
    //     else if (pickDrop !== 'drop' && receiverAddress?.address?.length > 0 || pickDrop !== 'pick' && senderAddress?.address?.length > 0) {
    //       if (!isWithinBounds(receiverAddress?.geo_location?.lat, receiverAddress?.geo_location?.lng) && !isWithinBounds(senderAddress?.geo_location?.lat, senderAddress?.geo_location?.lng)) {
    //         Alert.alert(" ", "Oops! we currently don't service your pickup and drop location. Please select different location.");
    //       }
    //       else {
    //         onPressTouch(region)
    //       }
    //     }
    //     else {
    //       onPressTouch(region)
    //     }
    //   }
    // }, 300); // Delay in milliseconds

  };


  const renderItem = ({ item, index }) => {
    return (
      <>
        <LocationHistoryCard
          item={item}
          index={index}
          onPress={() => {
            // onPressTouch(item);
            handleRegionChangeComplete(item)

          }}
        />
      </>
    );
  };

  const onPressTouch = (item) => {
    // console.log("item---onPressTouch", item);
    const isSameLocation =
      (item?.location_id || item?.geo_location) &&
      ((pickDrop === 'pick' && item?.location_id === receiverAddress?.location_id) ||
        (parseFloat(item?.geo_location?.lat) === parseFloat(receiverAddress?.geo_location?.lat) &&
          parseFloat(item?.geo_location?.lng) === parseFloat(receiverAddress?.geo_location?.lng)
          || item?.location_id === receiverAddress?.location_id) ||
        (pickDrop !== 'pick' && item?.location_id === senderAddress?.location_id) ||
        (parseFloat(item?.geo_location?.lat) === parseFloat(senderAddress?.geo_location?.lat) &&
          parseFloat(item?.geo_location?.lng) === parseFloat(senderAddress?.geo_location?.lng)
          || item?.location_id === senderAddress?.location_id));

    if (isSameLocation) {
      alert("You can't choose the same location. Please choose another location.");
      return;
    }

    if (pickDrop == 'pick') {
      setPickUpLocation(item?.address);
      setSenderAddress(item);
      setGeoLocation(item?.geo_location);
      setPickDrop('drop');
      if (receiverAddress?.address?.length > 0) {
        navigation.navigate('priceDetails');
      }
    } else {
      setDropLocation(item?.address);
      setReceiverAddress(item);
      setGeoLocation2(item?.geo_location);
      if (senderAddress?.address?.length > 0) {
        navigation.navigate('priceDetails');
      }
    }
  }

  const onPressPickLocation = () => {
    // const newItem = {
    //   name: name,
    //   address: pickUpLocation ? pickUpLocation : currentAddress,
    //   geo_location: geoLocation,
    // };
    // // console.log("newItem---",newItem)

    // navigation.navigate('senderReceiverDetails', {
    //   pickDrop: 'pick',
    //   item: newItem,
    // });

    navigation.navigate('chooseMapLocation', {
      pickDrop: 'pick',
      item: {
        name: name,
        address: pickUpLocation ? pickUpLocation : currentAddress,
        geo_location: senderAddress?.address?.length > 0 ? geoLocation1 ?? senderAddress?.geo_location : geoLocation,
        location_id: senderAddress?.location_id?.length > 0 ? senderAddress?.location_id : locationId,
      },
      screenName: senderAddress?.location_id?.length > 0 ? "priceDetails" : 'setLocationHistory'
    });
    // alert('pick')
  };

  const onPressDropLocation = () => {
    // const newItem = {
    //   name: name,
    //   address: dropLocation ? dropLocation : currentAddress,
    //   geo_location: geoLocation,
    // };
    // navigation.navigate('senderReceiverDetails', {
    //   pickDrop: 'drop',
    //   item: newItem,
    // });
    navigation.navigate('chooseMapLocation', {
      pickDrop: 'drop',
      item: {
        name: name,
        address: dropLocation ? dropLocation : currentAddress,
        geo_location: receiverAddress?.address?.length > 0 ? geoLocation2 ?? receiverAddress?.geo_location : geoLocation,
        location_id: receiverAddress?.location_id?.length > 0 ? receiverAddress?.location_id : locationId,
      },
      screenName: receiverAddress?.location_id?.length > 0 ? "priceDetails" : 'setLocationHistory'
    });
  };

  const onChangePress = () => {
    if (senderAddress?.address?.length > 0 && receiverAddress?.address?.length > 0) {
      setPickDrop('drop');
      setSenderAddress(receiverAddress);
      setPickUpLocation(receiverAddress?.address);
      setReceiverAddress(senderAddress);
      setDropLocation(senderAddress?.address);
      setPickDrop('pick');
    } else if (senderAddress?.address?.length > 0) {
      setReceiverAddress(senderAddress);
      setDropLocation(senderAddress?.address);
      setPickDrop('pick');
      setSenderAddress({})
    } else if (receiverAddress?.address?.length > 0) {
      setSenderAddress(receiverAddress);
      setPickUpLocation(receiverAddress?.address);
      setPickDrop('drop');
      setReceiverAddress({});
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title={'Plan your ride'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <PickDropLocation
          pickUpLocation={pickUpLocation}
          dropLocation={dropLocation}
          cancelPickUp={() => {
            setPickUpLocation(''), setPickDrop('pick'), setSenderAddress({});
          }}
          cancelDrop={() => {
            setDropLocation(''), setPickDrop('drop'), setReceiverAddress({});
          }}
          onPressPickLocation={onPressPickLocation}
          onPressDropLocation={onPressDropLocation}
          onChangePress={() => { onChangePress() }}
          pick={'Enter your pickup'
            // 'Pickup loaction'
          }
          drop={'Enter your destination'
            // 'Dropped location'
          }
        />

        {/* <View style={styles.currentLocView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onCurrentPress();
            }}
            style={styles.currentLocTouch}>
            <Image
              resizeMode="contain"
              style={styles.currentLocImage}
              source={appImages.currentLocationIcon}
            />
            <Text style={styles.currentLocText}>Choose current location</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.middleLineView} />
        {loading == true ? (
          <AnimatedLoader type={'locationHistory'} />
        ) : (
          <View style={{ marginTop: '1%' }}>
            {myAddress?.length > 0 ? (
              <FlatList
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: '70%' }}
                data={myAddress}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('25%'),
                }}>
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontFamily: fonts.medium,
                    color: colors.black,
                  }}>
                  You haven't set an address yet.
                </Text>
              </View>
            )}
          </View>

        )}
      </View>
      {(senderAddress?.address?.length > 0 &&
        receiverAddress?.address?.length > 0) &&
        <View style={{ backgroundColor: colors.appBackground, height: hp("8%") }}>
          <Spacer space={'5%'} />
          <CTA title={'continue'}
            onPress={() => { navigation.navigate('priceDetails') }}
          />
        </View>}
    </View>
  );
};

export default SetLocationHistory;
