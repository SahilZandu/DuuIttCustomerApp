import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Modal,
  Image,
  Pressable,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import DotedLine from './DotedLine';
import {colors} from '../../../theme/colors';
import BTN from '../../../components/cta/BTN';
import Spacer from '../../../halpers/Spacer';
import {currencyFormat} from '../../../halpers/currencyFormat';

const CouponDetail = ({
  visible,
  selectedData,
  onClose,
  item,
  onApply,
  getCartTotal,
}) => {
  // console.log(
  //   'item--',
  //   item,
  //   getCartTotal,
  // );

  const isDisabled = 
  selectedData?.referral_code === item?.referral_code || 
  getCartTotal?.cartTotal < item?.discount_price;

  let list = [
    {
      id: '1',
      title: 'This offer is personalized for you.',
    },
    {
      id: '2',
      title: `Maximum instant discount of ₹ ${item?.discount_price}`,
    },
    {
      id: '3',
      title: `Applicable maximum ${item?.time ?? 1} times in a day.`,
    },
    {
      id: '4',
      title: 'Other T&Cs may apply.',
    },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <View style={styles.container}>
        <Pressable onPress={() => onClose()} style={styles.backButtonTouch}>
          <Image
            resizeMode="contain"
            style={{height: 45, width: 45}}
            source={appImages.crossClose} // Your icon image
          />
        </Pressable>
        <View style={styles.mainWhiteView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: '5%'}}>
            <View style={styles.innerMainView}>
              <View style={styles.coupanDetailView}>
                <Text numberOfLines={1} style={styles.coupanText}>
                  Coupon Details
                </Text>

                <View style={styles.mainCardView}>
                  <View style={styles.cardView}>
                    <View style={styles.imageGetTextView}>
                      <Image
                        style={styles.parcentImage}
                        source={appImages.offerPercent}
                      />
                      <Text style={styles.getText}>
                        Get{' '}
                        {item?.discount_type === 'percentage'
                          ? `${item?.discount_percentage}%`
                          : currencyFormat(
                              Number(item?.discount_percentage),
                            )}{' '}
                        OFF up to{' '}
                        {currencyFormat(Number(item?.discount_percentage))}
                      </Text>
                    </View>

                    <Text style={styles.refralCodeText}>
                      {item?.referral_code}
                    </Text>
                    {list?.map((data, i) => {
                      return (
                        <View style={styles.listView}>
                          <SvgXml
                            width={22}
                            height={22}
                            xml={appImagesSvg.tickColor}
                          />
                          <Text numberOfLines={2} style={styles.titleText}>
                            {data?.title}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <Spacer space={'13%'} />
                  <BTN
                    disable={
                      isDisabled ? true
                        : false
                    }
                    title={'Apply'}
                    onPress={onApply}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CouponDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  backButtonTouch: {
    alignItems: 'center',
    zIndex: 1,
    alignSelf: 'center',
    marginBottom: '3%',
  },
  mainWhiteView: {
    backgroundColor: colors.white,
    height: hp('50%'),
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: colors.colorF9,
    paddingTop: '3%',
  },
  innerMainView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: colors.colorF9,
    marginTop: '3%',
  },
  coupanDetailView: {
    borderRadius: 20,
    justifyContent: 'center',
  },
  coupanText: {
    fontFamily: fonts.bold,
    fontSize: RFValue(17),
    marginLeft: '5%',
    color: colors.black,
  },
  mainCardView: {
    paddingHorizontal: 16,
    marginTop: '5%',
  },
  cardView: {
    paddingHorizontal: 10,
    paddingVertical: 18,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderColor: colors.colorF9,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imageGetTextView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  parcentImage: {
    width: 20,
    height: 20,
  },
  getText: {
    marginLeft: '3%',
    fontFamily: fonts.bold,
    fontSize: RFValue(15),
    color: colors.black,
  },
  refralCodeText: {
    marginLeft: '10%',
    borderRadius: 12,
    width: wp('26%'),
    marginTop: '3%',
    textAlign: 'center',
    paddingVertical: '0.8%',
    color: colors.colorAF,
    borderColor: colors.colorAF,
    borderWidth: 1,
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
  },
  listView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: '4%',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(12),
    color: colors.color8F,
    marginLeft: '2%',
    width: wp('78%'),
  },
});
