// import React, {useEffect, useState, useRef, useCallback} from 'react';
// import {
//   Alert,
//   Image,
//   Pressable,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {SvgXml} from 'react-native-svg';
// import {appImagesSvg, appImages} from '../../commons/AppImages';
// import {colors} from '../../theme/colors';
// import {fonts} from '../../theme/fonts/fonts';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import Url from '../../api/Url';
// import {rootStore} from '../../stores/rootStore';
// import {getCurrentLocation, setCurrentLocation} from '../GetAppLocation';
// import {useFocusEffect} from '@react-navigation/native';
// import {getGeoCodes} from '../GeoCodeAddress';

// let geoLocation = {
//   lat: null,
//   lng: null,
// };

// const DashboardHeader = ({
//   navigation,
//   value,
//   onChangeText,
//   onFocus,
//   onBlur,
//   onCancelPress,
//   onMicroPhone,
//   appUserInfo,
// }) => {
//   const searchInputRef = useRef(null);
//   const handleSearchButtonPress = () => {
//     if (searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   };

//   const getLocation = type => {
//     let d =
//       type == 'lat'
//         ? getCurrentLocation()?.latitude
//         : getCurrentLocation()?.longitude;

//     return d ? d : '';
//   };
//   const [address, setAddress] = useState('');
//   const [isRefersh, setIsRefersh] = useState(false);
//   // const [geoLocation, setGeoLocation] = useState({
//   //   lat: getLocation('lat'),
//   //   lng: getLocation('lng'),
//   // });

//   useFocusEffect(
//     useCallback(() => {
//       setCurrentLocation();
//       setTimeout(() => {
//         if (getLocation) {
//           onUpdateLatLng();
//           setIsRefersh(true);
//           // getCurrentAddress();
//         }
//       }, 1000);
//     }, [appUserInfo]),
//   );

//   useEffect(() => {
//     setTimeout(() => {
//       getCurrentAddress();
//     }, 1500);
//   }, [isRefersh]);

//   const onUpdateLatLng = () => {
//     geoLocation = {
//       lat: getLocation('lat'),
//       lng: getLocation('lng'),
//     };
//     setIsRefersh(true);
//     setTimeout(() => {
//       setIsRefersh(false);
//     }, 1000);
//   };

//   const getCurrentAddress = async () => {
//     const addressData = await getGeoCodes(geoLocation?.lat, geoLocation?.lng);
//     console.log('addressData', addressData);
//     setAddress(addressData?.address);
//   };

//   return (
//     <View style={{backgroundColor: colors.white}}>
//       <View
//         style={{
//           flexDirection: 'row',
//           backgroundColor: colors.backColorMain,
//           alignItems: 'center',
//           paddingBottom: '2%',
//           marginTop: '4%',
//           paddingHorizontal: 20,
//         }}>
//         <View
//           style={{flex: 1, backgroundColor: colors.white, marginRight: '1%'}}>
//           <Text
//             numberOfLines={1}
//             style={{
//               fontSize: RFValue(13),
//               fontFamily: fonts.semiBold,
//               color: colors.main,
//               width: wp('78%'),
//             }}>
//             Home
//           </Text>
//           <Text
//             style={{
//               fontSize: RFValue(10),
//               fontFamily: fonts.regular,
//               color: colors.colorA9,
//               width: wp('78%'),
//             }}
//             numberOfLines={1}>
//             {address}
//           </Text>
//         </View>

//         <TouchableOpacity
//           hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}
//           onPress={() => {
//             navigation.navigate('profile');
//           }}
//           activeOpacity={0.8}>
//           <Image
//             resizeMode="cover"
//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: 100,
//               borderColor: colors.main,
//               borderWidth: 0.3,
//             }}
//             source={
//               appUserInfo?.profile_pic?.length > 0
//                 ? {uri: Url.Image_Url + appUserInfo?.profile_pic}
//                 : appImages.profileImage
//             }
//           />
//         </TouchableOpacity>
//       </View>

//       {onChangeText && (
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'center',
//             marginHorizontal: '4%',
//             marginTop: '3%',
//           }}>
//           <View
//             style={{
//               width: wp('90%'),
//               flexDirection: 'row',
//               alignItems: 'center',
//               alignSelf: 'center',
//               borderRadius: 10,
//               borderWidth: 1,
//               borderColor: colors.screenBackground,
//               backgroundColor: colors.screenBackground,
//             }}>
//             <TextInput
//               ref={searchInputRef}
//               value={value}
//               onChangeText={onChangeText}
//               // autoFocus={true}
//               placeholderTextColor="#808080"
//               placeholder="Search"
//               style={{
//                 width: wp('73%'),
//                 height: hp('5%'),
//                 paddingLeft: '4%',
//                 paddingRight: '2%',
//                 fontSize: RFValue(12),
//                 color: colors.black,
//                 padding: 0,
//               }}
//               onFocus={onFocus}
//               onBlur={onBlur}
//             />
//             {value?.length > 0 ? (
//               <TouchableOpacity
//                 onPress={onCancelPress}
//                 activeOpacity={0.8}
//                 hitSlop={{top: 15, bottom: 10, left: 5, right: 5}}>
//                 <SvgXml
//                   width={21}
//                   height={21}
//                   xml={appImagesSvg.cancelSvg2}
//                   style={{right: wp('0.1%')}}
//                 />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={() => {
//                   handleSearchButtonPress();
//                 }}
//                 activeOpacity={0.8}
//                 hitSlop={{top: 15, bottom: 10, left: 5, right: 5}}>
//                 <SvgXml
//                   width={20}
//                   height={20}
//                   xml={appImagesSvg.searchIcon}
//                   style={{right: wp('0.7%')}}
//                 />
//               </TouchableOpacity>
//             )}
//             <View
//               style={{
//                 height: 23,
//                 width: 2,
//                 backgroundColor: '#A9A9AA',
//                 left: wp('1.5%'),
//               }}></View>
//             <TouchableOpacity
//               onPress={onMicroPhone}
//               activeOpacity={0.8}
//               hitSlop={{top: 15, bottom: 10, left: 5, right: 5}}
//               style={{left: wp('3%')}}>
//               <SvgXml width={20} height={20} xml={appImagesSvg.microPhoneSvg} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default DashboardHeader;

import React, { useRef } from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { appImages, appImagesSvg } from '../../commons/AppImages';
import Url from '../../api/Url';


const DashboardHeader = ({ title,
  onChangeText, value,
  onCancelPress,
  onMicroPhone,
  onFocus,
  onBlur,
  appUserInfo,
  navigation,
  showProfile
}) => {
  const searchInputRef = useRef(null);
  const handleSearchButtonPress = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.appBackground,
        alignItems: 'center',
        paddingBottom: '2.5%',
        marginTop: Platform.OS == 'ios' ? '1%' : '1%',
        paddingHorizontal: 20,
        borderBottomColor: colors.colorD9,
        borderBottomWidth: 1
      }}>
      <View
        style={{ flex: 1, backgroundColor: colors.appBackground, marginLeft: '1%' }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: RFValue(15),
            fontFamily: fonts.semiBold,
            color: colors.black,
            textTransform:'capitalize'
          }}>
          {title}
        </Text>
      </View>
      {showProfile && <TouchableOpacity
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
              ? { uri: Url.Image_Url + appUserInfo?.profile_pic }
              : appImages.profileImage
          }
        />
      </TouchableOpacity>}
      {onChangeText && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: '4%',
            marginTop: '3%',
          }}>
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.screenBackground,
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
                onPress={() => {
                  handleSearchButtonPress();
                }}
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

export default DashboardHeader;
