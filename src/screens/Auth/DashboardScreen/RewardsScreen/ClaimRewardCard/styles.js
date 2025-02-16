import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../../theme/colors';
import { fonts } from '../../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  imageView: {
    flex: 1, justifyContent: 'center'
  },
  restImage: {
    width: wp('100%'), height: hp('25%')
  },
  logoImage: {
    width: wp('15%'), height: hp('7%'), marginTop: hp('-4%'), marginLeft: wp('6%')
  },
  restNameText: {
    paddingHorizontal: 20, fontSize: RFValue(17),
    fontFamily: fonts.medium, color: colors.black, marginTop: hp('2.5%')
  },
  botomBtnView: {
    position: 'absolute',
    bottom: '0.1%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    width: wp('100%'),
    height: hp('8%'),
  },
  detailsView: {
    marginTop: hp('2%'),
    marginHorizontal: 20,
  },
  detailsText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
