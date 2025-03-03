import React, {useState, useEffect} from 'react';
import {
  Pressable,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {appImagesSvg} from '../../../commons/AppImages';
import {currencyFormat} from '../../../halpers/currencyFormat';
import {colors} from '../../../theme/colors';

const CartCoupanApply = ({
  item,
  onApply,
  applyTitle,
  onMoreCoupan,
  btnTitle,
  getCartTotal,
}) => {
  // console.log('getCartTotal---', getCartTotal, item);
  const [cartTotal, setCartTotal] = useState(getCartTotal);

  useEffect(() => {
    if (getCartTotal) {
      setCartTotal(getCartTotal);
    }
  }, [getCartTotal]);

  return (
    <View style={styles.mainView}>
      <View style={styles.upperView}>
        <SvgXml xml={appImagesSvg.offerOff} />
        <Text style={styles.coupanText}>{item?.referral_code}</Text>
        <TouchableOpacity
          disabled={cartTotal?.cartTotal <= item?.discount_price ? true : false}
          onPress={() => {
            onApply(item);
          }}
          activeOpacity={0.8}
          hitSlop={{top: 2, left: 10, right: 10, bottom: 10}}>
          <Text
            style={[
              styles.applyText,
              {opacity: cartTotal?.cartTotal <= item?.discount_price ? 0.5 : 1},
            ]}>
            {applyTitle}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.offText}>
        {item?.discount_type === 'percentage'
          ? `${item?.discount_percentage}%`
          : currencyFormat(Number(item?.discount_percentage))}{' '}
        off up to {currencyFormat(Number(item?.discount_price))}
      </Text>

      <TouchableOpacity
        onPress={onMoreCoupan}
        activeOpacity={0.8}
        style={styles.moreBtnView}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.moreBtnText}>
            View more coupons
            {/* {btnTitle} */}
          </Text>
          <SvgXml xml={appImagesSvg.rightArrowColor} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CartCoupanApply;

const styles = StyleSheet.create({
  mainView: {
    marginTop: '4%',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 6},
  },
  upperView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginEnd: 10,
    marginTop: 10,
  },
  coupanText: {
    flex: 1,
    fontSize: RFValue(16),
    fontFamily: fonts.bold,
    color: colors.black,
    marginLeft: '2%',
  },
  applyText: {
    fontSize: RFValue(14),
    fontFamily: fonts.bold,
    color: colors.main,
  },
  offText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color64,
    marginLeft: 10,
    marginTop: '1%',
  },
  moreBtnView: {
    backgroundColor: colors.colorD6,
    borderColor: colors.colorD6,
    height: hp('4.5%'),
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
  },
  moreBtnText: {
    color: colors.main,
    fontFamily: fonts.semiBold,
    fontSize: RFValue(11),
  },
});
