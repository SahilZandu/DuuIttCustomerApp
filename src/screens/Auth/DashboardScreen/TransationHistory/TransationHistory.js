import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import CardWallet from '../../../../components/CardWallet';
import { rootStore } from '../../../../stores/rootStore';
import { wallet } from '../../../../stores/DummyData/wallet';
import Header from '../../../../components/header/Header';
import Tabs from '../../../../components/Tabs';
import { colors } from '../../../../theme/colors';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';
import { Wrapper } from '../../../../halpers/Wrapper';

let tabs = [
  { text: 'All' },
  { text: 'Deposits' },
  { text: 'Duuitt Credits' },
  // {text: 'Reward Coins'},
];
let defaultType = 'All';
let limit = 10;
export default function TransactionHistory({ navigation }) {
  const { appUser } = rootStore.commonStore;
  const { getTransactionHistory, transactionList } = rootStore.dashboardStore;
  const [loading, setLoading] = useState(
    transactionList?.length > 0 ? false : true,
  );
  const [transactionData, setTransactionData] = useState(transactionList ?? []);
  const [transactionFilter, setTransactionFilter] = useState(
    transactionList ?? [],
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [type, setType] = useState('All');

  console.log('appUser==', appUser);

  useFocusEffect(
    useCallback(() => {
      limit = 10;
      handleAndroidBackButton(navigation);
      defaultType = 'All';
      getTransactionData();
    }, []),
  );

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
      bottomLine={true}
      onPress={() => {
        navigation.goBack();
      }}
      title={'Transition History'}
      backArrow={true}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
        bottomLine={true}
        onPress={() => {
          navigation.goBack();
        }}
        title={'Transition History'}
        backArrow={true}
      /> */}

        {loading == true ? (
          <AnimatedLoader type={'transactionHistoryLoader'} />
        ) : (
          <>
            <View style={{ marginHorizontal: 20 }}>
              <Tabs
                imageHide={true}
                tabs={tabs}
                tabPress={handleTabPress}
                type={type}
              />
            </View>
            <View style={{ flex: 1 }}>
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
          </>
        )}
      </View>
    </Wrapper>
  );
}
