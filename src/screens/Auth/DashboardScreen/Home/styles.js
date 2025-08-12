import {Platform, StatusBar, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../theme/colors';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  mainView:{
    flex:1,
  },
  innerView:{
    justifyContent:'center',
    marginHorizontal:10,

  },
  bottomImageView:{
    marginTop:Platform.OS === 'ios'? '0.5%': '2%'
  },
  bottomImage:{
    height: hp('30%'),
     width: wp('100%')
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
 
 
});
