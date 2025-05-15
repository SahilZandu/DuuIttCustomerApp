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
    marginTop: '0.5%',
  },
  imageMainView:{
    marginTop: '1%',
     marginHorizontal: 20 
  },
  imageView:{
     justifyContent: 'center',
     alignItems: 'center',
  },
  bottomImageView:{
    marginTop: '-8%',
  },
  bottomImage:{
    height: hp('35%'), width: wp('100%')
  }
});
