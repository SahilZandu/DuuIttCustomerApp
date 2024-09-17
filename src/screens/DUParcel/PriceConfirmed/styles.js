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
    justifyContent: 'center',
    marginTop:'25%',
    marginHorizontal: 30,
  },
  image: {
    height: 180,
    width: 180,
    alignSelf: 'center',
  },
  totalAmount: {
    fontSize: RFValue(21),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '2%',
    textAlign:'center'
  },
  amount: {
    fontSize: RFValue(31),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '1%',
    textAlign:'center'
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
    alignSelf:'center',
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
