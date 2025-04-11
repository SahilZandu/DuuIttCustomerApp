// import {Platform, StyleSheet} from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {colors} from '../../../theme/colors';
// import {fonts} from '../../../theme/fonts/fonts';

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.appBackground,
//   },
//   main: {
//     justifyContent: 'center',
//     marginTop: '25%',
//     marginHorizontal: 30,
//   },
//   image: {
//     height: 160,
//     width: 160,
//     alignSelf: 'center',
//   },
//   totalAmount: {
//     fontSize: RFValue(21),
//     fontFamily: fonts.medium,
//     color: colors.black,
//     marginTop: '2%',
//     textAlign: 'center',
//   },
//   amount: {
//     fontSize: RFValue(31),
//     fontFamily: fonts.medium,
//     color: colors.black,
//     marginTop: '1%',
//     textAlign: 'center',
//   },
//   changeLocationText: {
//     fontSize: RFValue(12),
//     fontFamily: fonts.regular,
//     color: colors.black75,
//     marginTop: '3%',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   BTHView: {
//     alignSelf: 'center',
//     marginTop: '5%',
//   },
//   BTHText: {
//     fontSize: RFValue(13),
//     fontFamily: fonts.medium,
//     color: colors.black75,
//   },
//   BTHBottomLine: {
//     height: 1,
//     width: wp('26%'),
//     backgroundColor: colors.black75,
//   },
//   rateSurfaceView: {
//     shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     height: hp('7%'),
//     marginTop: '6%',
//     justifyContent: 'center',
//   },
//   surfaceInnerView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 20,
//   },
//   rateImage: {
//     width: 30,
//     height: 30,
//   },
//   rateText: {
//     fontSize: RFValue(14),
//     fontFamily: fonts.semiBold,
//     color: colors.black,
//     marginLeft: '4%',
//   },
//   containerDriverTouch: {
//     position: 'absolute',
//     backgroundColor: colors.white,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     bottom: 0,
//     height: hp('35%'),
//     width: wp('100%'),
//   },
//   innerDriverView: {
//     paddingHorizontal: 20,
//     marginTop: '2%',
//   },
//   topLineView: {
//     height: hp('0.5%'),
//     backgroundColor: colors.colorD9,
//     width: wp('15%'),
//     borderRadius: 10,
//     alignSelf: 'center',
//     marginTop: '3%',
//   },
//   homeSliderView: {
//     marginHorizontal: -7,
//     alignContent: 'center',
//     justifyContent: 'center',
//   },
//   modalMainView: {
//     height: hp('48%'),
//     backgroundColor: colors.white,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   modalTitleView: {
//     marginHorizontal: 20,
//     justifyContent: 'center',
//   },
//   modalTitle: {
//     fontSize: RFValue(15),
//     fontFamily: fonts.bold,
//     color: colors.black,
//     marginTop: '5%',
//   },
//   modalMessage: {
//     fontSize: RFValue(13),
//     fontFamily: fonts.regular,
//     color: colors.color24,
//     marginTop: '3%',
//     lineHeight: 20,
//   },
//   modalAmount:{
//     fontSize: RFValue(32),
//     fontFamily: fonts.semiBold,
//     color: colors.black,
//     marginTop: '5%',
//     textAlign: 'center',
//   },
//   modalFairText:{
//     fontSize: RFValue(12),
//     fontFamily: fonts.regular,
//     color: colors.black,
//     marginTop: '3%',
//     textAlign: 'center',
//   },
//   progessBarView:{
//     justifyContent: 'center', marginTop: hp('3%')
//   },
//   sliderView:{
//     position: 'absolute', justifyContent: 'center'
//   },
//   priceRenderView:{
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginHorizontal: 10,
//     marginTop: '6%',
//   },
//   btnPNView:{
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginHorizontal: 10,
//     marginTop: '4%',
//   },
//   priceText:{
//     fontSize: RFValue(12),
//     fontFamily: fonts.medium,
//     color: colors.black,
//   }

// });

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
  main: {
    justifyContent: 'center',
    marginTop: '25%',
    marginHorizontal: 30,
  },
  image: {
    height: 160,
    width: 160,
    alignSelf: 'center',
  },
  totalAmount: {
    fontSize: RFValue(21),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '2%',
    textAlign: 'center',
  },
  amount: {
    fontSize: RFValue(31),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '1%',
    textAlign: 'center',
  },
  changeLocationText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black75,
    marginTop: '3%',
    textAlign: 'center',
    lineHeight: 20,
  },
  BTHView: {
    alignSelf: 'center',
    marginTop: '5%',
  },
  BTHText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black75,
  },
  BTHBottomLine: {
    height: 1,
    width: wp('26%'),
    backgroundColor: colors.black75,
  },
  rateSurfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('7%'),
    marginTop: '6%',
    justifyContent: 'center',
  },
  surfaceInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  rateImage: {
    width: 30,
    height: 30,
  },
  rateText: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginLeft: '4%',
  },
  containerDriverTouch: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    bottom: 0,
    height: hp('53%'),
    width: wp('100%'),
  },
  innerDriverView: {
    paddingHorizontal: 20,
    marginTop: '2%',
  },
  topLineView: {
    height: hp('0.5%'),
    backgroundColor: colors.colorD9,
    width: wp('15%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '3%',
  },
  homeSliderView: {
    marginHorizontal: -7,
    alignContent: 'center',
    justifyContent: 'center',
  },
  modalMainView: {
    height: hp('48%'),
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitleView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: RFValue(15),
    fontFamily: fonts.bold,
    color: colors.black,
    marginTop: '5%',
  },
  modalMessage: {
    fontSize: RFValue(13),
    fontFamily: fonts.regular,
    color: colors.color24,
    marginTop: '3%',
    lineHeight: 20,
  },
  modalAmount: {
    fontSize: RFValue(32),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '5%',
    textAlign: 'center',
  },
  modalFairText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
    marginTop: '3%',
    textAlign: 'center',
  },
  progessBarView: {
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  sliderView: {
    position: 'absolute',
    justifyContent: 'center',
  },
  priceRenderView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: '6%',
  },
  btnPNView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: '4%',
  },
  priceText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
