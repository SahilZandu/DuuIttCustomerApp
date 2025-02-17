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
    surfaceView: {
        shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
        backgroundColor: colors.white,
        borderRadius: 10,
        width: wp('90%'),
        height: hp('13%'),
        marginHorizontal: 20,
        marginTop: '3%'
    },
    surfaceInnerView: {
        backgroundColor: colors.colorC9,
        height: hp('13%'), borderRadius: 10,
        justifyContent: 'center', alignItems: 'center'
    },
    valurText:{
        fontSize:RFValue(27),fontFamily:fonts.medium,color:colors.black
    },
    totalText:{
        fontSize:RFValue(11),fontFamily:fonts.medium,color:colors.black85,marginTop:'3%'
    },
    transationHistView: {
        marginHorizontal: 20, marginTop: '5%', justifyContent: 'center'
    },
    transationHistText: {
        fontSize: RFValue(13), fontFamily: fonts.semiBold, color: colors.color24
    },

});
