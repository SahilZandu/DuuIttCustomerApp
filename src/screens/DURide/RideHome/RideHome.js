import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, DeviceEventEmitter, Text } from 'react-native';
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
import { homeRideCS } from '../../../stores/DummyData/Home';
import ChangeRoute2 from '../../../components/ChangeRoute2';
import SearchTextIcon from '../../../components/SearchTextIcon';
import {
  getCurrentLocation,
  setCurrentLocation,
} from '../../../components/GetAppLocation';
import { rootStore } from '../../../stores/rootStore';
import IncompleteCartComp from '../../../components/IncompleteCartComp';
import socketServices from '../../../socketIo/SocketServices';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import PopUp from '../../../components/appPopUp/PopUp';
import ReviewsRatingComp from '../../../components/ReviewsRatingComp';
import { setMpaDaltaInitials } from '../../../components/GeoCodeAddress';
import MapCurrentLocationRoute from '../../../components/MapCurrentLocationRoute';
import PopUpDontService from '../../../components/PopUpDontService';
import Spacer from '../../../halpers/Spacer';
import { Wrapper2 } from '../../../halpers/Wrapper2';

let geoLocation = {
  lat: null,
  lng: null,
};

let ratingData = {};

export default function RideHome({ navigation }) {
  const { appUser } = rootStore.commonStore;
  const { setChatData } = rootStore.chatStore;
  const { getPendingForCustomer, updateOrderStatus, setRideOrderInProgress } = rootStore.orderStore;
  const { setAddParcelInfo } = rootStore.parcelStore;
  const { setSenderAddress, setReceiverAddress } = rootStore.myAddressStore;
  const { getCheckDeviceId } = rootStore.dashboardStore;
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [trackedArray, setTrackedArray] = useState([]);
  const [incompletedArray, setIncompletedArray] = useState([]);
  const [internet, setInternet] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [originLocation, setOriginLocation] = useState({});
  const [isReviewRider, setIsReviewRider] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };

  useFocusEffect(
    useCallback(() => {
      getIncompleteOrder();
      setChatData();
      getCheckDevice();
      setMpaDaltaInitials();
      checkInternet();
      handleAndroidBackButton(navigation);
      setCurrentLocation();
      onUpdateUserInfo();
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
    await getCheckDeviceId()
  }

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('newOrder', data => {
      console.log('new order data -- ', data);
      if (data?.order_type == 'ride') {
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
      if (data?.order_type == 'ride') {
        getIncompleteOrder();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('picked', data => {
      console.log('picked order data -- ', data);
      if (data?.order_type == 'ride') {
        getIncompleteOrder();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data --Ride ', data);
      if (data?.order_type == 'ride') {
        ratingData = data;
        console.log('ratingData----1', ratingData, data, ratingData = data);
        setTimeout(() => {
          setIsReviewRider(true);
        }, 300);
        getIncompleteOrder();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  console.log('ratingData----', ratingData);

  const getIncompleteOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('ride');
    console.log('resIncompleteOrder ride--', resIncompleteOrder);
    if (resIncompleteOrder?.length > 0) {
      if ((resIncompleteOrder[0]?.status == 'pending'
        // || resIncompleteOrder[0]?.status == 'find-rider'
      )
      ) {
        deleteIncompleteOrder(resIncompleteOrder);
      }
      else if (resIncompleteOrder?.length > 0 &&
        (resIncompleteOrder[0]?.status !== 'pending'
          // || resIncompleteOrder[0]?.status !== 'find-rider'
        )) {
        setRideOrderInProgress(resIncompleteOrder)
        setAddParcelInfo(resIncompleteOrder[0]);
        setIncompletedArray(resIncompleteOrder);
      }
    }
    else {
      setRideOrderInProgress([])
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

  const onUpdateUserInfo = () => {
    const { appUser } = rootStore.commonStore;
    setAppUserInfo(appUser);
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
    let checkStatus = incompletedArray[0]?.status;
    if (
      checkStatus == 'accepted' ||
      checkStatus == 'find-rider' ||
      checkStatus == 'picked'
    ) {
      navigation.navigate('searchingRide', {
        paymentMethod:
          incompletedArray[0]?.payment_mode == 'cash' ? 'Cash' : 'Online',
        totalAmount: incompletedArray[0]?.total_amount,
      });
    } else {
      navigation.navigate('priceConfirmed', {
        item: incompletedArray[0],
      });
    }
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
    <Wrapper2
      edges={['left', 'right']}
      transparentStatusBar
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
      showHeader
    >
      <View style={styles.container}>
        {internet == false ? (
          <NoInternet />
        ) : (
          <>
            {/* <DashboardHeader2
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
          /> */}

            <MapCurrentLocationRoute
              mapContainerView={{ height: hp('30%') }}
              origin={geoLocation ?? originLocation}
              isPendingReq={true}
            />

            <SearchTextIcon
              title={'Search for your destination'
                // 'Enter pick up or send location'
              }
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
                // Pb={getHeight(trackedArray, incompletedArray)}
                 Pb={hp('5%')}
                keyboardShouldPersistTaps={'handled'}>
                <View style={styles.imageMainView}>
                  <View
                    style={styles.imageView}>
                    <Image
                      resizeMode="contain"
                      style={{ width: wp('90%'), height: hp('18%') }}
                      source={appImages.rideHomeImage}
                    />
                  </View>
                  {/* <ChangeRoute2
                  data={homeRideCS}
                  navigation={navigation}
                  route={'RIDE'}
                /> */}
                </View>
                <View style={styles.bottomImageView}>
                  <Image
                     resizeMode='stretch'
                    style={styles.bottomImage}
                    // source={appImages.rideHomeBootmImage}
                    source={appImages.mainHomeBootmImage}
                  />
                  <View style={styles.bottoImageTextMainView}>
                    <Text style={styles.duuittText}>#Duuitt</Text>
                    <Text style={styles.everyMileText}>Every mile matters</Text>
                  </View>
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
                title={'Complete your ride'}
              />
            )}
            {/* <PopUp
           topIcon={true}
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
              //  data={{}}
              data={ratingData}
              type={'RIDE'}
              reviewToRider={true}
              title={'How was your ride experience?'}
              isVisible={isReviewRider}
              onClose={() => {
                setIsReviewRider(false);
              }}
              loading={loadingRating}
              onHandleLoading={v => {
                setLoadingRating(v);
              }}
            />
            <PopUpDontService
              isVisible={cancelVisible}
              onClose={() => {
                setCancelVisible(false);
              }}
              // title={"Oops! We currently don't service your location"}
              title={"Oops! we currently don't service your pickup location. Please select different location."}
              onHandle={() => {
                setCancelVisible(false);
              }}
            />
          </>
        )}
      </View>
    </Wrapper2>
  );
}
