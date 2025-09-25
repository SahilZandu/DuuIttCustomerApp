import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  DeviceEventEmitter,
  Platform
} from 'react-native';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CardOrder from '../../../../components/CardOrder';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import Tabs3 from '../../../../components/Tabs3';
import { rootStore } from '../../../../stores/rootStore';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';
import { colors } from '../../../../theme/colors';
import IndicatorLoader from '../../../../halpers/IndicatorLoader';
import { Wrapper4 } from '../../../../halpers/Wrapper4';

const tabs = [
  { text: 'All Orders' },
  { text: 'Ride' },
  { text: 'Parcel' },
  // { text: 'Food' },
];

let defaultType = 'All Orders';
let perPage = 20;

export default function Orders({ navigation, route }) {
  const { tabText } = route.params;
  const flatListRef = useRef(null);
  const { parcelsOfUser, getOrderHistorybyFilters, orderHistoryList } =
    rootStore.orderStore;
  const { appUser } = rootStore.commonStore;
  const { getCheckDeviceId } = rootStore.dashboardStore;
  const [orderList, setOrderList] = useState(
    (tabText === "All Orders") ?
      orderHistoryList : []);
  const [type, setType] = useState('All Orders');
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(
    (orderHistoryList?.length > 0
      && tabText === "All Orders")
      ? false : true,
  );
  const [internet, setInternet] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false)

  // console.log('tabText--', tabText,defaultType);

  // useEffect(() => {
  //   setLoading(
  //     (orderHistoryList?.length > 0
  //       && tabText === "All Orders")
  //       ? false : true)
  //   if (tabText == 'Food') {
  //     defaultType = 'Food';
  //     setType('Food');
  //     // setOrderList([])
  //     getOrderList();
  //   } else if (tabText == 'Ride') {
  //     defaultType = 'Ride';
  //     setType('Ride');
  //     // setOrderList([])
  //     getOrderList();
  //   } else if (tabText == 'Parcel') {
  //     defaultType = 'Parcel';
  //     setType('Parcel');
  //     // setOrderList([])
  //     getOrderList();
  //   } else {
  //     defaultType = 'All Orders';
  //     setType('All Orders');
  //     setOrderList(orderHistoryList || [])
  //     getOrderList();
  //   }
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 15000);

  // }, [tabText])

  useFocusEffect(
    useCallback(() => {
      // getCheckFilterData();
      getCheckDevice();
      checkInternet();
      handleAndroidBackButton(navigation, tabText);
      if (orderHistoryList?.length == 0) {
        getOrderList();
        setTimeout(() => {
          setLoading(false);
        }, 15000);
      }
    }, [tabText]),
  );

  useEffect(() => {
    getCheckFilterData();
  }, [tabText])

  const getCheckFilterData = () => {
    setLoading(
      (orderHistoryList?.length > 0
        && tabText === "All Orders")
        ? false : true)
    if (tabText == 'Food') {
      defaultType = 'Food';
      setType('Food');
      getOrderList();
    } else if (tabText == 'Ride') {
      defaultType = 'Ride';
      setType('Ride');
      getOrderList();
    } else if (tabText == 'Parcel') {
      defaultType = 'Parcel';
      setType('Parcel');
      getOrderList();
    } else {
      defaultType = 'All Orders';
      setType('All Orders');
      setOrderList(orderHistoryList || [])
      getOrderList();
    }
    setTimeout(() => {
      setLoading(false);
    }, 15000);

  }


  const getCheckDevice = async () => {
    await getCheckDeviceId();
  }

  useEffect(() => {
    DeviceEventEmitter.addListener('tab3', event => {
      if (event != 'noInternet') {
      }
      setInternet(event == 'noInternet' ? false : true);
      console.log('internet event');
    });
  }, []);

  const checkInternet = () => {
    fetch().then(state => {
      setInternet(state.isInternetReachable);
    });
  };

  const getOrderList = async () => {
    const res = await parcelsOfUser(defaultType, perPage, handleLoading);
    console.log('res---parcelsOfUser', res);
    if (res?.length > 0) {
      setOrderList(res);
      setLoadingMore(false);
      // setTimeout(() => {
      //   handleTabPress(defaultType);
      // }, 1000)

    } else {
      // setTimeout(() => {
      //   handleTabPress(defaultType);
      // }, 1000)
      setOrderList([]);
      setLoadingMore(false);
    }
  };



  const getMoreOrderList = async () => {
    const res = await parcelsOfUser(defaultType, perPage, handleLoading);
    console.log('res---parcelsOfUser', res);
    if (res?.length > 0) {
      setOrderList(res);
      setLoadingMore(false);
    } else {
      setOrderList([]);
      setLoadingMore(false);
    }
  };

  const handleLoading = v => {
    if (v == false) {
      setLoading(v);
      setFilterLoading(false)
      // setTimeout(() => {
      //   setLoading(v);
      // }, 8000)
    } else {
      setLoading(v);
    }

  };

  const loadMoredata = () => {
    console.log('load more');
    if (!loadingMore && (orderList?.length >= perPage
      // || tabText !== "All Orders"
    )) {
      perPage = perPage + 20;
      setLoadingMore(true);
      getMoreOrderList();
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
        <CardOrder item={item} index={i}
          navigation={navigation}
          handleDetails={(item) => {navigation.navigate('orderDetails', { item: item }) }} />
      </>
    );
  };

  const handleTabPress = async text => {
    defaultType = text;
    setType(text);
    if (flatListRef?.current) {
      flatListRef?.current?.scrollToIndex({ animated: true, index: 0 });
    } setFilterLoading(true)
    getOrderList();
    // const filter = await getOrderHistorybyFilters(text);
    // //  console.log('filter--', filter, defaultType, text);
    // setOrderList(filter);
  };

  return (
    <Wrapper4
      edges={['left', 'right']}
      transparentStatusBar
      title={"Orders"}
      appUserInfo={appUser}
      navigation={navigation}
      showHeader
    >
      <View style={styles.container}>
        {internet == false ? (
          <NoInternet />
        ) : (
          <>
            {/* <DashboardHeader title={'Orders'} /> */}
            <View style={styles.mainView}>
              <Tabs3
                isRating={true}
                tabs={tabs}
                tabPress={handleTabPress}
                type={defaultType}
              />
              {/* <View style={styles.offerTextView}>
              <Text style={styles.offerText}>Offers You Can’t Miss</Text>
            </View> */}
              {loading == true ? (
                <AnimatedLoader type={'orderHistoryLoader'} />
              ) : (
                <View style={{ flex: 0 }}>
                  {orderList?.length > 0 ? (
                    <FlatList
                      ref={flatListRef}
                      initialScrollIndex={0}
                      initialNumToRender={20}
                      contentContainerStyle={{ paddingBottom: Platform.OS == 'ios' ? '35%' : '30%' }}
                      scrollEnabled={true}
                      showsVerticalScrollIndicator={false}
                      data={orderList}
                      renderItem={renderItem}
                      keyExtractor={item => item?._id}
                      onEndReached={loadMoredata}
                      onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% from the bottom
                      ListFooterComponent={renderFooter}
                    />
                  ) : (
                    <View style={styles.NoDataView}>
                      {(loading == false && orderList?.length == 0) && <Text style={styles.NoDataText}>No Record Found</Text>}
                    </View>
                  )}
                </View>
              )}
              {filterLoading && <IndicatorLoader />}
            </View>
          </>
        )}
      </View>

    </Wrapper4>
  );
}
