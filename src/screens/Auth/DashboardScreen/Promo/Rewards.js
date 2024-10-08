import React from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RewardsTwoItemComp from '../../../../components/RewardsTwoItemComp';
import {currencyFormat} from '../../../../halpers/currencyFormat';
import {promoRewards, promoVouchers} from '../../../../stores/DummyData/Promo';
import {colors} from '../../../../theme/colors';
import {fonts} from '../../../../theme/fonts/fonts';


const Rewards = ({navigation}) => {
  const renderItem = ({item}) => (
    <Surface elevation={2} style={styles.surfaceView}>
      <View style={styles.surfaceMainView}>
        <View style={styles.voucherPriceView}>
          <Text style={styles.voucherPrice}>{currencyFormat(item?.price)}</Text>
        </View>
        <View style={styles.walletCoupanView}>
          <View style={styles.walletView}>
            <View style={styles.walletDotView} />
            <Text style={styles.walletText}> {item?.wallet}</Text>
          </View>
          <View style={styles.coupanView}>
            <View style={styles.coupanDotView} />
            <Text style={styles.foodCoupan}>{item?.foodCoupon}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.buyNowTouch}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.rewardsText}>Rewards</Text>
      <RewardsTwoItemComp
        title={'Your Rewards'}
        data={promoRewards}
        navigation={navigation}
        onPress={() => {
          alert('yes ..');
        }}
      />

      <View style={styles.vouchersView}>
        <Text style={styles.voucherText}>Vouchers</Text>
        <View>
          <FlatList
            data={promoVouchers}
            renderItem={renderItem}
            keyExtractor={item => item?.id}
            showsHorizontalScrollIndicator={false} 
          />
        </View>
      </View>
    </View>
  );
};

export default Rewards;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
  },
  rewardsText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
    textAlign: 'center',
  },
  vouchersView: {
    marginTop: '7%',
  },
  voucherText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  surfaceView: {
    shadowColor: colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('13%'),
    marginTop: '5%',
    borderWidth: 1,
    borderColor: colors.colorD9,
  },
  surfaceMainView: {
    flexDirection: 'row',
  },
  voucherPriceView: {
    width: wp('30%'),
    height: hp('13%'),
    backgroundColor: colors.main,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherPrice: {
    fontSize: RFValue(20),
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  walletCoupanView: {
    width: wp('60%'),
    height: hp('13%'),
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  walletView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '3%',
    marginTop: '4%',
  },
  walletDotView: {
    height: 5,
    width: 5,
    backgroundColor: colors.black85,
    borderRadius: 100,
    alignSelf: 'center',
  },
  walletText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black85,
    marginLeft: '1.5%',
  },
  coupanView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '3%',
    marginTop: '2%',
  },
  coupanDotView: {
    height: 5,
    width: 5,
    backgroundColor: colors.black85,
    borderRadius: 100,
    marginTop: '-8%',
    alignSelf: 'center',
  },
  foodCoupan: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black85,
    marginLeft: '2.5%',
  },
  buyNowTouch: {
    alignSelf: 'flex-end',
    right: '8%',
    marginTop: '3%',
    backgroundColor: colors.main,
    padding: 6,
    paddingHorizontal: '8%',
    borderRadius: 30,
  },
  buyNowText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.white,
  },
});
