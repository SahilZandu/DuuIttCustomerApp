import {StyleSheet} from 'react-native';
import {fonts} from '../../../theme/fonts/fonts';
import {colors} from '../../../theme/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.appBackground,
  },
  screen: {
    justifyContent:'center'
  },
  orText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.color72,
    textAlign: 'center',
  },
  touchView: {
    marginTop: '3%',
    width: '70%',
    alignSelf: 'center',
  },

  text: {
    fontFamily: fonts.semiBold,
    marginTop: '15%',
    marginBottom: '3%',
    fontSize: RFValue(15),
    alignSelf: 'center',
  },
  login: {
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    alignSelf: 'center',
    color: colors.color72,
  },
  termsPolicyMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  agreeText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black65,
  },
  termsPolicyView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    flexDirection: 'row',
  },
  termsText: {
    fontSize: RFValue(13),
    fontFamily: fonts.bold,
    color: colors.main,
  },
  andText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black65,
  },
  privacyText: {
    fontSize: RFValue(13),
    fontFamily: fonts.bold,
    color: colors.main,
  },
});
