import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../../theme/colors';
import { fonts } from '../../../../../theme/fonts/fonts';


export const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: colors.appBackground
    },
  main: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  claimContainerView: {
    flex:1,
    justifyContent: 'center',
  },
  claimText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.medium,
  },
  mapRenderView: {
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
    height: hp('32%'),
  },
  modalImage: {
    width: wp('75%'),
    height: hp('24%'),
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: hp('-30%'),
  },
  modalInnerView: {
    backgroundColor: colors.white,
    height: hp('32%'),
    marginTop: hp('6%'),
    borderRadius: 20,
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
