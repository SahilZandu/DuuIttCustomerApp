import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../../theme/colors';
import {fonts} from '../../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  flatListView: {
    flex: 1,
    justifyContent: 'center',
  },
  innerView: {
    // marginTop: '1%',
    justifyContent: 'center',
  },
  noDataView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  noDataText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  modalMainView: {
    justifyContent: 'center',

    // height: hp('80%'),
  },
  modalImage: {
    position: 'absolute',
    width: wp('75%'),
    height: hp('38%'),
    alignSelf: 'center',
    borderRadius: 20,
    // marginTop: hp('-30%'),
  },
  modalImagesrct: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    overflow: 'hidden',
    width: wp('72%'),
    height: hp('30%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('-3%'),
  },
  modalMainInnerView: {
    backgroundColor: colors.white,
    marginTop: hp('6%'),
    borderRadius: 20,
  },
  modalInnerView: {
    backgroundColor: colors.white,
    // height: hp('32%'),
    // marginTop: hp('6%'),
    marginBottom: '6%',
    borderRadius: 20,
  },
  mainScrtView: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    marginHorizontal: 20,
    marginTop: '5%',
  },
  giftCardDetails: {
    fontSize: RFValue(17),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('4%'),
  },
});
