import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { SvgXml } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import DeleteActions from './DeleteActions';
import CTA from '../cta/CTA';
import LogoutActions from './LogoutActions';
import { fonts } from '../../theme/fonts/fonts';
import { appImagesSvg } from '../../commons/AppImages';
import Spacer from '../../halpers/Spacer';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../theme/colors';

const PopUpInProgess = ({topIcon,crossIcon, visible, onDelete, type, text, title, onClose, CTATitle }) => {
    const getIconXml = () => {
        if (type == 'warning') {
            return appImagesSvg?.popUpwarning;
        } else if (type == 'logout') {
            return appImagesSvg?.logoutSvg;
        } else if (type == 'continue') {
            return appImagesSvg?.logoutSvg;
        } else {
            return appImagesSvg?.popUpDelete;
        }
    };

    const PopUpIcon = () => {
        return (
            <View
                style={[
                    styles.iconView,
                    {
                        backgroundColor:
                            type == 'delete' || type == 'logout' || type == 'continue'
                                ? colors.colorCB
                                : type == 'warning'
                                    ? 'rgba(254, 240, 199, 1)'
                                    : colors.darkGreen,
                    },
                ]}>
                <SvgXml xml={getIconXml()} />
            </View>
        );
    };

    const CloseBtn = () => {
        return (
            <Pressable onPress={onClose} style={styles.cancelBTNPress}>
                <SvgXml xml={appImagesSvg?.popUpclose} />
            </Pressable>
        );
    };

    return (
        <Modal isVisible={visible}>
            <View style={styles.mainView}>
                <View style={styles.subView}>
                    {topIcon &&  <PopUpIcon />}
                    {crossIcon && <CloseBtn />}
                    <Text style={styles.titleText}>
                        {title ? title : 'You are about to delete an item'}
                    </Text>
                    <Text style={styles.textSecond}>{text}</Text>
                    <Spacer space={hp('4%')} />
                    <CTA width={wp('60%')}
                        onPress={onClose}
                        height={hp('4.5%')}
                        title={CTATitle}
                        textTransform={'capitalize'} />
                </View>
            </View>
        </Modal>
    );
};

export default PopUpInProgess;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subView: {
        backgroundColor: colors.white,
        paddingHorizontal: '5%',
        paddingBottom: '5%',
        width: '85%',
        borderRadius: 15,
    },
    cancelBTNPress: {
        backgroundColor: 'rgba(203, 47, 47, 0.15)',
        height: 28,
        width: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        position: 'absolute',
        right: 15,
        top: 10,
    },
    titleText: {
        fontFamily: fonts.bold,
        fontSize: RFValue(13),
        textAlign: 'center',
        paddingVertical: '5%',
    },
    textSecond: {
        fontFamily: fonts.regular,
        fontSize: RFValue(11),
        textAlign: 'center',
        color: colors.color8F,
    },
    iconView: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: -20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
