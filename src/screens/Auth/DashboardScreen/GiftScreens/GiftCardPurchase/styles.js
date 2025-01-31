import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../../theme/colors';
import {fonts} from '../../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  upperMainView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  summaryView: {
    marginHorizontal: 20,
    marginTop: hp('3%'),
  },
  summaryText: {
    fontSize: RFValue(14),
    color: colors.black,
    fontFamily: fonts.medium,
  },
  subTotalText: {
    fontSize: RFValue(12),
    color: colors.black85,
    fontFamily: fonts.medium,
  },
  subTotalValue: {
    color: colors.black85,
    fontSize: RFValue(12),
  },
  totalText: {
    fontSize: RFValue(12),
    color: colors.black,
    fontFamily: fonts.medium,
  },
  totalValue: {
    color: colors.black,
    fontSize: RFValue(12),
  },
  bottomButtonView: {
    position: 'absolute',
    bottom: '-0.4%',
    backgroundColor: colors.white,
  },
  bottomBtnSurface: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('100%'),
    height: hp('9%'),
    borderWidth: 0.5,
    borderColor: colors.colorD9,
  },
  bottomInnerView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentModeTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('46%'),
    height: hp('6%'),
    marginTop: hp('2%'),
  },
  paymentTitle: {
    marginLeft: '5%',
    fontSize: RFValue(13),
    fontFamily: fonts.black,
    maxWidth: wp('24%'),
  },
  buyBtnView: {
    justifyContent: 'center',
    marginTop: hp('4%'),
  },
});
