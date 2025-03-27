import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {styles} from './styles';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import {useFocusEffect} from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import {colors} from '../../../../../theme/colors';
import {Surface} from 'react-native-paper';
import {currencyFormat} from '../../../../../halpers/currencyFormat';
import Tabs from '../../../../../components/Tabs';
import {appImages, appImagesSvg} from '../../../../../commons/AppImages';
import TouchTextRightIconComp from '../../../../../components/TouchTextRightIconComp';
import TransationHistComp from '../../../../../components/TransationHistComp';
import AddMoneyCoinComp from '../../../../../components/AddMoneyCoinComp';
import Spacer from '../../../../../halpers/Spacer';
import TabTextIcon from '../../../../../components/TabTextIcon';
import ReviewsRatingComp from '../../../../../components/ReviewsRatingComp';
import { SvgXml } from 'react-native-svg';
import { rootStore } from '../../../../../stores/rootStore';
import { usePayment } from '../../../../../halpers/usePayment';
import AnimatedLoader from '../../../../../components/AnimatedLoader/AnimatedLoader';

let tabs = [
  {text: 'All'},
  {text: 'Deposits'},
  {text: 'Duuitt Credits'},
  {text: 'Reward Coins'},
];
let defaultType = 'All';

let defaultValue =""

const Wallet = ({navigation}) => {
  const {getWallet,welletBalance,addWalletBalance }=rootStore.dashboardStore
  const {appUser}=rootStore.commonStore
  const [type, setType] = useState('All');
  const [value, setValue] = useState('');
  const [addMoney, setAddMoney] = useState(false);
  const [walletData,setWalletData]=useState(welletBalance ??{})
  const [loading ,setLoading]=useState(false)
  const [loadingWallet ,setLoadingWallet]=useState(walletData?.balance > 0 ? false :true)

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      getWalletData()
    }, []),
  );

  const getWalletData = async () => {
    const res = await getWallet(appUser, handleWalletLoading);
    console.log('res--getWalletData', res);
    setWalletData(res);
  };
  // console.log('res--walletData', walletData);
 const handleWalletLoading =(v)=>{
  setLoadingWallet(v)
 }
 

  const handleLoading = v => {
    setLoading(v);
  };

  const onAdd = (amount) => {
    setLoading(true);
    let data = {topay: Number(value)};

    console.log("data---value",data,value,amount);
    usePayment(data, onSuccess, onError);
    setTimeout(()=>{
      setLoading(false);
    },1000)
  };
  console.log("value---",value);

  const onSuccess = async data => {
    console.log('onSuccess---', data);
    setAddMoney(prev => !prev);
    setLoading(false);
    defaultValue = '';
    let paymentId = data?.razorpay_payment_id;
    await addWalletBalance(
      appUser,
      Number(value),
      paymentId,
      'deposits',
      handleLoading,
      onHandleScuuess,
    );
  };

  const onError = () => {
    setAddMoney(prev => !prev);
    setValue('');
    defaultValue = '';
    setLoading(false);
    console.log('error');
  };

  const onHandleScuuess = () => {
    setValue('');
    getWalletData();
  };

  let coinsArray = [
    {
      name: 'Deposits',
      price: 150.5,
      onPress: () => {
        navigation.navigate('duuIttCredit');
      },
    },
    {
      name: 'Duuitt Credites',
      price: 50.0,
      onPress: () => {
        navigation.navigate('duuIttCredit');
      },
    },
    {
      name: 'Reward Coins',
      price: 250.5,
      onPress: () => {
        navigation.navigate('duuIttCredit');
      },
    },
  ];

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
  ];

  const giftCardOptions = [
    {
      title: 'Buy Gift Card',
      onPress: () => {
        navigation.navigate('giftCard');
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
    {
      title: 'Claim a Gift Card',
      onPress: () => {
        navigation.navigate('claimGiftCardList');
      },
      icon: appImagesSvg.myFavorate,
      show: true,
      disable: false,
    },
    {
      title: 'Purchase History',
      onPress: () => {
        navigation.navigate('giftCardPurcahseList');
      },
      icon: appImagesSvg.myFavorate,
      show: true,
      disable: false,
    },
  ];
  const tabsRate = [
    {text: '100'},
    {text: '200'},
    {text: '500'},
    {text: '1000'},
    {text: '2000'},
  ];

  const handleTabPress = async text => {
    defaultType = text;
    setType(text);
    // const filter = await getOrderHistorybyFilters(text);
    // //  console.log('filter--', filter, defaultType, text);
    // setOrderList(filter);
  };
  const handleTabRatePress = async text => {
    setValue(text);
  };

  const handleAddMoneyToggle = useCallback(item => {
    console.log('item----', item);
    if (item === 'Add') {
        onAdd(value)
    } else {
      setAddMoney(prev => !prev);
    }
  }, [value]);


  return (
    <View style={styles.main}>
      <Header
        backArrow={true}
        title={'Wallet'}
        onPress={() => {
          navigation.goBack();
        }}
      />
       {loadingWallet == true  ? (
        <AnimatedLoader type={'walletLoader'} />
      ) : (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AppInputScroll
          Pb={'25%'}
          padding={true}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.upperMainView}>
            <Surface elevation={2} style={styles.walletSurfaceView}>
              <View style={styles.innerViewWallet}>
                <View style={styles.walletTotalBalView}>
                  <Text style={styles.totalBalValue}>
                    {currencyFormat(walletData?.balance ?? 0)}
                  </Text>
                  <Text style={styles.totalBalText}>Total Balance</Text>
                  <View style={styles.bottomLine} />
                </View>
                <AddMoneyCoinComp
                loading={loading}
                  item={{
                    name: 'Deposits',
                    price: Number(walletData?.deposits ?? 0),
                  }}
                  // onPressTouch={()}
                  bottomLine={!addMoney}
                  onAddMoney={item => {
                    handleAddMoneyToggle(item);
                  }}
                  addBtn={addMoney}
                  value={value}
                />
                {addMoney && (
                  <View style={styles.addMoneyInnerView}>
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
                        onChangeText={(text) =>(setValue(text))}
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
                  </View>
                )}
                <AddMoneyCoinComp
                  item={{
                    name: 'Duuitt Credites',
                    price: Number(walletData?.duuitt_credits ?? 0),
                  }}
                  bottomLine={true}
                  onPressTouch={() => {
                    navigation.navigate('duuIttCredit');
                  }}
                />

                {!addMoney && (
                  <AddMoneyCoinComp
                    item={{
                      name: 'Reward Stars Coins',
                      price: 150,
                    }}
                    onPressTouch={() => {
                      navigation.navigate('rewardsStars');
                    }}
                    bottomLine={true}
                  />
                )}

                <TouchableOpacity
                onPress={()=>{navigation.navigate('transactionHistory')}}
                  style={styles.transationHistTouch}>
                  <Text style={styles.viewTransationHistText}> View Transaction History</Text>
                  <SvgXml style={{marginLeft:'1%'}} xml={appImagesSvg.greenArrowIcon} />
                </TouchableOpacity>
              </View>
            </Surface>
            {/* <View>
              <View style={styles.transationHistView}>
                <Text style={styles.transationHistText}>
                  Transaction History
                </Text>
                <Tabs
                  imageHide={true}
                  tabs={tabs}
                  tabPress={handleTabPress}
                  type={type}
                />
              </View>
              <View style={{marginTop: '-2%'}}>
                {transationHistory?.map((data, index) => {
                  return <TransationHistComp data={data} index={index} />;
                })}
              </View>
            </View> */}

            <View>
              <Text style={styles.giftCartText}>Gift Cards</Text>
              <Surface elevation={2} style={styles.giftCardSurfaceView}>
                <TouchTextRightIconComp
                  firstIcon={false}
                  data={giftCardOptions}
                />
              </Surface>
            </View>
          </View>
        </AppInputScroll>
      </KeyboardAvoidingView>)}
    </View>
  );
};

export default Wallet;
