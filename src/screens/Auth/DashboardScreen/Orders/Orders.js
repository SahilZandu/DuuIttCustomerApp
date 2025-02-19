import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CardOrder from '../../../../components/CardOrder';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import Tabs3 from '../../../../components/Tabs3';
import {rootStore} from '../../../../stores/rootStore';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';
import {colors} from '../../../../theme/colors';

const tabs = [
  {text: 'All Orders'},
  {text: 'Food'},
  {text: 'Ride'},
  {text: 'Parcel'},
];

let defaultType = 'All Orders';
let perPage = 20;

export default function Orders({navigation, route}) {
  const {tabText} = route.params;
  const {parcelsOfUser, getOrderHistorybyFilters, orderHistoryList} =
    rootStore.orderStore;
  const {appUser} = rootStore.commonStore;
  const [orderList, setOrderList] = useState(orderHistoryList);
  const [type, setType] = useState('All Orders');
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(
    orderHistoryList?.length > 0 ? false : true,
  );
  const [internet, setInternet] = useState(true);

  // console.log('tabText--', tabText,defaultType);

  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
      if (tabText == 'Food') {
        defaultType = 'Food';
        setType('Food');
      } else if (tabText == 'Ride') {
        defaultType = 'Ride';
        setType('Ride');
      } else if (tabText == 'Parcel') {
        defaultType = 'Parcel';
        setType('Parcel');
      } else {
        defaultType = 'All Orders';
        setType('All Orders');
      }
      getOrderList();
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }, [tabText]),
  );

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
      handleTabPress(defaultType);
    } else {
      handleTabPress(defaultType);
      setOrderList([]);
      setLoadingMore(false);
    }
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const loadMoredata = () => {
    console.log('load more');
    if (!loadingMore && orderList?.length >= perPage) {
      perPage = perPage + 20;
      setLoadingMore(true);
      getOrderList();
    }
  };

  const renderFooter = () => {
    return loadingMore ? (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    ) : null;
  };

  const renderItem = ({item, i}) => {
    return (
      <>
        <CardOrder item={item} index={i} />
      </>
    );
  };

  const handleTabPress = async text => {
    defaultType = text;
    setType(text);
    const filter = await getOrderHistorybyFilters(text);
    //  console.log('filter--', filter, defaultType, text);
    setOrderList(filter);
  };

  return (
    <View style={styles.container}>
      {internet == false ? (
        <NoInternet />
      ) : (
        <>
          <DashboardHeader title={'Orders'} />
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
              <View style={{flex: 1}}>
                {orderList?.length > 0 ? (
                  <FlatList
                    contentContainerStyle={{paddingBottom: '30%'}}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    data={orderList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    onEndReached={loadMoredata}
                    onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% from the bottom
                    ListFooterComponent={renderFooter}
                  />
                ) : (
                  <View style={styles.NoDataView}>
                    <Text style={styles.NoDataText}>No Record Found</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}
