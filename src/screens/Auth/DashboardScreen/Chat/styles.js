import { Platform, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../../theme/colors';
import { fonts } from '../../../../theme/fonts/fonts';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.appBackground
    },
    haederView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: colors.appBackground,
    },
    rightText: {
        fontSize: RFValue(13),
        fontFamily: fonts.medium,
        color: colors.white,
    },
    leftText: {
        fontSize: RFValue(13),
        fontFamily: fonts.medium,
        color: colors.black,
    },
    rightBoxView: {
        backgroundColor: colors.main,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginBottom: hp('2%'),
        marginRight:wp("2%")
    },
    leftBoxView: {
        backgroundColor: colors.white,
        borderColor: colors.colorD9,
        borderWidth: 0.4,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        marginBottom: hp('2%'),
        marginLeft:wp("2%")
    },
    toolBarView: {
        borderTopWidth: 0,
        backgroundColor: colors.appBackground,
        // borderRadius: 10,
        // marginHorizontal: 16,
        paddingVertical: 6,
        bottom: Platform.OS == 'ios' ? '0.1%' : '0.1%'
    },
    inputTextMainView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 16,
        backgroundColor: colors.white,
    },
    inputText: {
        flex: 1,
        color: colors.black,
        fontSize: RFValue(13),
        fontFamily: fonts.medium,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        marginLeft: '3%',
        maxHeight: hp("10%"),
    },
    buttonMainView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    touchMike: {
        marginRight: 2,
        borderRadius: 100,
        height: hp('4.5%'),
        width: hp('4.5%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnCenterLine: {
        height: hp('3%'),
        width: wp('0.3'),
        backgroundColor: colors.colorA9,
        alignSelf: 'center',
    },
    touchSendBtn:{
        marginRight: 5,
        borderRadius: 20,
        borderRadius: 100,
        height: hp('4.5%'),
        width: hp('4.5%'),
        justifyContent: 'center',
        alignItems: 'center',
    }



});
