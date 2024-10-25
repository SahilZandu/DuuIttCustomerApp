import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {styles} from './styles';
import {SvgXml} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {colors} from '../../../theme/colors';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import TrackingOrderCard from '../../../components/TrackingOrderCard';
import {homeCS} from '../../../stores/DummyData/Home';
import ChangeRoute2 from '../../../components/ChangeRoute2';
import SearchTextIcon from '../../../components/SearchTextIcon';
import MapRoute from '../../../components/MapRoute';
import {setCurrentLocation} from '../../../components/GetAppLocation';
import {rootStore} from '../../../stores/rootStore';
import moment from 'moment';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import TrackingOrderComp from '../../../components/TrackingOrderComp';
import IncompleteCartComp from '../../../components/IncompleteCartComp';
import {getTabBarHeight} from '@react-navigation/bottom-tabs/lib/typescript/src/views/BottomTabBar';
import socketServices from '../../../socketIo/SocketServices';

export default function ParcelHome({navigation}) {
  const {appUser} = rootStore.commonStore;
  const {
    ordersRecentOrder,
    ordersTrackOrder,
    orderTrackingList,
    getPendingForCustomer,
  } = rootStore.orderStore;
  const {setAddParcelInfo} = rootStore.parcelStore;
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [recentOrder, setRecentOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [trackedArray, setTrackedArray] = useState(orderTrackingList);
  const [incompletedArray, setIncompletedArray] = useState([]);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
      setCurrentLocation();
      onUpdateUserInfo();
      getTrackingOrder();
      getIncompleteOrder();
      socketServices.removeListener('update-location');
      socketServices.removeListener('remaining-distance');
      socketServices.disconnectSocket();
    }, []),
  );

  const getTrackingOrder = async () => {
    const resTrack = await ordersTrackOrder(handleLoadingTrack);
    setTrackedArray(resTrack);
  };

  const getIncompleteOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer();
    console.log('resIncompleteOrder--', resIncompleteOrder);
    setIncompletedArray(resIncompleteOrder);
  };

  const handleLoadingTrack = v => {
    console.log('Track...');
  };

  useEffect(() => {
    getRecentOrder();
  }, []);

  const getRecentOrder = async () => {
    const res = await ordersRecentOrder('parcel', handleLoading);
    console.log('res--getRecentOrder', res);
    setRecentOrder(res);
  };

  const handleLoading = v => {
    setLoading(v);
    console.log('yes it is being ...');
  };

  const onUpdateUserInfo = () => {
    const {appUser} = rootStore.commonStore;
    setAppUserInfo(appUser);
  };

  const dateFormat = createdAt => {
    const date = new Date(createdAt);
    const formattedDate = moment(date).format('DD MMM, YYYY');
    // console.log('formattedDate--', formattedDate); // Output: Jul 25, 2024 - 10:30 AM
    return formattedDate;
  };

  const getHeight = (trackedArray, incompletedArray) => {
    if (trackedArray?.length > 0 && incompletedArray?.length > 0) {
      return '40%';
    } else if (trackedArray?.length > 0 || incompletedArray?.length > 0) {
      return '22%';
    } else {
      return '5%';
    }
  };

  const onPressInCompleteOrder = () => {
    console.log('home priceConfirmed --', incompletedArray[0]);
    setAddParcelInfo(incompletedArray[0]);
    if (
      incompletedArray[0]?.status == 'accepted' ||
      incompletedArray[0]?.status == 'find-rider'
    ) {
      navigation.navigate('searchingRide', {
        paymentMethod:
          incompletedArray[0]?.payment_mode == 'cash' ? 'Cash' : 'Online',
      });
    } else {
      navigation.navigate('priceConfirmed', {
        item: incompletedArray[0],
      });
    }
  };

  return (
    <View style={styles.container}>
      <DashboardHeader2
        navigation={navigation}
        onPress={() => {
          navigation.goBack();
        }}
        appUserInfo={appUserInfo}
      />

      <MapRoute mapContainerView={{height: hp('25%')}} isPendingReq={true} />
      <SearchTextIcon
        title={'Enter pick up or send location'}
        onPress={() => {
          if (incompletedArray?.length > 0) {
            onPressInCompleteOrder();
          } else {
            navigation.navigate('setLocationHistory');
            // navigation.navigate('pickSuccessfully');
          }
        }}
      />
      <View style={styles.outerScrollView}>
        <AppInputScroll
          padding={true}
          Pb={getHeight(trackedArray, incompletedArray)}
          keyboardShouldPersistTaps={'handled'}>
          <View style={{marginTop: '4%', marginHorizontal: 20}}>
            <View>
              <Text
                style={{
                  fontSize: RFValue(13),
                  fontFamily: fonts.medium,
                  color: colors.black,
                }}>
                {'Your last Order'}
              </Text>

              {loading == true ? (
                <AnimatedLoader type={'recentOrderLoader'} />
              ) : (
                <>
                  {recentOrder && Object?.keys(recentOrder)?.length > 0 ? (
                    <TrackingOrderCard
                      value={{
                        trackingId: recentOrder?._id,
                        price: recentOrder?.total_amount,
                        pickup: recentOrder?.sender_address?.address,
                        drop: recentOrder?.receiver_address?.address,
                        date: dateFormat(recentOrder?.createdAt),
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '3%',
                      }}>
                      <Image
                        resizeMode="cover"
                        style={{
                          height: hp('22%'),
                          width: wp('90%'),
                          borderRadius: 20,
                        }}
                        source={appImages.weDeliver}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '6%',
              }}>
              <Image
                resizeMode="stretch"
                style={{width: wp('90%'), height: hp('18%')}}
                source={appImages.parcelHomeImage}
              />
            </View>
            <ChangeRoute2
              data={homeCS}
              navigation={navigation}
              route={'PARCEL'}
            />
          </View>
          <View style={styles.bottomImageView}>
            <Image
              resizeMode="cover"
              style={styles.bottomImage}
              source={appImages.parcelHomeBootmImage}
            />
          </View>
        </AppInputScroll>
      </View>

      {incompletedArray?.length > 0 && (
        <IncompleteCartComp
          navigation={navigation}
          trackedArray={trackedArray}
          onPressComplete={() => {
            onPressInCompleteOrder();
          }}
        />
      )}

      {trackedArray?.length > 0 && (
        <TrackingOrderComp
          navigation={navigation}
          trackedArray={trackedArray}
        />
      )}
    </View>
  );
}
