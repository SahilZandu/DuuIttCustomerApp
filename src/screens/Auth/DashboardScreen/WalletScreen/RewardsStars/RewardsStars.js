import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import { styles } from './styles';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import { colors } from '../../../../../theme/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../../../theme/fonts/fonts';
import { appImages, appImagesSvg } from '../../../../../commons/AppImages';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';


const RewardsStars = ({ navigation }) => {

    useFocusEffect(
        useCallback(() => {
            handleAndroidBackButton(navigation)
        }, [])
    )

    let rewardStarList = [
        {
            id: '1',
            status: 'available',
            availableCount: 4,
            usedCount: 0,
            type: 'order',
            price: 5,
            completedText: "",

        },
        {
            id: '2',
            status: 'not_available',
            availableCount: 4,
            usedCount: 4,
            type: 'ride',
            price: 5,
            completedText: "",
        },
        {
            id: '3',
            status: 'completed',
            availableCount: 4,
            usedCount: 4,
            type: 'order',
            price: 5,
            completedText: "First",
        },
        {
            id: '4',
            status: 'available',
            availableCount: 4,
            usedCount: 2,
            type: 'parcel',
            price: 5,
            completedText: "",
        },
        {
            id: '5',
            status: 'completed',
            availableCount: 4,
            usedCount: 4,
            type: 'ride',
            price: 5,
            completedText: "",
        },
        {
            id: '6',
            status: 'not_available',
            availableCount: 4,
            usedCount: 4,
            type: 'parcel',
            price: 5,
            completedText: "",
        },


    ]

    const RenderItem = ({ item, index }) => {
        return (
            <View style={{
                height: hp('10%'),
                width: wp("90%"),
                backgroundColor: colors.white, borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
                borderWidth: 1,
                borderColor: item?.status == 'not_available' ?
                 colors.grey : colors.main,
                borderRadius: 10,
                marginTop: '5%'
            }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text numberOfLines={2}
                            style={{ fontSize: RFValue(11), fontFamily: fonts.medium, color: colors.color83 }}>
                            Complete your{" "}
                            {item?.status == "completed" ?
                                item?.completedText?.length > 0 ?
                                    item?.completedText + " " + " " + item?.type
                                    : item?.type
                                : `${item?.availableCount}${' '}${item?.type}${' '}(${item?.usedCount}/${item?.availableCount})`}
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1, borderRadius: 20,
                            borderColor: item?.status == 'not_available' ? colors.grey : colors.main,
                            alignSelf: 'flex-start',
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                            marginTop: '5%'
                        }}>
                            <Image
                                style={{ width: 14, height: 14 }}
                                source={item?.status == 'not_available' ?
                                    appImages.ruppeGreyIcon
                                    : appImages.ruppeYellowIcon} />
                            <Text style={{
                                fontSize: RFValue(10),
                                fontFamily: fonts.medium,
                                color: item?.status == 'not_available' ? colors.grey : colors.main,
                                marginLeft: '2%'
                            }}>{item?.price}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        disabled={item?.status == "available" ? false : true}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: item?.status == "completed" ?
                                "transparent" : item?.status == 'not_available' ?
                                    colors.grey : colors.main,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 20,
                            alignSelf: 'flex-start',
                            paddingVertical: 8,
                            paddingHorizontal: 20,
                            marginTop: '2%'
                        }}>
                        <Text style={{
                            fontSize: RFValue(12),
                            fontFamily: fonts.bold,
                            color: item?.status == "completed" ? colors.main : colors.white
                        }}>{item?.status == "completed" ? "Claimed" : "Claim"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )

    }



    return (
        <View style={styles.main}>
            <Header
                backArrow={true}
                title={'Reward Stars'}
                onPress={() => {
                    navigation.goBack();
                }}
            />
            {/* <AppInputScroll
                Pb={'25%'}
                padding={true} keyboardShouldPersistTaps={'handled'}> */}
            <View style={styles.upperMainView}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={rewardStarList}
                    renderItem={RenderItem}
                    keyExtractor={item => item?.id}
                    contentContainerStyle={{ paddingBottom: '10%' }}
                />

            </View>
            {/* </AppInputScroll> */}
        </View>
    );
};

export default RewardsStars;
