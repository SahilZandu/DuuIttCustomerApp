import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  outerScrollView: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: '2%',
  },
  bottomImageView:{
    marginTop: '5%'
  },
  bottomImage:{
    height: hp('30%'), width: wp('100%')
  }
});
