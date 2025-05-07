import { StyleSheet } from 'react-native';
import { fonts } from '../../../theme/fonts/fonts';
import { colors } from '../../../theme/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.appBackground,
    },
    loaderView: {
        height: hp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    webMainView: {
        flex: 1, justifyContent: 'center'
    }

});
