import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {SvgXml} from 'react-native-svg';
import {colors} from '../../../theme/colors';
import {currencyFormat} from '../../../halpers/currencyFormat';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';

const textProps = {
  color: colors.white,
  fontFamily: fonts.medium,
  fontSize: RFValue(14),
};

const ViewCartBtn = ({viewCart, isCart, isDash}) => {
  console.log('ViewCartBtn items', viewCart, isCart, isDash);
  const [totalAmount, setTotalAmount] = useState(0);
  // useEffect(() => {
  //   if (isCart?.length > 0) {
  //     const newTotal = isCart.reduce(
  //       (acc, item) => acc + (item?.sellingprice * item?.quantity || 0),
  //       0,
  //     );
  //     setTotalAmount(newTotal);
  //   } else {
  //     setTotalAmount(0);
  //   }
  // }, [isCart]);

  return (
    <Pressable
      onPress={() => {
        viewCart();
      }}
      style={{
        position: isDash ? 'relative' : 'absolute',
        bottom: isDash ? '3%' : 0,
        height: hp('8%'),
        width: isDash ? '95%' : '100%',
        backgroundColor: colors.main,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: isDash ? 16 : 0,
        borderBottomRightRadius: isDash ? 16 : 0,
        paddingHorizontal: 20,
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{...textProps}}>
          {isCart?.cart_items?.length}{' '}
          {isCart?.cart_items?.length > 1 ? 'Items' : 'Item'} added
        </Text>

        <Text style={{marginLeft: 'auto', ...textProps, fontSize: RFValue(16)}}>
          {currencyFormat(Number(isCart?.grand_total ?? 0))}
        </Text>
      </View>
      <Text style={{...textProps, fontSize: RFValue(12)}}>
        Add items worth 100 more to get 150 off
      </Text>
    </Pressable>
  );
};

export default ViewCartBtn;

