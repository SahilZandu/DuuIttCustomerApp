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
    backgroundColor:colors.appBackground,
  },
  screen: {
    // backgroundColor: colors.white,
    justifyContent:'center'
  },
  
});
