import {Platform, StyleSheet} from 'react-native';
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
  }
 
 
});
