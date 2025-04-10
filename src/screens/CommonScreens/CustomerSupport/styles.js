import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  innerView: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  image: {
    width: wp('100%'),
    height: hp('30%'),
    alignSelf: 'center',
  },
  supportText: {
    fontSize: RFValue(21),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: hp('5%'),
    textAlign: 'center',
  },
  ifText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black85,
    marginTop: '3%',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonView: {
    flexDirection: 'row',
    marginTop: hp('7%'),
    justifyContent: 'space-between',
  },
});
