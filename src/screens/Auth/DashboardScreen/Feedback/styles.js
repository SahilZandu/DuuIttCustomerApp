import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../../theme/colors';
import {fonts} from '../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  mainView: {
    flex: 1,
  },
  inputView: {
    marginHorizontal: 20,
    marginTop: '3%',
  },
  tellAboutText: {
    marginTop: '5%',
    fontSize: RFValue(13),
    fontFamily: fonts.regular,
    color: colors.color8F,
    marginLeft: '1%',
  },
  bottomBtnView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
