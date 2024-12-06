import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../../theme/colors';
import { fonts } from '../../../../../theme/fonts/fonts';


export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  upperMainView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  surfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.bottomBarColor,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('15%'),
    borderWidth: 0.5,
    borderColor: colors.colorD9,
    marginTop:'5%'
  },
  innerView:{
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  discountText:{
    fontSize: RFValue(33),
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  offText:{
    fontSize: RFValue(18),
    fontFamily: fonts.regular,
    color: colors.white,
  },
  detailsView: {
    marginTop: hp('4%'),
    marginHorizontal: 10,
  },
  detailsText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
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
    fontFamily: fonts.regular,
    maxWidth: wp('24%'),
  },
  buyBtnView: {
    justifyContent: 'center',
    marginTop: hp('4%'),
  },
 
 
});
