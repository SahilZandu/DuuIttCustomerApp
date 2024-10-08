import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../theme/colors';
import {fonts} from '../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  innerMainView: {
    marginHorizontal: 20,
  },
  surfaceView: {
    shadowColor: colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 8,
    width: wp('90%'),
    marginTop: '2%',
  },
 
  walletRateView: {
    flexDirection: 'row',
  },
  walletView: {
    flexDirection: 'row',
    backgroundColor: colors.colorD6,
    height: hp('5.5%'),
    width: wp('45%'),
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  walletImage: {
    marginLeft: '7%',
  },
  walletText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black85,
    marginLeft: '4%',
  },
  rateView: {
    backgroundColor: colors.white,
    height: hp('5.5%'),
    width: wp('45%'),
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  rateText: {
    fontSize: RFValue(13),
    fontFamily: fonts.regular,
    color: colors.black,
    marginLeft: '7%',
  },
  offerTextView: {
    marginTop: '3%',
  },
  offerText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
});
