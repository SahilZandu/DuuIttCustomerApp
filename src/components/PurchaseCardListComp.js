import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { fonts } from '../theme/fonts/fonts';
import { appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';
import { Surface } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BTN from './cta/BTN';
import moment from 'moment';
import { currencyFormat } from '../halpers/currencyFormat';

const PurcahseGiftCardListComp = ({ item, index, onOderDetails, onReorder }) => {

    const dateFormate = () => {
        const formattedDate = moment().format('MMM D, YYYY - hh:mm A');
        // console.log(formattedDate);
        return formattedDate
    }

    return (
        <Surface elevation={2} style={styles.container}>
            <View style={styles.upperMainView}>
                <Image
                    resizeMode='stretch'
                    style={styles.image}
                    source={item?.image} />
                <View style={styles.textMainView}>
                    <Text style={styles.orderIdText}>Order ID:{item?.orderId}</Text>
                    <Text style={styles.orderDateText}>{dateFormate(item?.date)}</Text>
                    <View style={styles.statusPriceView}>
                        <Text style={[styles.statusText, { color: item?.status == 'Purchased' ? colors.main : colors.redBold }]}>{item?.status}</Text>
                        <Text style={styles.priceText}>{currencyFormat(Number(item?.price))}</Text>
                    </View>
                </View>
            </View>
            <View
                style={styles.bottomBtnView}>
                <BTN
                    backgroundColor={colors.white}
                    labelColor={colors.main}
                    width={wp('38%')}
                    title={'Order Details'}
                    onPress={() => { onOderDetails(item) }}
                    bottomCheck={15}
                    textTransform={'capitalize'}
                />

                <BTN
                    width={wp('38%')}
                    title={'Reorder'}
                    onPress={onReorder}
                    bottomCheck={15}
                    textTransform={'capitalize'}
                />
            </View>
        </Surface>
    );
};

export default PurcahseGiftCardListComp;

const styles = StyleSheet.create({
    container: {
        shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
        backgroundColor: colors.white,
        borderRadius: 10,
        height: hp('22%'),
        width: wp('90%'),
        marginTop: '5%'
    },
    upperMainView: {
        flexDirection: 'row',
        marginHorizontal: 12,
        paddingVertical: 15,
    },
    image: {
        height: hp('10%'), width: wp('22%'), borderRadius: 10
    },
    textMainView: {
        flex: 1, marginLeft: 10, justifyContent: 'center'
    },
    orderIdText: {
        fontSize: RFValue(15), fontFamily: fonts.medium, color: colors.black
    },
    orderDateText: {
        fontSize: RFValue(13), fontFamily: fonts.medium, color: colors.color83, marginTop: '4%'
    },
    statusPriceView: {
        flexDirection: 'row', marginTop: '4%', justifyContent: 'center'
    },
    statusText: {
        flex: 1, fontSize: RFValue(13), fontFamily: fonts.medium, color: colors.main
    },
    priceText: {
        fontSize: RFValue(13), fontFamily: fonts.medium, color: colors.color83
    },
    bottomBtnView: {
        flexDirection: 'row',
        marginTop: '7%',
        justifyContent: 'space-between',
        marginHorizontal: 15
    }



});
