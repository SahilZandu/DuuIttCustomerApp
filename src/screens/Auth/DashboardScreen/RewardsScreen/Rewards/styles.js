import { Platform, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../../theme/colors';
import { fonts } from '../../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({

  container: {
    flex: 1, backgroundColor: colors.appBackground
  },
  flatListView: {
    flex: 1,
    justifyContent: 'center',
  },
  innerView: {
    // marginTop: '1%',
    justifyContent: 'center',
  },

  renderView: {
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  showImageView: {
    justifyContent: 'flex-start', alignItems: 'flex-start'
  },
  showImage: {
    height: hp('8.5%'), borderTopRightRadius: 10, borderTopLeftRadius: 10
  },
  logoImage: {
    width: 45, height: 45, borderRadius: 100, marginTop: hp('-3%'), marginLeft: wp('4%')
  },
  restCashView: {
    marginHorizontal: 10, justifyContent: 'center'
  },
  restText: {
    fontSize: RFValue(12), fontFamily: fonts.medium, color: colors.black, marginTop: hp('0.3%')
  },
  flatListContainerView: {
    paddingBottom: '10%', justifyContent: 'center'
  },
  caskBackText: {
    fontSize: RFValue(8), fontFamily: fonts.regular, color: colors.black85, marginTop: '4%'
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
    width: wp('80%'),
    height: hp('30%'),
    alignSelf: 'center',
    borderRadius: 20,
  },
  modalImagesrct: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    overflow: 'hidden',
    width: wp('80%'),
    height: hp('30%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
