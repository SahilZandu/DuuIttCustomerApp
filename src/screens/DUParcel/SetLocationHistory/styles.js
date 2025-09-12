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
  middleLineView: {
    height: 1,
    backgroundColor: colors.colorD1,
    marginTop: '4%',
    marginHorizontal: -20,
  },
  currentLocView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '4%'
  },
  currentLocTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocImage: {
    width: 22, height: 22
  },
  currentLocText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.main, marginLeft: '3%'
  }

});
