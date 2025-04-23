import {StyleSheet} from 'react-native';
import {fonts} from '../../../theme/fonts/fonts';
import {colors} from '../../../theme/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  screen: {
    backgroundColor: colors.appBackground,
    marginTop:'4%'
  },
 
});
