import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../theme/colors';
import {fonts} from '../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  noDataView:{
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  naDataText:{
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black,
  }
  
});
