import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  mainScreen: {
    flex: 1,
  },
  sliderMainView: {
    marginHorizontal: 20,
    justifyContent: 'center',
    marginTop: '2%',
  },
  sliderInnerView: {
    marginHorizontal: '-1%',
    alignContent: 'center',
  },
  orderMainView: {
    marginTop: '3%',
    paddingLeft:'5%',
  },
  exploreView: {
    marginTop: '3%',
    justifyContent: 'center',
    backgroundColor: colors.appBackground,
    paddingBottom: '2%',
  },
  restaurantMainView: {
    flex: 1,
    alignItems: 'center',
    marginTop: '3%',
  },
  dataFoundView: {
    alignItems: 'center',
    marginTop: hp('10%'),
    height: hp('30%'),
  },
  dataFoundText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
  },
  rating: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '3%',
  },
  mint: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.color27,
    marginLeft: '3%',
    width: wp('23%'),
  },
  titleText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '2.5%',
    marginLeft: '5%',
  },
  filterView: {
    marginLeft: '5%',
    justifyContent: 'center',
  },
  bottomImageView: {
    marginTop: '5%',
  },
  bottomImage: {
    height: hp('30%'),
    width: wp('100%'),
  },
  bottomCartBtnView:{
    justifyContent:'center',alignItems:'center'
  }
});
