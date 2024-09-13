import {Platform, StyleSheet} from 'react-native';
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
    backgroundColor: colors.white,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  image: {
    height: 130,
    width: 130,
    alignSelf: 'center',
  },
  totalAmount: {
    fontSize: RFValue(21),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '5%',
  },
  amount: {
    fontSize: RFValue(31),
    fontFamily: fonts.medium,
    color: colors.main,
    marginTop: '3%',
  },
  changeLocationText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black75,
    marginTop: '3%',
    textAlign: 'center',
    lineHeight: 20,
  },
  BTHView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  BTHText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black75,
  },
  BTHBottomLine: {
    height: 1,
    width: wp('26%'),
    backgroundColor: colors.black75,
  },
});
