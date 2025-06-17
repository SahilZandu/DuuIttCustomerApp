import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Image, DeviceEventEmitter, Alert } from 'react-native';
import { appImages } from '../../../commons/AppImages';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import { homeParcelCS } from '../../../stores/DummyData/Home';
import ChangeRoute2 from '../../../components/ChangeRoute2';
import SearchTextIcon from '../../../components/SearchTextIcon';
import { getCurrentLocation } from '../../../components/GetAppLocation';
import { rootStore } from '../../../stores/rootStore';
import moment from 'moment';
import TrackingOrderComp from '../../../components/TrackingOrderComp';
import IncompleteCartComp from '../../../components/IncompleteCartComp';
import socketServices from '../../../socketIo/SocketServices';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import PopUp from '../../../components/appPopUp/PopUp';
import ReviewsRatingComp from '../../../components/ReviewsRatingComp';
import { setMpaDaltaInitials } from '../../../components/GeoCodeAddress';
import MapCurrentLocationRoute from '../../../components/MapCurrentLocationRoute';
import Spacer from '../../../halpers/Spacer';

let geoLocation = {
  lat: null,
  lng: null,
};
let ratingData = {};
export default function ParcelHome({ navigation }) {
  const { appUser } = rootStore.commonStore;
  const { setChatData } = rootStore.chatStore;
  const {
    // ordersRecentOrder,
    ordersTrackOrder,
    orderTrackingList,
    getPendingForCustomer,
    updateOrderStatus,
    setParcelTrackingOrder,
    setParcelOrderInProgress,
  } = rootStore.orderStore;
  const { setAddParcelInfo } = rootStore.parcelStore;
  const { setSenderAddress, setReceiverAddress } = rootStore.myAddressStore;
  const { getCheckDeviceId, testMessage } = rootStore.dashboardStore;
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [recentOrder, setRecentOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [trackedArray, setTrackedArray] = useState(orderTrackingList);
  const [incompletedArray, setIncompletedArray] = useState([]);
  const [internet, setInternet] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [isReviewRider, setIsReviewRider] = useState(false);
  const [isReviewStar, setIsReviewStar] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);
  const [originLocation, setOriginLocation] = useState({});
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };

  useFocusEffect(
    useCallback(() => {
      // setCurrentLocation();
      setChatData([])
      getCheckDevice();
      setMpaDaltaInitials();
      checkInternet();
      handleAndroidBackButton(navigation);
      onUpdateUserInfo();
      getTrackingOrder();
      getIncompleteOrder();
      socketServices.removeListener('update-location');
      socketServices.removeListener('remaining-distance');
      socketServices.disconnectSocket();
      setSenderAddress({});
      setReceiverAddress({});
      setTimeout(() => {
        geoLocation = {
          lat: getLocation('lat'),
          lng: getLocation('lng'),
        };
        setOriginLocation(geoLocation);
        console.log('Updated geoLocation:', geoLocation);
      }, 1500);

    }, []),
  );
  const getCheckDevice = async () => {
    await getCheckDeviceId();
  }

  // useEffect(() => {
  //   const subscription = DeviceEventEmitter.addListener('dropped', data => {
  //     console.log('dropped data -- Parcel ', data);
  //     setIsReviewRider(true);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('newOrder', data => {
      console.log('new order data -- ', data);
      if (data?.order_type == 'parcel') {
        getIncompleteOrder();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('cancelOrder', data => {
      console.log('cancel Order data -- ', data);
      if (data?.order_type == 'parcel') {
        getIncompleteOrder();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('picked', data => {
      console.log('picked data -- ', data);
      if (data?.order_type == 'parcel') {
        // navigation.navigate('parcel', {screen: 'home'});
        getTrackingOrder();
        getIncompleteOrder();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data --Parcel ', data);
      if (data?.order_type == 'parcel') {
        ratingData = data;
        setTimeout(() => {
          setIsReviewRider(true);
        }, 300);
        getTrackingOrder();
        getIncompleteOrder();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const getTrackingOrder = async () => {
    const resTrack = await ordersTrackOrder(handleLoadingTrack);
    if (resTrack?.length > 0) {
      setParcelTrackingOrder(resTrack)
      setTrackedArray(resTrack);
    } else {
      setParcelTrackingOrder([])
      setTrackedArray([]);
    }

  };

  const getIncompleteOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('parcel');
    console.log('resIncompleteOrder parcel--', resIncompleteOrder);
    if (resIncompleteOrder?.length > 0) {
      if ((resIncompleteOrder[0]?.status == 'pending'
        // || resIncompleteOrder[0]?.status == 'find-rider'
      )) {
        deleteIncompleteOrder(resIncompleteOrder);
      }
      else if (resIncompleteOrder?.length > 0 &&
        (resIncompleteOrder[0]?.status !== 'pending'
          // || resIncompleteOrder[0]?.status !== 'find-rider'
        )
      ) {
        setParcelOrderInProgress(resIncompleteOrder)
        setAddParcelInfo(resIncompleteOrder[0]);
        setIncompletedArray(resIncompleteOrder);
      }
    }
    else {
      setParcelOrderInProgress([])
      setAddParcelInfo({});
      setIncompletedArray([]);
    }
  };

  useEffect(() => {
    // if (incompletedArray?.length == 0) {
      const interval = setTimeout(() => {
        getIncompleteOrder(); // make sure this is a function call
      }, 4000);
      return () => clearTimeout(interval); // cleanup
    // }
  }, []);

  const deleteIncompleteOrder = async (data) => {
    const parcelId = data[0]?._id;
    console.log('Item parcelId--', parcelId);
    if (data[0]?.status === 'pending' || data[0]?.status === 'find-rider') {
      await updateOrderStatus(
        parcelId,
        'deleted',
        handleDeleteLoading,
        onDeleteSuccess,
        false,
      );
    }
  };

  const handleDeleteLoading = v => {
    console.log('delete...', v);
    setIsDelete(false);
  };

  const onDeleteSuccess = () => {
    console.log('onDeleteSuccess...');
    getIncompleteOrder();
  };

  const handleLoadingTrack = v => {
    console.log('Track...', v);
  };

  // useEffect(() => {
  //   getRecentOrder();
  // }, []);

  // const getRecentOrder = async () => {
  //         //  await testMessage();
  //   const res = await ordersRecentOrder('parcel', handleLoading);
  //   console.log('res--getRecentOrder', res);
  //   setRecentOrder(res);
  // };

  // const handleLoading = v => {
  //   setLoading(v);
  //   console.log('yes it is being ...');
  // };

  const onUpdateUserInfo = () => {
    const { appUser } = rootStore.commonStore;
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
      return hp('25%');
    } else if (trackedArray?.length > 0 || incompletedArray?.length > 0) {
      return hp('16%');
    } else {
      return hp('5%');
    }
  };

  const onPressInCompleteOrder = () => {
    console.log('home priceConfirmed --', incompletedArray[0]);
    setAddParcelInfo(incompletedArray[0]);
    setTimeout(() => {
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
    }, 2000);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('tab1', event => {
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

  return (
    <View style={styles.container}>
      {internet == false ? (
        <NoInternet />
      ) : (
        <>
          <DashboardHeader2
            navigation={navigation}
            onPress={() => {
              navigation.navigate('dashborad', {
                screen: 'home', params: {
                  screen: 'tab1',
                },
              });
              // navigation.goBack();
            }}
            appUserInfo={appUserInfo}
          />
          <MapCurrentLocationRoute
            mapContainerView={{ height: hp('30%') }}
            origin={geoLocation ?? originLocation}
            isPendingReq={true}
          />
          <SearchTextIcon
            title={'Enter pick up or send location'}
            onPress={() => {
              if (incompletedArray?.length > 0) {
                onPressInCompleteOrder();
                // navigation.navigate('setLocationHistory');
              } else {
                navigation.navigate('setLocationHistory');
                // navigation.navigate('pickSuccessfully');
              }
            }}
          />
          <View style={styles.outerScrollView}>
            <Spacer space={hp('1%')} />
            <AppInputScroll
              padding={true}
              Pb={getHeight(trackedArray, incompletedArray)}
              keyboardShouldPersistTaps={'handled'}>
              <View style={styles.imageMainView}>
                {/* <View>
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
                          height: hp('25%'),
                          width: wp('90%'),
                          borderRadius: 20,
                        }}
                        source={appImages.weDeliver}
                      />
                    </View>
                  )}
                </>
              )}
            </View> */}
                <View
                  style={styles.imageView}>
                  <Image
                    resizeMode="contain"
                    style={{ width: wp('90%'), height: hp('18%') }}
                    source={appImages.parcelHomeImage}
                  />
                </View>
                {/* <ChangeRoute2
                  data={homeParcelCS}
                  navigation={navigation}
                  route={'PARCEL'}
                /> */}
              </View>
              <View style={styles.bottomImageView}>
                <Image
                  resizeMode="contain"
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
              incompletedArray={incompletedArray}
              onPressComplete={() => {
                onPressInCompleteOrder();
              }}
              // onDeleteRequest={() => {
              //   setIsDelete(true);
              // }}
              title={'Complete your order'}
            />
          )}
          {/* <PopUp
            visible={isDelete}
            type={'delete'}
            onClose={() => setIsDelete(false)}
            title={'You are about to delete an request'}
            text={
              'This will delete your order request from the pending order.Are your sure?'
            }
            onDelete={deleteIncompleteOrder}
          /> */}
          <ReviewsRatingComp
            //data={{}}
            data={ratingData}
            type={'PARCEL'}
            reviewToRider={true}
            title={'How was your parcel delivery experience?'}
            isVisible={isReviewRider}
            onClose={() => {
              setIsReviewRider(false);
            }}
            loading={loadingRating}
            onHandleLoading={v => {
              setLoadingRating(v);
            }}
          />
          {trackedArray?.length > 0 && (
            <TrackingOrderComp
              navigation={navigation}
              trackedArray={trackedArray}
            />
          )}
        </>
      )}
    </View>
  );
}
