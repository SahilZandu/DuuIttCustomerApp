import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../theme/colors';
import { fonts } from '../../../../theme/fonts/fonts';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground
  },
  upperLine: {
    height: 1, backgroundColor: colors.colorD9
  },
  renderMainView: {
    marginHorizontal: 16, marginTop: '2%'
  },
  touchImage: {
    flexDirection: 'row', marginTop: '3%'
  },
  hotSlotImage: {
    top: 15, bottom: 15, right: 5, left: 5
  },
  nameTitle: {
    flex: 1,
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  answerText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color80,
    marginTop: '5%',
  },
  emailPhoneText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.green,
    marginTop: '5%',
  },
  bottonLineView: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '5%'
  }




});
