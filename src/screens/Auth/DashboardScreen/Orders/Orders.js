import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, View, KeyboardAvoidingView, FlatList, ActivityIndicator, DeviceEventEmitter} from 'react-native';
import {appImagesSvg, appImages} from '../../../../commons/AppImages';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import MikePopUp from '../../../../components/MikePopUp';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import {ordersArray} from '../../../../stores/DummyData/orders';
import CardOrder from '../../../../components/CardOrder';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import Tabs3 from '../../../../components/Tabs3';
import { rootStore } from '../../../../stores/rootStore';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';



const tabs = [
  {text: 'All Orders'},
  {text: 'Food'},
  {text: 'Ride'},
  {text: 'Parcel'},
];

let defaultType = 'All Orders';
let perPage = 20;

export default function Orders({navigation}) {
  const {parcelsOfUser, getOrderHistorybyFilters, orderHistoryList} =
  rootStore.orderStore;
  const {appUser}=rootStore.commonStore;
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [orderList ,setOrderList]=useState(orderHistoryList)
  const [type ,setType]=useState('All Orders')
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(
    orderHistoryList?.length > 0 ? false : true,
  );
  const [appUserInfo ,setAppUserInfo]=useState(appUser)
  const [internet, setInternet] = useState(true);


  useFocusEffect(
    useCallback(() => {
      checkInternet()
      handleAndroidBackButton(navigation);
      defaultType = 'All Orders';
      setType('All Orders');
      getOrderList();
      setTimeout(() => {
        setLoading(false);
      }, 5000);
      onUpdateUserInfo()
    }, []),
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

  const onUpdateUserInfo=()=>{
    const {appUser}=rootStore.commonStore;
    setAppUserInfo(appUser)
  }

  const getOrderList = async () => {
    const res = await parcelsOfUser(defaultType, perPage, handleLoading);
    setOrderList(res);
    setLoadingMore(false);
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
        <ActivityIndicator size="large" color="#28B056" />
      </View>
    ) : null;
  };

  const hanldeSearch = async s => {
    console.log('get res:--', s);
  };

  const onSuccessResult = item => {
    console.log('item=== onSuccessResult', item);
    setSearchRes(item);
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
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
        {internet == false ? <NoInternet/> 
      :<>    
      <DashboardHeader
         navigation={navigation}
        title={'Home'}
        autoFocus={isKeyboard}
        onPressSecond={() => {
          // alert('second');
        }}
        secondImage={appImagesSvg.cartIcon}
        // value={searchRes}
        // onChangeText={t => {
        //   setSearchRes(t);
        //   if (t) {
        //     hanldeSearch(t);
        //   }
        // }}
        // onMicroPhone={() => {
        //   setVisible(true);
        // }}
        // onFocus={() => setIskeyboard(true)}
        // onBlur={() => setIskeyboard(false)}
        // onCancelPress={() => {
        //   setSearchRes('');
        // }}
        appUserInfo={appUserInfo}
      />
      <View style={styles.mainView}>
      <Tabs3 isRating={true} tabs={tabs} 
            tabPress={handleTabPress}
            type={type}
             />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
          
            <View style={styles.offerTextView}>
              <Text style={styles.offerText}>Offers You Can’t Miss</Text>
            </View>
            {loading == true  ?  <AnimatedLoader type={'orderHistoryLoader'}/>
            :
            <View style={{flex: 1}}>
            {orderList?.length > 0 ? 
              <FlatList
                contentContainerStyle={{paddingBottom: '30%'}}
                nestedScrollEnable={true}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={orderList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onEndReached={loadMoredata}
                onEndReachedThreshold={0.1} // Trigger when the user scrolls 10% from the bottom
                ListFooterComponent={renderFooter}
              />
              :
              <View style={styles.NoDataView}>
                    <Text style={styles.NoDataText}>No Record Found</Text>
                  </View>}
            </View>
             }
          </AppInputScroll>
        </KeyboardAvoidingView>
      </View>
      <MikePopUp
        visible={visible}
        title={'Sorry! Didn’t hear that'}
        text={'Try saying restaurant name or a dish.'}
        onCancelBtn={onCancel}
        onSuccessResult={onSuccessResult}
      />
      </>}
    </View>
  );
}
