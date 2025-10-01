import { Platform, StatusBar, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../theme/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../../theme/fonts/fonts';




export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  mainView: {
    flex: 1,
  },
  innerView: {
    justifyContent: 'center',
    marginHorizontal: 10,

  },
  bottomImageView: {
    // marginTop: Platform.OS === 'ios' ? '0.5%' : '2%',
    marginTop: Platform.OS === 'ios' ? '4%' : '4%',
  },
  bottomImage: {
    height: Platform.OS === 'ios' ? hp('46%') : hp('58%'),
    width: wp('110%'),
    marginHorizontal: wp('-5%'),
  },
  bottomImageBanner: {
    height: Platform.OS === 'ios' ? hp('33%') : hp('36%'),
    width: wp('110%'),
    marginHorizontal: wp('-5%'),
  },
  mainImageView: {
    position: 'absolute',  top: hp('3%'),
    marginLeft: wp('5%')
  },
  duuittText: {
    fontSize: RFValue(18), fontFamily: fonts.bold, color: colors.green
  },
  everyText: {
    fontSize: RFValue(32), fontFamily:fonts.bold, color: colors.color85c,
    marginTop: '4%'
  },
  imageAndMadeTextView: {
    flexDirection: 'row', alignItems: 'center', marginTop: '5%'
  },
  flagImage: {
    width: 20, height: 20
  },
  madeInIndeaText: {
    fontSize: RFValue(15), fontFamily: fonts.medium, color: colors.color9D,
    marginLeft: '2%'
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight, // This gets the status bar height
    backgroundColor: 'red', // Match this with your image background color
    zIndex: 0,
  },
  haederShowView: {
    position: 'absolute', width: wp('100%'),
    top: Platform.OS == 'ios' ? hp('5.5%') : hp('5%')
  }


});
