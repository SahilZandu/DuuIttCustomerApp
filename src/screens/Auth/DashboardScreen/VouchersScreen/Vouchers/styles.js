import {StyleSheet} from 'react-native';
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
  surfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.colorD6,
    borderRadius: 10,
    height: hp('22%'),
    marginTop: '4%',
    justifyContent: 'center',
  },
  innerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    fontSize: RFValue(19),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: hp('1%'),
  },
  unlockText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black85,
    marginTop: hp('1%'),
  },
  frdText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.black75,
    marginTop: hp('1%'),
  },
  rendercardView: {
    marginTop: '2%',
    justifyContent: 'center',
  },
});
