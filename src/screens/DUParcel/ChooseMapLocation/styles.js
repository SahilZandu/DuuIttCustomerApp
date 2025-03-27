import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { screenHeight, screenWidth } from '../../../halpers/matrics';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  bottomPopUpContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    bottom: 0,
    alignSelf: 'center',
    // height: hp('23%'),
    height:screenHeight(23)
  },
  currentLocTouch: {
    position: 'absolute',
    bottom: hp('24%'),
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
