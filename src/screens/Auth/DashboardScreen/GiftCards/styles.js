import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../theme/colors';
import {fonts} from '../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  addMoneyShadow: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('17%'),
    marginTop: '5%',
    borderWidth: 1,
    borderColor: colors.colorD9,
  },
  addMoneyInnerView: {
    // marginHorizontal: 24,
    marginTop: '6%',
  },
  addMoneyText: {
    fontSize: RFValue(17),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  inputTextView: {
    height: hp('5.6%'),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.colorB6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rateText: {
    marginLeft: '4%',
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  inputText: {
    padding: 5,
    borderRadius: 50,
    height: hp('5.6%'),
    width: wp('74%'),
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
  },
  innerView: {
    marginTop: '3%',
  },
  giftAmountView: {
    flexDirection: 'row',
  },
  giftCardAmount: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  giftAmount: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  claimContainerView: {
    marginTop: hp('3%'),
    justifyContent: 'center',
  },
  claimText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.medium,
  },
  mapRenderView: {
    marginTop: '2%',
    justifyContent: 'center',
  },
  noDataView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  noDataText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  modalMainView: {
    justifyContent: 'center',
    height: hp('32%'),
  },
  modalImage: {
    width: wp('75%'),
    height: hp('24%'),
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: hp('-30%'),
  },
  modalInnerView: {
    backgroundColor: colors.white,
    height: hp('32%'),
    marginTop: hp('6%'),
    borderRadius: 20,
  },
  textView: {
    marginHorizontal: 20,
    marginTop: '5%',
  },
  giftCardDetails: {
    fontSize: RFValue(17),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('4%'),
  },
});
