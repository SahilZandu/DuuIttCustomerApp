import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import { styles } from './styles';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import { colors } from '../../../../../theme/colors';
import { Surface } from 'react-native-paper';
import { currencyFormat } from '../../../../../halpers/currencyFormat';
import Tabs from '../../../../../components/Tabs';
import { appImages, appImagesSvg } from '../../../../../commons/AppImages';
import TouchTextRightIconComp from '../../../../../components/TouchTextRightIconComp';
import TransationHistComp from '../../../../../components/TransationHistComp';
import AddMoneyCoinComp from '../../../../../components/AddMoneyCoinComp';
import Spacer from '../../../../../halpers/Spacer';
import TabTextIcon from '../../../../../components/TabTextIcon';


let tabs = [
    { text: 'All' },
    { text: 'Deposits' },
    { text: 'Duuitt Credits' },
    { text: 'Reward Coins' },
];
let defaultType = 'All';
const Wallet = ({ navigation }) => {
    const [type, setType] = useState('All');
    const [value, onChangeText] = useState(0);
    const [addMoney, setAddMoney] = useState(false)

    useFocusEffect(
        useCallback(() => {
            handleAndroidBackButton(navigation)
        }, [])
    )

    let coinsArray = [
        {
            name: 'Deposits',
            price: 150.50,
            onPress: () => {
                navigation.navigate('duuIttCredit');
            },
        },
        {
            name: 'Duuitt Credites',
            price: 50.00,
            onPress: () => {
                navigation.navigate('duuIttCredit');
            },
        },
        {
            name: 'Reward Coins',
            price: 250.50,
            onPress: () => {
                navigation.navigate('duuIttCredit');
            },
        }
    ]

    let transationHistory = [
        {
            name: 'Wesley Mcclaflin',
            image: appImages.avtarImage,
            date: new Date(),
            price: 300,

        },
        {
            name: 'Wesley Mcclaflin',
            image: appImages.avtarImage,
            date: new Date(),
            price: 200,

        },
    ]

    const giftCardOptions = [
        {
            title: 'Buy Gift Card',
            onPress: () => {
                navigation.navigate('giftCard')
            },
            icon: appImagesSvg.orderHistory,
            show: true,
            disable: false,
        },
        {
            title: 'Claim a Gift Card',
            onPress: () => {
                navigation.navigate('claimGiftCardList')
            },
            icon: appImagesSvg.myFavorate,
            show: true,
            disable: false,
        },
        {
            title: 'Purchase History',
            onPress: () => {
                navigation.navigate('giftCardPurcahseList')
            },
            icon: appImagesSvg.myFavorate,
            show: true,
            disable: false,
        },
    ];
    const tabsRate = [
        { text: '100' },
        { text: '200' },
        { text: '500' },
        { text: '1000' },
        { text: '2000' },
    ];

    const handleTabPress = async text => {
        defaultType = text;
        setType(text);
        // const filter = await getOrderHistorybyFilters(text);
        // //  console.log('filter--', filter, defaultType, text);
        // setOrderList(filter);
    };
    const handleTabRatePress = async text => {
        onChangeText(text);
    };

    const handleAddMoneyToggle = useCallback(() => {
        setAddMoney(prev => !prev);
    }, []);

    return (
        <View style={styles.main}>
            <Header
                backArrow={true}
                title={'Wallet'}
                onPress={() => {
                    navigation.goBack();
                }}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <AppInputScroll
                    Pb={'25%'}
                    padding={true} keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.upperMainView}>
                        <Surface elevation={2} style={styles.walletSurfaceView}>
                            <View style={styles.innerViewWallet}>
                                <View style={styles.walletTotalBalView}>
                                    <Text style={styles.totalBalValue}>{currencyFormat(250.50)}</Text>
                                    <Text style={styles.totalBalText}>Total Balance</Text>
                                    <View style={styles.bottomLine} />
                                </View>
                                <AddMoneyCoinComp
                                    item={{
                                        name: 'Deposits',
                                        price: 150.50,
                                    }}
                                    // onPressTouch={()}
                                    bottomLine={!addMoney}
                                    onAddMoney={() => {
                                        handleAddMoneyToggle()
                                    }}
                                    addBtn={addMoney}
                                />
                                {addMoney && <View style={styles.addMoneyInnerView}>
                                    <View style={styles.inputTextView}>
                                        <Text
                                            style={[
                                                styles.rateText,
                                                {
                                                    color:
                                                        value?.length > 0 ? colors.black : colors.color95,
                                                },
                                            ]}>
                                            ₹
                                        </Text>
                                        <TextInput
                                            placeholder="Enter Amount"
                                            keyboardType="numeric"
                                            maxLength={6}
                                            onChangeText={text => onChangeText(text)}
                                            value={value}
                                            style={styles.inputText}
                                        />
                                    </View>
                                    <Spacer space={'1%'} />
                                    <TabTextIcon
                                        isRating={true}
                                        tabs={tabsRate}
                                        tabPress={handleTabRatePress}
                                    />
                                    <View style={styles.bottomLineAddBtn} />
                                </View>}
                                <AddMoneyCoinComp
                                    item={{
                                        name: 'Duuitt Credites',
                                        price: 150.50,
                                    }}
                                    bottomLine
                                    onPressTouch={() => { navigation.navigate('duuIttCredit') }}
                                />

                                {!addMoney && <AddMoneyCoinComp
                                    item={{
                                        name: 'Reward Stars Coins',
                                        price: 150,
                                    }}
                                    onPressTouch={() => { navigation.navigate('rewardsStars') }}
                                />}

                            </View>
                        </Surface>
                        <View>
                            <View style={styles.transationHistView}>
                                <Text style={styles.transationHistText}>Transaction History</Text>
                                <Tabs
                                    imageHide={true}
                                    tabs={tabs}
                                    tabPress={handleTabPress}
                                    type={type}
                                />
                            </View>
                            <View style={{ marginTop: '-2%' }}>
                                {transationHistory?.map((data, index) => {
                                    return (
                                        <TransationHistComp data={data} index={index} />

                                    )
                                })}
                            </View>
                        </View>

                        <View>
                            <Text style={styles.giftCartText}>Gift Cards</Text>
                            <Surface elevation={2} style={styles.giftCardSurfaceView}>
                                <TouchTextRightIconComp
                                    firstIcon={false}
                                    data={giftCardOptions} />
                            </Surface>
                        </View>

                    </View>
                </AppInputScroll>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Wallet;
