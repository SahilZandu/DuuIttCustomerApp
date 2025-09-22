// import React from 'react';
// import {
//   Pressable,
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {fonts} from '../../../theme/fonts/fonts';
// import {appImages} from '../../../commons/AppImages';
// import {SvgXml} from 'react-native-svg';
// import {colors} from '../../../theme/colors';
// import Url from '../../../api/Url';

// const DashboardCartBtn = ({
//   onViewCart,
//   cartData,
//   isDash,
//   onDeletePress,
//   bottom,
// }) => {
//   // console.log('restaurantData---', restaurantData);
//   console.log('cartData---DashboardCartBtn', cartData);

//   return (
//     <View
//       // onPress={onViewCart}
//       style={{
//         position: isDash ? 'relative' : 'absolute',
//         bottom: bottom ? bottom : '2%',
//         height: hp('8%'),
//         width: isDash ? '95%' : '100%',
//         backgroundColor: colors.white,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderRadius: 10,
//         paddingHorizontal: 10,
//         alignSelf: 'center',
//         borderColor: 'rgba(0, 0, 0, 0.65)',
//         shadowColor: 'rgba(0, 0, 0, 0.65)',
//         shadowOffset: {width: 4, height: 0},
//         elevation: 4,
//         shadowOpacity: 0.4,
//       }}>
//       <Image
//         resizeMode="cover"
//         style={{width: 40, height: 40, borderRadius: 100}}
//         source={
//           cartData?.restaurant?.logo
//             ? {
//                 uri: cartData?.restaurant?.logo,
//               }
//             : appImages.foodIMage
//         }
//       />
//       <View style={{flexDirection: 'column', marginLeft: '2%'}}>
//         <Text
//           numberOfLines={1}
//           style={{
//             color: colors.black,
//             fontFamily: fonts.medium,
//             fontSize: RFValue(13),
//             width: wp('52%'),
//             textTransform: 'capitalize',
//           }}>
//           {cartData?.restaurant?.name ?? 'No Name'}
//         </Text>
//         <Text
//           numberOfLines={1}
//           style={{
//             color: colors.black75,
//             fontFamily: fonts.medium,
//             fontSize: RFValue(12),
//             width: wp('52%'),
//             marginTop: '1%',
//           }}>
//           {cartData?.food_item?.length}{' '}
//           {cartData?.food_item?.length > 1 ? 'Items Added | View Menu' : 'Item'}
//         </Text>
//       </View>

//       <TouchableOpacity
//         onPress={onViewCart}
//         activeOpacity={0.8}
//         style={{
//           backgroundColor: colors.main,
//           paddingVertical: '2%',
//           paddingHorizontal: '3%',
//           right: '10%',
//           borderRadius: 20,
//         }}>
//         <Text
//           style={{
//             color: colors.white,
//             fontFamily: fonts.semiBold,
//             fontSize: RFValue(11),
//           }}>
//           View Cart
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={onDeletePress}
//         activeOpacity={0.8}
//         hitSlop={{top: 10, bottom: 10, left: 10, right: 5}}>
//         <SvgXml xml={deleteIcon} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default DashboardCartBtn;

// const deleteIcon = `<svg width="24" height="24" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
// <circle cx="7" cy="7.5" r="7" fill="#E9E9E9"/>
// <path d="M9.5 5L4.5 10M4.5 5L9.5 10" stroke="#919191" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>`;

import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import Url from '../../../api/Url';
import {appImages} from '../../../commons/AppImages';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';

const DashboardCartBtn = ({
  onViewCart,
  cartData,
  isDash,
  onDeletePress,
  bottom,
}) => {
  return (
    <View style={styles.main(bottom)}>
      <Surface elevation={3} style={styles.upperSurfaceView}></Surface>
      <TouchableOpacity
        onPress={onViewCart}
        activeOpacity={1}>
        <Surface elevation={2} style={styles.viewDetailsSurfaceView}>
          <View style={styles.mainInnerView}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={
                cartData?.restaurant?.logo
                  ? {
                      uri:cartData?.restaurant?.logo,
                    }
                  : appImages.foodIMage
              }
            />
            <View style={styles.nameValueView}>
              <Text numberOfLines={1} style={styles.restNameText}>
                {cartData?.restaurant?.name ?? 'No Name'}
              </Text>
              <Text numberOfLines={1} style={styles.itemText}>
                {cartData?.food_item?.length}{' '}
                {cartData?.food_item?.length > 1
                  ? 'Items Added | View Menu'
                  : 'Item'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onViewCart}
              activeOpacity={0.8}
              style={styles.touchViewCart}>
              <Text style={styles.viewCartText}>View Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDeletePress}
              activeOpacity={0.8}
              hitSlop={styles.hitSlot}>
              <SvgXml width={26} height={26} xml={deleteIcon} />
            </TouchableOpacity>
          </View>
        </Surface>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardCartBtn;

const styles = StyleSheet.create({
  main:(bottom)=>( {
    position: 'absolute',
    alignSelf: 'center',
    bottom:bottom?bottom: hp('8%'),
  }),
  upperSurfaceView: {
    width: wp('88%'),
    height: hp('3%'),
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    top:hp('1.8%'),
  },
  viewDetailsSurfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    width: wp('94%'),
    justifyContent: 'center',
  },
  mainInnerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '6%',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  nameValueView: {
    flexDirection: 'column',
    marginLeft: '3%',
  },
  restNameText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    width: wp('50%'),
    textTransform: 'capitalize',
  },
  itemText: {
    color: colors.black75,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    width: wp('50%'),
    marginTop: '1%',
  },
  touchViewCart: {
    backgroundColor: colors.main,
    paddingVertical: '2.5%',
    paddingHorizontal: '3%',
    right: '10%',
    borderRadius: 20,
  },
  viewCartText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: RFValue(11),
  },
  hitSlot: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 5,
  },
});

const deleteIcon = `<svg width="24" height="24" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="7" cy="7.5" r="7" fill="#E9E9E9"/>
<path d="M9.5 5L4.5 10M4.5 5L9.5 10" stroke="#919191" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
