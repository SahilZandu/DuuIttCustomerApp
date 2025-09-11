import { Platform, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  addressView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    height: hp('12%'),
    marginTop: hp('-2%'),
  },
  addressContainView: {
    paddingHorizontal: 30,
    paddingVertical: '1%',
    // marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 20
  },
  chooseText: {
    textAlign: 'center', marginTop: hp('9%'),
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black
  },
  currentLocTouch: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? hp('25.5') : hp('23%'),
    right: '3%',
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  currentLocView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    paddingHorizontal: '3%',
  },

  currentLocImage: {
    width: 22,
    height: 22,
  },
  currentLocText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.main,
    marginLeft: '3%',
  },
});
