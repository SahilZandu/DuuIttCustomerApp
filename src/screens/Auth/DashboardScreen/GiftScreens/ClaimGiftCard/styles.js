import {StyleSheet} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../../theme/colors';
import { fonts } from '../../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  upperMainView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  botomBtnView: {
    position: 'absolute',
    bottom: '0.1%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    width: wp('100%'),
    height: hp('8%'),
  },
  detailsView: {
    marginTop: hp('4%'),
    marginHorizontal: 20,
  },
  detailsText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
