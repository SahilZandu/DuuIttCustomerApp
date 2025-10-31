import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg, appImages } from '../../commons/AppImages';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Url from '../../api/Url';
import { getCurrentLocation, setCurrentLocation } from '../GetAppLocation';
import { getGeoCodes } from '../GeoCodeAddress';
import { useFocusEffect } from '@react-navigation/native';
import { rootStore } from '../../stores/rootStore';
import { currencyFormat } from '../../halpers/currencyFormat';
import AnimatedLoader from '../AnimatedLoader/AnimatedLoader';

let geoLocation = {
  lat: null,
  lng: null,
};

const DashboardHeader2 = ({
  navigation,
  onPress,
  appUserInfo,
  onChangeText,
  value,
  onCancelPress,
  onMicroPhone,
  onFocus,
  onBlur,
}) => {
  const searchInputRef = useRef(null);
  const { getWallet, welletBalance } = rootStore.dashboardStore
  const { currentAddress } = rootStore.myAddressStore;
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  const [address, setAddress] = useState(currentAddress?.address ?? '');
  const [isRefersh, setIsRefersh] = useState(false);
  const [walletData, setWalletData] = useState(welletBalance ?? {})
  const [name, setName] = useState('')
  // const [geoLocation, setGeoLocation] = useState({
  //   lat: getLocation('lat'),
  //   lng: getLocation('lng'),
  // });

  useFocusEffect(
    useCallback(() => {
      if (currentAddress?.address?.length > 0) {
        const nameData = currentAddress?.address?.split(',');
        const otherData = nameData?.slice(1)?.join(', ')?.trim();
        setName(nameData[0] ?? '');
        setAddress(otherData ?? currentAddress?.address ?? '');
      }
      setCurrentLocation();
      if (walletData?.balance == undefined) {
        getWalletData();
      }
      setTimeout(() => {
        if (getLocation) {
          onUpdateLatLng();
          setIsRefersh(true);
        }
      }, 300);
    }, [appUserInfo]),
  );

  useEffect(() => {
    setTimeout(() => {
      getCurrentAddress();
    }, 500);
  }, [isRefersh]);



  const getWalletData = async () => {
    const res = await getWallet(appUserInfo, handleWalletLoading);
    console.log('res--getWalletData', res);
    setWalletData(res);
  };
  // console.log('res--walletData', walletData);
  const handleWalletLoading = (v) => {
    console.log('v--handleWalletLoading', v);

  }
  // console.log("address---",address,currentAddress);

  const onUpdateLatLng = () => {
    geoLocation = {
      lat: getLocation('lat'),
      lng: getLocation('lng'),
    };
    setIsRefersh(true);
    setTimeout(() => {
      setIsRefersh(false);
    }, 500);
  };

  const getCurrentAddress = async () => {
    const addressData = await getGeoCodes(geoLocation?.lat, geoLocation?.lng);
    console.log('addressData', addressData);
    const nameData = addressData?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    const otherData = nameData?.slice(1)?.join(', ')?.trim();
    setName(nameData[0]);
    setAddress(otherData ?? addressData?.address);
  };

  // useEffect(() => {
  //   const updateLocation = setInterval(() => {
  //     setCurrentLocation();
  //     setTimeout(() => {
  //       onUpdateLatLng();
  //     }, 5000)
  //   }, 120000); // 120000 ms = 2 minutes

  //   return () => {
  //     clearInterval(updateLocation);
  //   };
  // }, []);

  return (
    <View
      style={{
        backgroundColor: colors.appBackground,
        justifyContent: 'center',
        paddingBottom: '3%',
        marginTop: Platform.OS == 'ios' ? '1%' : '1%',
        paddingHorizontal: 20,
        borderBottomColor: colors.colorD9,
        borderBottomWidth: 1
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          activeOpacity={0.9}
          onPress={onPress}
          style={{ marginRight: '4%', marginLeft: '-2%' }}>
          <SvgXml xml={appImagesSvg.backArrow} />
        </TouchableOpacity>

        <View
          style={{ flex: 1, backgroundColor: colors.appBackground, marginRight: '1%' }}>
          {name?.length > 0 ?
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: RFValue(15),
                    fontFamily: fonts.semiBold,
                    color: colors.black,
                    width: wp('62%'),
                    textTransform: 'capitalize'
                  }}>
                  {name?.length > 0 ? name : `Hello ${appUserInfo?.name}`}
                </Text>
                {appUserInfo?.isWallet == true &&
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    right: wp(0.5),
                    borderRadius: 20, borderWidth: 1,
                    paddingHorizontal: 8,
                    paddingVertical: 1,
                    borderColor: colors.main,
                    backgroundColor: colors.colorD45,
                    justifyContent: 'center',
                  }}>
                    <Image resizeMode='cover'
                      style={{
                        height: 15, width: 15,
                      }}
                      source={appImages.ruppeYellowIcon} />
                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: wp(0.1),
                        fontSize: RFValue(9),
                        fontFamily: fonts.semiBold,
                        color: colors.main,
                        maxWidth: wp(12)
                      }}> {currencyFormat(walletData?.balance ?? 0)}</Text>
                  </View>}
              </View>
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontFamily: fonts.regular,
                  color: colors.colorA9,
                  width: wp('68%'),
                }}
                numberOfLines={1}>
                {address}
              </Text>
            </> :
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', right: '10%' }}>
              <AnimatedLoader type={'liveLocationLoader'} />
            </View>
          }
        </View>



        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
          onPress={() => {
            navigation.navigate('profile', { screenName: 'home' });
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
                ? { uri: appUserInfo?.profile_pic }
                : appImages.profileImage
              // appImages.profileImage
            }
          />
        </TouchableOpacity>
      </View>
      {onChangeText && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: '4%',
            marginTop: '4%',
          }}>
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.colorD9,
              backgroundColor: colors.screenBackground,
            }}>
            <TextInput
              ref={searchInputRef}
              value={value}
              onChangeText={onChangeText}
              // autoFocus={true}
              placeholderTextColor="#808080"
              placeholder="Search"
              style={{
                width: wp('73%'),
                height: hp('5%'),
                paddingLeft: '4%',
                paddingRight: '2%',
                fontSize: RFValue(12),
                color: colors.black,
                padding: 0,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            {value?.length > 0 ? (
              <TouchableOpacity
                onPress={onCancelPress}
                activeOpacity={0.8}
                hitSlop={{ top: 15, bottom: 10, left: 5, right: 5 }}>
                <SvgXml
                  width={21}
                  height={21}
                  xml={appImagesSvg.cancelSvg2}
                  style={{ right: wp('0.1%') }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                // onPress={() => {
                //   handleSearchButtonPress();
                // }}
                activeOpacity={0.8}
                hitSlop={{ top: 15, bottom: 10, left: 5, right: 5 }}>
                <SvgXml
                  width={20}
                  height={20}
                  xml={appImagesSvg.searchIcon}
                  style={{ right: wp('0.7%') }}
                />
              </TouchableOpacity>
            )}
            <View
              style={{
                height: 23,
                width: 2,
                backgroundColor: '#A9A9AA',
                left: wp('1.5%'),
              }}></View>
            <TouchableOpacity
              onPress={onMicroPhone}
              activeOpacity={0.8}
              hitSlop={{ top: 15, bottom: 10, left: 5, right: 5 }}
              style={{ left: wp('3%') }}>
              <SvgXml width={20} height={20} xml={appImagesSvg.microPhoneSvg} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default DashboardHeader2;
