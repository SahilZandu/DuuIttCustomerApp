import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../theme/colors';
import { fonts } from '../../../../theme/fonts/fonts';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    
  },
  mainView:{
    flex:1,
  },
  offerTextView:{
    marginTop:'3%',
    marginHorizontal:20
  },
  offerText:{
    fontSize:RFValue(13),
    fontFamily:fonts.semiBold,
    color:colors.black
  },
  NoDataView:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('25%'),
  },
  NoDataText:{
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black,
  }
 
});
