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
    backgroundColor: colors.appBackground,
  },
  main: {
    flex: 1,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  btnView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom:hp('8%'),
    right: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTouch: {
    alignSelf: 'flex-end',
    marginRight: '4%',
    bottom: hp('0.4%'),
    backgroundColor:'transparent',
  },
});
