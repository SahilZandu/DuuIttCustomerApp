import { Platform, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../../theme/colors';
import { fonts } from '../../../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: colors.appBackground,
    },
    upperMainView: {
        justifyContent: 'center',
        marginTop: '1%'
    },
    walletSurfaceView: {
        shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
        backgroundColor: colors.white,
        borderRadius: 10,
        minHeight: hp('40%'),
        width: wp('90%'),
        marginHorizontal: 20,
    },
    innerViewWallet: {
        marginHorizontal: 20, justifyContent: 'center'
    },
    walletTotalBalView: {
        justifyContent: 'center', alignItems: 'center', marginTop: hp('2%')
    },
    totalBalValue: {
        fontSize: RFValue(27), fontFamily: fonts.medium, color: colors.black
    },
    totalBalText: {
        fontSize: RFValue(11), fontFamily: fonts.medium, color: colors.black85, marginTop: '1%'
    },
    bottomLine: {
        height: 1.5, backgroundColor: colors.colorD9, width: wp('82%'), marginTop: hp('2%')
    },
    bottomLineAddBtn: {
        height: 1.5, backgroundColor: colors.colorD9, width: wp('82%'), marginTop: hp('0.1%')
    },
    walletRenderText: {
        fontSize: RFValue(11), fontFamily: fonts.medium, color: colors.color83, marginTop: hp('2.5%')
    },
    walletRenderValue: {
        fontSize: RFValue(13), fontFamily: fonts.semiBold, color: colors.black, marginTop: '2%'
    },
    transationHistView: {
        marginHorizontal: 20, marginTop: '4%', justifyContent: 'center'
    },
    transationHistText: {
        fontSize: RFValue(13), fontFamily: fonts.semiBold, color: colors.color24
    },
    giftCartText: {
        marginHorizontal: 20, marginTop: '5%',
        fontSize: RFValue(13), fontFamily: fonts.medium, color: colors.black
    },
    giftCardSurfaceView: {
        shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
        backgroundColor: colors.white,
        borderRadius: 10,
        width: wp('90%'),
        marginHorizontal: 20,
        marginTop: '3%'
    },
    addMoneyInnerView: {
        // marginHorizontal: 24,
        marginTop: '6%',
      },
      addMoneyText: {
        fontSize: RFValue(17),
        fontFamily: fonts.semiBold,
        color: colors.black,
      },
      inputTextView: {
        height: hp('5.6%'),
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.colorB6,
        alignItems: 'center',
        flexDirection: 'row',
      },
      rateText: {
        marginLeft: '4%',
        fontSize: RFValue(13),
        fontFamily: fonts.medium,
        color: colors.black,
      },
      inputText: {
        padding: 5,
        borderRadius: 50,
        height: hp('5.6%'),
        width: wp('74%'),
        fontSize: RFValue(13),
        fontFamily: fonts.medium,
      },

});
