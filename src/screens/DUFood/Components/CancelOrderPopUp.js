import React, { useState } from 'react';
import {
    View,
    Modal,
    Pressable,
    Text,
    ScrollView,
    Platform,
    StyleSheet,
    Image,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { fonts } from '../../../theme/fonts/fonts';
import { appImages, appImagesSvg } from '../../../commons/AppImages';
import DotedLine from './DotedLine';
import { currencyFormat } from '../../../halpers/currencyFormat';
import { colors } from '../../../theme/colors';
import TextRender from '../../../components/TextRender';
import BTN from '../../../components/cta/BTN';
import Spacer from '../../../halpers/Spacer';
import { FastField } from 'formik';
import { useTheme } from 'react-native-paper';
import { rootStore } from '../../../stores/rootStore';

const CancelOrderPopUp = ({ visible, item, onClose, refershData }) => {

    const [loading, setLoading] = useState(false)
    const { cancelFoodOrderCustomer } = rootStore.foodDashboardStore;



    const onCancelFoodOrder = async () => {
        await cancelFoodOrderCustomer(item, handleLoading, onSuccess, onError)
    }

    const handleLoading = (v) => {
        setLoading(v)
    }

    const onSuccess = () => {
        onClose();
        refershData()
    }

    const onError = () => {
        onClose();
    }


    const CancelDetails = [
        {
            id: '1',
            name: 'Order Amount',
            price: item?.total_amount,
            cancelletionPrice: 0,
            showCancel: false,
            bottomLine: false,
        },
        {
            id: '2',
            name: 'Cancellation Charge',
            price: item?.total_amount,
            cancelletionPrice: 0,
            showCancel: item?.status === "waiting_for_confirmation" ? true : false,
            bottomLine: false,
        },
    ];

    const onCancelOrder = () => {
        onCancelFoodOrder()
        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false)
        //     onClose();
        // }, 3000)

    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onClose();
            }}>
            <Pressable
                //  onPress={() => onClose()}
                style={styles.container}>
                <Pressable
                    disabled={loading}
                    onPress={() => onClose()}
                    style={styles.backButtonTouch}>
                    <Image
                        resizeMode="contain"
                        style={{ height: 45, width: 45 }}
                        source={appImages.crossClose} // Your icon image
                    />
                </Pressable>
                <View style={styles.mainWhiteView}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: '10%' }}>
                        <View style={styles.scrollInnerView}>
                            <Text
                                numberOfLines={1}
                                style={styles.cancelOrderText}>
                                Cancel Order Deatils
                            </Text>
                            {CancelDetails?.map((data, i) => {
                                return (
                                    <View style={styles.billDetailRenderView}>
                                        <TextRender
                                            titleStyle={[
                                                styles.titleText,
                                                {
                                                    color:
                                                        data?.coupanCode?.length > 0
                                                            ? colors.main
                                                            : colors.color64,
                                                },
                                            ]}
                                            valueStyle={[
                                                styles.valueText,
                                                {
                                                    color:
                                                        data?.coupanCode?.length > 0
                                                            ? colors.main
                                                            : colors.color64,
                                                    textDecorationLine: (item?.status === "waiting_for_confirmation" && data?.name == "Cancellation Charge") ? 'line-through' : 'auto',
                                                },
                                            ]}
                                            valueCancelStyle={styles.valueText}
                                            title={
                                                data?.coupanCode?.length > 0
                                                    ? data?.name + '- (' + data?.coupanCode + ')'
                                                    : data?.name
                                            }
                                            value={currencyFormat(Number(data?.price))}
                                            valueCancelletion={currencyFormat(Number(data?.cancelletionPrice))}
                                            showCancel={data?.showCancel}
                                            bottomLine={false}
                                        />
                                        {data?.bottomLine && <DotedLine />}
                                    </View>
                                );
                            })}
                            <Spacer space={hp('8%')} />
                            <BTN
                                loading={loading}
                                onPress={() => {
                                    onCancelOrder()
                                }}
                                textTransform={'auto'}
                                title={item?.status === "waiting_for_confirmation" ? 'Cancel with full refund' : "Cancel with no refund"} />
                        </View>
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
};

export default CancelOrderPopUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },

    backButtonTouch: {
        alignItems: 'center',
        zIndex: 1,
        alignSelf: 'center',
        marginBottom: '3%',
    },
    mainWhiteView: {
        backgroundColor: colors.white,
        height: hp('35%'),
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        borderColor: colors.colorF9,
        paddingTop: '3%',
    },
    scrollInnerView: {
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    cancelOrderText: {
        fontFamily: fonts.bold,
        fontSize: RFValue(15),
        color: colors.black,
        marginTop: '2%',
        alignSelf: 'center'
    },
    billDetailRenderView: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginTop:'1%'
    },
    titleText: {
        fontFamily: fonts.medium,
        fontSize: RFValue(13),
        color: colors.color64,
    },
    valueText: {
        fontFamily: fonts.medium,
        fontSize: RFValue(14),
        color: colors.color64,
    },
    btnView: {
        paddingHorizontal: 16,
        marginTop: '5%',
        borderRadius: 10,
        height: hp('5.5%'),
        backgroundColor: colors.colorD6,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btnText: {
        fontFamily: fonts.medium,
        fontSize: RFValue(13),
        marginLeft: '3%',
        color: colors.main,
    },
});
