import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { styles } from './styles';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import { Surface } from 'react-native-paper';
import { currencyFormat } from '../../../../../halpers/currencyFormat';
import { appImages, appImagesSvg } from '../../../../../commons/AppImages';
import TransationHistComp from '../../../../../components/TransationHistComp';
import { rootStore } from '../../../../../stores/rootStore';
import { colors } from '../../../../../theme/colors';
import CardWallet from '../../../../../components/CardWallet';
import Tabs from '../../../../../components/Tabs';
import AnimatedLoader from '../../../../../components/AnimatedLoader/AnimatedLoader';
import { Wrapper } from '../../../../../halpers/Wrapper';

let tabs = [
  { text: 'All' },
  { text: 'Deposits' },
  { text: 'Duuitt Credits' },
  // {text: 'Reward Coins'},
];
let defaultType = 'All';
let limit = 10;
const DuuIttCredit = ({ navigation }) => {
  const { appUser } = rootStore.commonStore;
  const { getTransactionHistory, transactionList, welletBalance } =
    rootStore.dashboardStore;
  const [loading, setLoading] = useState(
    transactionList?.length > 0 ? false : true,
  );
  const [transactionData, setTransactionData] = useState(transactionList ?? []);
  const [transactionFilter, setTransactionFilter] = useState(
    transactionList ?? [],
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [type, setType] = useState('All');
  const [walletData, setWalletData] = useState(welletBalance ?? {});

  console.log('appUser==', appUser);

  useFocusEffect(
    useCallback(() => {
      limit = 10;
      handleAndroidBackButton(navigation);
      defaultType = 'All';
      getTransactionData();
      if (Object?.keys(welletBalance)?.length < 0) {
        getWalletData();
      }
    }, []),
  );

  let transationHistory = [
    {
      id: '0',
      name: 'Wesley Mcclaflin',
      image: appImages.avtarImage,
      date: new Date(),
      price: 300,
    },
    {
      id: '1',
      name: 'Wesley Mcclaflin',
      image: appImages.avtarImage,
      date: new Date(),
      price: 200,
    },
  ];

  const getWalletData = async () => {
    const res = await getWallet(appUser, handleWalletLoading);
    console.log('res--getWalletData', res);
    setWalletData(res);
  };
  // console.log('res--walletData', walletData);

  const handleWalletLoading = v => {
    console.log('v----', v);
  };

  const getTransactionData = async () => {
    const res = await getTransactionHistory(
      appUser,
      limit,
      defaultType,
      handleLoading,
    );
    console.log('res--getTransactionData', res);
    setTransactionData(res);
    setTransactionFilter(res);
    setLoadingMore(false);
  };
  console.log('res--transactionData', transactionData);

  const handleLoading = v => {
    setLoading(v);
  };

  const loadMoredata = () => {
    console.log('load more');
    if (!loadingMore && transactionData?.length >= limit) {
      limit = limit + 20;
      setLoadingMore(true);
      getTransactionData();
    }
  };

  const renderFooter = () => {
    return loadingMore ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    ) : null;
  };

  const renderItem = ({ item, i }) => {
    return (
      <>
        <CardWallet item={item} index={i} />
      </>
    );
  };
  const handleTabPress = async text => {
    defaultType = text;
    setType(text);
    let filteredArray = [];
    if (text == 'Deposits') {
      filteredArray = transactionFilter?.filter(
        item => item?.status === 'deposits',
      );
    } else if (text == 'Duuitt Credits') {
      filteredArray = transactionFilter?.filter(
        item => item?.status === 'duuitt_credits',
      );
    } else {
      filteredArray = transactionFilter;
    }
    setTransactionData(filteredArray);
  };

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      backArrow={true}
      title={'DuuItt Credit'}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.main}>
        {/* <Header
        backArrow={true}
        title={'DuuItt Credit'}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        {loading == true ? (
          <AnimatedLoader type={'transactionHistoryLoader'} />
        ) : (
          <>
            <View style={styles.upperMainView}>
              <Surface elevation={2} style={styles.surfaceView}>
                <View style={styles.surfaceInnerView}>
                  <Text style={styles.valurText}>
                    {currencyFormat(walletData?.duuitt_credits ?? 0)}
                  </Text>
                  <Text style={styles.totalText}>{'Total Balance'}</Text>
                </View>
              </Surface>
              <View>
                {/* <View style={styles.transationHistView}>
                            <Text style={styles.transationHistText}>Transaction History</Text>
                        </View>{transationHistory?.map((data, index) => {
                            return (
                         <TransationHistComp data={data} index={index} />

                            )
                        })} */}

                <View style={{ marginHorizontal: 20, marginTop: '2%' }}>
                  <Tabs
                    imageHide={true}
                    tabs={tabs}
                    tabPress={handleTabPress}
                    type={type}
                  />
                </View>
                <View style={{ marginTop: '-2%' }}>
                  {transactionData?.length > 0 ? (
                    <FlatList
                      contentContainerStyle={{ paddingBottom: '10%' }}
                      showsVerticalScrollIndicator={false}
                      data={transactionData}
                      renderItem={renderItem}
                      keyExtractor={item => item?.payment_id}
                      onEndReached={loadMoredata}
                      onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% from the bottom
                      ListFooterComponent={renderFooter}
                    />
                  ) : (
                    <View style={styles.noDataView}>
                      <Text style={styles.naDataText}>No Data Found</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </>)}
      </View>
    </Wrapper>
  );
};

export default DuuIttCredit;
