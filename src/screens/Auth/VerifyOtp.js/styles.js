import {StyleSheet} from 'react-native';
import {fonts} from '../../../theme/fonts/fonts';
import {colors} from '../../../theme/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    marginHorizontal: 30,
  },
  imageTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '12%',
  },
  varificationText: {
    fontSize: RFValue(21),
    fontFamily: fonts.semiBold,
    color: colors.main,
    marginTop: '2.5%',
  },
  fourDigitText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.color80,
    marginTop: '2.5%',
    textAlign: 'center',
    marginHorizontal: 30,
    lineHeight: 22,
  },
});
