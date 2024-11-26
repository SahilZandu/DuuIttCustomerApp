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
    backgroundColor: colors.white,
  },
  upperMainView: {
    marginHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('4%'),
  },
  scanText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.color8F,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  DetailsView: {
    marginTop: hp('3%'),
    marginHorizontal: 20,
  },
  detailsText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
