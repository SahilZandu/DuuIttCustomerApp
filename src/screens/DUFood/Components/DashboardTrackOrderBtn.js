import React from 'react';
import {Pressable, Text, Image, TouchableOpacity, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import { fonts} from '../../../theme/fonts/fonts';
import {appImages} from '../../../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import {View} from 'react-native-animatable';


const textProps = {
  color: '#FFFFFF',
  fontFamily: fonts.medium,
  fontSize: RFValue(12),
};

const DashboardTrackOrderBtn = ({
  onViewCart,
  items,
  isDash,
  restaurantData,
  onDeletePress,
  bottom
}) => {
  console.log('restaurantData---', restaurantData);

  return (
    <Pressable
      onPress={onViewCart}
      style={{
        position: isDash ? 'relative' : 'absolute',
        bottom: bottom ? bottom : "2%",
        height: hp('8%'),
        width: isDash ? '95%' : '100%',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius:10,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        // borderBottomLeftRadius: isDash ? 10 : 0,
        // borderBottomRightRadius: isDash ? 10 : 0,
        paddingHorizontal: 6,
        alignSelf: 'center',
        borderColor: 'rgba(0, 0, 0, 0.65)',
        // borderWidth: Platform.OS == 'ios' ? 0 : 0.3,
        shadowColor: 'rgba(0, 0, 0, 0.65)',
        shadowOffset: {width: 4, height: 0},
        elevation: 4,
        shadowOpacity: 0.4,
      }}>
      <Image
        style={{width: 40, height: 40, borderRadius: 100}}
        source={
          // restaurantData?.orgdata?.logo
          //   ? {
          //       uri:
          //         restaurantData?.orgdata?.logo,
          //     }
          //   : appImages.foodIMage
          appImages.foodIMage
        }
      />
      <View style={{flexDirection: 'column', marginLeft: '2%'}}>
        <Text
          numberOfLines={1}
          style={{
            color: '#000000',
            fontFamily: fonts.medium,
            fontSize: RFValue(13),
            width: wp('45%'),
          }}>
          {/* {restaurantData?.orgdata?.name} */}
          Food is preparing...
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: '#00000075',
            fontFamily: fonts.medium,
            fontSize: RFValue(12),
            width: wp('45%'),
            marginTop: '1%',
          }}>
4 item added | Grill Masters
        </Text>
      </View>

      <TouchableOpacity
        onPress={onViewCart}
        activeOpacity={0.8}
        style={{
          backgroundColor: '#28B056',
          paddingVertical: '2%',
          paddingHorizontal: '3%',
          left: '3%',
          borderRadius: 20,
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: fonts.semiBold,
            fontSize: RFValue(12),
          }}>
          Track Order
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={onDeletePress}
        activeOpacity={0.8}
        hitSlop={{top: 2, bottom: 5, left: 5, right: 5}}
        style={{left: '10%'}}>
        <SvgXml xml={deleteIcon} />
      </TouchableOpacity> */}
    </Pressable>
  );
};

export default DashboardTrackOrderBtn;

const deleteIcon = `<svg width="24" height="24" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="7" cy="7.5" r="7" fill="#E9E9E9"/>
<path d="M9.5 5L4.5 10M4.5 5L9.5 10" stroke="#919191" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
