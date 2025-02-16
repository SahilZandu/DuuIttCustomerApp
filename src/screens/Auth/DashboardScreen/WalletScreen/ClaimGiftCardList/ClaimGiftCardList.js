import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    Image,
} from 'react-native';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import { styles } from './styles';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ClaimGiftCards from '../../../../../components/ClaimGiftCards';
import ModalPopUpTouch from '../../../../../components/ModalPopUpTouch';
import BTN from '../../../../../components/cta/BTN';
import DotTextComp from '../../../../../components/DotTextComp';
import { colors } from '../../../../../theme/colors';
import {
    giftCardsArray,
    giftImageArray,
} from '../../../../../stores/DummyData/Offers';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';

const ClaimGiftCardList = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [giftItems, setGiftItems] = useState(giftImageArray);
    const [giftSelectImage, setGiftSelectedImage] = useState({});
    const [claimGiftArray, setClaimGiftArray] = useState(giftCardsArray);
    const [isViewDetails, setIsViewDetails] = useState(false);
    const [claimGiftItem, setClaimGiftItem] = useState({});

    useFocusEffect(
        useCallback(() => {
            onHandleGiftImage(0);
            handleAndroidBackButton(navigation);
        }, []),
    );

    let claimDetails = [
        {
            id: 1,
            title: 'Have a great day full of happiness!',
            amount: 0,
        },
        {
            id: 2,
            title: 'Gift card amount',
            amount: 2000,
        },

        {
            id: 3,
            title: 'This amount is directly enter in your wallet',
            amount: 0,
        },

    ];



    const onHandleGiftImage = async index => {
        const res = await giftItems?.filter((item, i) => {
            return i == index;
        });
        // console.log("res--filter",res[0]);
        setGiftSelectedImage(res[0]);
    };


    const onViewDetails = item => {
        setClaimGiftItem(item);
        setIsViewDetails(true);
    };

    return (
            <View style={styles.container}>
                <Header
                    backArrow={true}
                    title={'Claim Gift Cards'}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <AppInputScroll
                    Pb={'25%'}
                    padding={true}
                    keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.main}>
                        <View style={styles.claimContainerView}>
                            {claimGiftArray?.length > 0 ? (
                                <View style={styles.mapRenderView}>
                                    {claimGiftArray?.map((item, index) => {
                                        return (
                                            <ClaimGiftCards
                                                item={item}
                                                index={index}
                                                onViewPress={onViewDetails}
                                            />
                                        );
                                    })}
                                </View>
                            ) : (
                                <View style={styles.noDataView}>
                                    <Text style={styles.noDataText}>
                                        No Gift Cards Available
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </AppInputScroll>
                <ModalPopUpTouch
                    isVisible={isViewDetails}
                    onOuterClose={() => {
                        setIsViewDetails(false);
                    }}>
                    <View style={styles.modalMainView}>
                        <Image style={styles.modalImage} source={claimGiftItem?.image} />

                        <View style={styles.modalInnerView}>
                            <View style={styles.textView}>
                                <Text style={styles.giftCardDetails}>Gift Card Details</Text>
                                {claimDetails?.map((item, i) => {
                                    return (
                                        <View style={{ marginHorizontal: -10 }}>
                                            <DotTextComp
                                                title={item?.title}
                                                index={i}
                                                data={claimDetails}
                                                amount={item?.amount}
                                            />
                                        </View>
                                    );
                                })}

                                <View style={styles.btnView}>
                                    <BTN
                                        backgroundColor={colors.white}
                                        labelColor={colors.bottomBarColor}
                                        width={wp('42')}
                                        title={'QR code'}
                                        textTransform={'capitalize'}
                                        onPress={() => {
                                            setIsViewDetails(false);
                                            navigation.navigate('claimGiftQRCode', {
                                                item: claimGiftItem,
                                            });
                                        }}
                                    />
                                    <BTN
                                        width={wp('42')}
                                        title={'Claim'}
                                        textTransform={'capitalize'}
                                        onPress={() => {
                                            setIsViewDetails(false);
                                            navigation.navigate('claimGiftCard', {
                                                item: claimGiftItem,
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ModalPopUpTouch>
            </View>
    );
};

export default ClaimGiftCardList;
