import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../theme/fonts/fonts';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {Surface} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {currencyFormat} from '../halpers/currencyFormat';
import moment from 'moment';
import BTN from './cta/BTN';

const VouchersGiftCard = ({item, index, onViewPress, onBuyPress}) => {
  const exampleDate = new Date(); // Current date

  const formatDate = date => {
    return moment(date).format('Do MMM.');
  };

  return (
    <View index={index} style={styles.container}>
      <Surface elevation={3} style={styles.surfaceView}>
        <View style={styles.innerMainView}>
          <View style={styles.imageView}>
            <View style={styles.outerViewCircel}>
              <Text style={styles.discountText}>Discount</Text>
              <Text style={styles.discountValue}>{item?.discount}%</Text>
            </View>
            <Surface elevation={3} style={styles.restaurantView}>
              <Text numberOfLines={2} style={styles.restaurantName}>
                {item?.restaurantName}
              </Text>
            </Surface>
          </View>
          <View style={styles.textMainView}>
            <Text style={styles.titleText}>
              {currencyFormat(Number(item?.walletPrice))} {item?.title}
            </Text>
            <Text numberOfLines={2} style={styles.messageText}>
              {item?.coupons} {item?.message}{' '}
              {`(${item?.validdate} ${formatDate(item?.expiryDate)})`}
            </Text>
            <View style={styles.mainTouchBuyView}>
              <TouchableOpacity
                onPress={() => {
                  onViewPress(item);
                }}
                activeOpacity={0.8}
                style={[styles.touchViewText, {flex: 1}]}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <SvgXml
                  style={{marginTop: '1%'}}
                  xml={appImagesSvg.greenRightArrow}
                />
              </TouchableOpacity>
              <View style={styles.buyBtnView}>
                <BTN
                  height={hp('3%')}
                  width={wp('24%')}
                  title={`Buy Now ₹${item?.walletPrice}`}
                  fontSize={RFValue(10)}
                  textTransform={'capitalize'}
                  onPress={onBuyPress}
                />
              </View>
            </View>
          </View>
        </View>
      </Surface>
    </View>
  );
};

export default VouchersGiftCard;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    justifyContent: 'center',
  },
  surfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('14%'),
    borderWidth: 0.1,
    borderColor: colors.black50,
  },
  innerMainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageView: {
    height: hp('14%'),
    width: wp('30%'),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.colorC1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerViewCircel: {
    height: hp('10.5%'),
    width: wp('23%'),
    backgroundColor: colors.colorFB,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: wp('1.6%'),
    borderColor: colors.colorFF,
  },
  discountText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  discountValue: {
    fontSize: RFValue(24),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  restaurantView: {
    position: 'absolute',
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorC1,
    minHeight: hp('4%'),
    width: wp('30%'),
    bottom: 0.1,
    borderBottomLeftRadius: 10,
  },
  restaurantName: {
    fontSize: RFValue(11),
    fontFamily: fonts.regular,
    color: colors.white,
    width: wp('30%'),
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  textMainView: {
    marginTop: '4%',
    marginLeft: '3%',
  },
  titleText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  messageText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black85,
    width: wp('55%'),
    marginTop: '4%',
  },
  mainTouchBuyView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchViewText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
    width: wp('30%'),
    height: hp('4%'),
  },
  viewDetailsText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.lightGreen1,
  },
  buyBtnView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
});
