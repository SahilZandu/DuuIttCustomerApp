import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg, appImages} from '../../commons/AppImages';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/fonts/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Url from '../../api/Url';
import {getCurrentLocation, setCurrentLocation} from '../GetAppLocation';
import {getGeoCodes} from '../GeoCodeAddress';
import {useFocusEffect} from '@react-navigation/native';

let geoLocation ={
  lat: null,
  lng: null,
}

const DashboardHeader2 = ({navigation, value, onPress, appUserInfo}) => {
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  const [address, setAddress] = useState('');
  const [isRefersh, setIsRefersh] = useState(false);
  // const [geoLocation, setGeoLocation] = useState({
  //   lat: getLocation('lat'),
  //   lng: getLocation('lng'),
  // });

  useFocusEffect(
    useCallback(() => {
      setCurrentLocation();
      setTimeout(()=>{
        if (getLocation) {
          onUpdateLatLng();
          setIsRefersh(true)
        }
      },1000)
    },[appUserInfo]),
  );

  useEffect(()=>{
    setTimeout(() => {
      getCurrentAddress();
    }, 1000);
  },[isRefersh])

  const onUpdateLatLng = () => {
    geoLocation ={
      lat: getLocation('lat'),
      lng: getLocation('lng'),
    };
    setIsRefersh(true);
    setTimeout(() => {
      setIsRefersh(false);
    }, 1000);
  };

  const getCurrentAddress = async () => {
    const addressData = await getGeoCodes(geoLocation?.lat, geoLocation?.lng);
    // console.log('addressData', addressData);
    setAddress(addressData?.address);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.backColorMain,
        alignItems: 'center',
        paddingBottom: '2%',
        marginTop: '2%',
        paddingHorizontal: 20,
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{marginRight: '4%', marginLeft: '-2%'}}>
        <SvgXml xml={appImagesSvg.backArrow} />
      </TouchableOpacity>

      <View style={{flex: 1, backgroundColor: colors.white, marginRight: '1%'}}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: RFValue(13),
            fontFamily: fonts.semiBold,
            color: colors.main,
            width: wp('68%'),
          }}>
          Hello {appUserInfo?.name}
        </Text>
        <Text
          style={{
            fontSize: RFValue(10),
            fontFamily: fonts.regular,
            color: colors.colorA9,
            width: wp('68%'),
          }}
          numberOfLines={1}>
          {address}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('profile');
        }}
        activeOpacity={0.8}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 100,
            borderColor: colors.main,
            borderWidth: 0.3,
          }}
          source={
            appUserInfo?.profile_pic?.length > 0
              ? {uri: Url.Image_Url + appUserInfo?.profile_pic}
              : appImages.profileImage
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardHeader2;
