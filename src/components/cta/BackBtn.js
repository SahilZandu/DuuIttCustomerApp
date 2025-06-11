import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../../commons/AppImages';

const BackBtn = ({ onPress, mainStyle }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.backBtnView, { mainStyle }]}>
        <SvgXml
            xml={appImagesSvg.whitebackArrow}
        />
    </TouchableOpacity>

);

export default BackBtn;


const styles = StyleSheet.create({
    backBtnView: {
        position: 'absolute',
        backgroundColor: colors.black,
        top: '3%',
        left: '5%',
        padding: '1%',
        borderRadius: 10,
    },
})





