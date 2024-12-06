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
  main:{
    flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
  },
  pickedImage:
  {
    width: 100, height: 100
  },
 title:{
    fontSize: RFValue(22),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '6%',
  },
  message:{
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black65,
    marginTop: '2%',
    lineHeight: 20,
    marginHorizontal: 40,
  },
  backToHomeView:{
    width: wp('40%'),
    height: hp('4%'),
    marginTop: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToHomeText:{
    fontSize: RFValue(14),
              fontFamily: fonts.medium,
              color: colors.black65,
              textAlign: 'center',
  },
  backHomeBottonLine:{
    height: 1.5,
    width: wp('29%'),
    backgroundColor: colors.black65,
    marginTop: '1%',
  }
 
});
