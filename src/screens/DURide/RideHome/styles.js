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
  bottomImageView: {
    marginTop: Platform.OS === 'ios' ? hp('1%') : hp('2%'),
  },
  bottomImage: {
    height:Platform.OS === 'ios'?hp('31%') : hp('37%'), width: wp('100%')
  },
    bottoImageTextMainView: {
    position: 'absolute', top: hp('3%'),
    justifyContent: 'center', marginLeft: wp('5%')
  },
  duuittText: {
    fontSize: RFValue(18), fontFamily: fonts.bold, color: colors.green
  },
  everyMileText: {
    fontSize: RFValue(32), fontFamily: fonts.bold, color: colors.color85c,
    marginTop: '4%'
  },
});
