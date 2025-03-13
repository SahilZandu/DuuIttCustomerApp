import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../../../commons/AppImages';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import CTA from '../../../components/cta/CTA';
import {getGeoCodes} from '../../../components/GeoCodeAddress';
import {getCurrentLocation} from '../../../components/GetAppLocation';
import Header from '../../../components/header/Header';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import PickDropLocation from '../../../components/PickDropLocation';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import Spacer from '../../../halpers/Spacer';
import {pickUpHistory} from '../../../stores/DummyData/Home';
import {rootStore} from '../../../stores/rootStore';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';
import {styles} from './styles';

let geoLocation ={
      lat:null,
    lng:null,
}

const SetLocationHistory = ({navigation}) => {
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
  const [loading, setLoading] = useState(getAddress?.length > 0 ? false : true);
  const [pickDrop, setPickDrop] = useState('pick');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  // const [lat, setlat] = useState(30.7076);
  // const [long, setlong] = useState(76.715126);
  const [myAddress, setMyAddress] = useState(getAddress);
  // const [geoLocation, setGeoLocation] = useState({
  //   lat: getLocation('lat'),
  //   lng: getLocation('lng'),
  // });
  const [currentAddress, setCurrentAddress] = useState('');
  const [name, setName] = useState('');

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      getAddressDetails();
      // getCheckSenderReciever();
    }, []),
  );

  useEffect(()=>{
    getCheckSenderReciever();
  },[senderAddress ,receiverAddress])

  useEffect(() => {
    geoLocation ={
      lat: getLocation('lat'),
      lng: getLocation('lng'),
    };

    setTimeout(() => {
      getCurrentAddress();
    }, 500);
  }, []);

  const getCheckSenderReciever = () => {
    const {senderAddress, receiverAddress} = rootStore.myAddressStore;
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
    }

    if (Object?.keys(receiverAddress || {})?.length == 0) {
      setDropLocation('');
    } else {
      setDropLocation(receiverAddress?.address);
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
    geoLocation =(addressData?.geo_location)
    if (pickDrop == 'pick') {
      const newData = {
        address: addressData?.address,
        geo_location: geoLocation,
      };
      console.log('newData--', newData);
      setSenderAddress(newData);
      setPickUpLocation(addressData?.address);
      setPickDrop('drop');
    } else {
      const newData = {
        address: addressData?.address,
        geo_location: geoLocation,
      };
      console.log('newData--', newData);
      setReceiverAddress(newData);
      setDropLocation(addressData?.address);
      setPickDrop('pick');
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <LocationHistoryCard
          item={item}
          index={index}
          onPress={() => {
            if (pickDrop == 'pick') {
              setPickUpLocation(item?.address);
              setSenderAddress(item);
              setPickDrop('drop');
              if (receiverAddress?.address?.length > 0) {
                navigation.navigate('priceDetails');
              }
            } else {
              setDropLocation(item?.address);
              setReceiverAddress(item);
              if (senderAddress?.address?.length > 0) {
                navigation.navigate('priceDetails');
              }
            }
          }}
        />
      </>
    );
  };

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
        geo_location: geoLocation,
      },
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
        geo_location: geoLocation,
      },
    });
    // alert('drop')
  };

  const onCurrentPress = () => {
    if (pickDrop == 'pick') {
      setPickUpLocation(currentAddress);
      setPickDrop('drop');
    } else {
      setDropLocation(currentAddress);
    }
    // navigation.navigate('senderReceiverDetails', {
    //   pickDrop: pickDrop,
    //   item: {name: name, address: currentAddress, geo_location: geoLocation},
    // });
    navigation.navigate('chooseMapLocation', {
      pickDrop: pickDrop,
      item: {name: name, address: currentAddress, geo_location: geoLocation},
    });
  };

  const onChangePress=()=>{
    if(senderAddress?.address?.length > 0 && receiverAddress?.address?.length> 0){
      setPickDrop('drop');
      setSenderAddress(receiverAddress);
      setPickUpLocation(receiverAddress?.address);
      setReceiverAddress(senderAddress);
      setDropLocation(senderAddress?.address);
      setPickDrop('pick');
    } else if(senderAddress?.address?.length > 0 ){
      setReceiverAddress(senderAddress);
      setDropLocation(senderAddress?.address);
      setPickDrop('pick');
      setSenderAddress({})
    } else if(receiverAddress?.address?.length> 0){
      setSenderAddress(receiverAddress);
      setPickUpLocation(receiverAddress?.address);
      setPickDrop('drop');
      setReceiverAddress({});
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title={'Pick up or send anything'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1, marginHorizontal: 20}}>
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
          onChangePress={()=>{onChangePress()}}
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
          <View style={{marginTop: '1%'}}>
            {myAddress?.length > 0 ? (
              <FlatList
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: '70%'}}
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
       <View style={{backgroundColor:colors.appBackground,height:hp("8%")}}>
        <Spacer space={'5%'}/>
       <CTA title={'continue'}
       onPress={()=>{ navigation.navigate('priceDetails')}}
       />
      </View>}
    </View>
  );
};

export default SetLocationHistory;
