import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  Linking,
  Animated,
  DeviceEventEmitter,
  TouchableOpacity,
  AppState,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages, appImagesSvg } from '../commons/AppImages';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';
import { colors } from '../theme/colors';
import * as Progress from 'react-native-progress';
import DriverArrivingComp from '../components/DriverArrivingComp';
import TextRender from '../components/TextRender';
import OtpShowComp from '../components/OtpShowComp';
import MapRouteMarker from '../components/MapRouteMarker';
import { rootStore } from '../stores/rootStore';
import MapRoute from '../components/MapRoute';
import MeetingPickupComp from '../components/MeetPickupComp';
import HomeSlider from '../components/slider/homeSlider';
import PopUpRideDetails from '../components/PopUpRideDetails';
import PopUpCancelInstruction from '../components/PopUpCancelInstruction';
import PopUpRideCancel from '../components/PopUpRideCancel';
import socketServices from '../socketIo/SocketServices';
import {
  getCurrentLocation,
  setCurrentLocation,
} from '../components/GetAppLocation';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedLoader from '../components/AnimatedLoader/AnimatedLoader';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { screenHeight, screenWidth } from '../halpers/matrics';
import {
  cancelParcel,
  cancelParcelRide,
  cancelRide,
} from '../stores/DummyData/CancelData';
import RiderNotAvailableComp from '../components/RiderNotAvailableComp';
import ImageNameRatingComp from '../components/ImageNameRatingComp';
import { silderArray } from '../stores/DummyData/Home';
import handleAndroidBackButton from '../halpers/handleAndroidBackButton';
import BackBtn from '../components/cta/BackBtn';
import PickDropImageComp from '../components/PickDropImageComp';
import MapRouteTracking from '../components/MapRouteTracking';


let rideProgessRide = 0.2
let checkRiderStatus = {}

const SearchingParcelForm = ({ navigation, route, screenName }) => {
  const { addParcelInfo, setAddParcelInfo, parcels_Cancel, parcelsFindRider } =
    rootStore.parcelStore;
  const intervalRef = useRef(null);
  const { appUser } = rootStore.commonStore;
  const appState = useRef(AppState.currentState);
  const { getPendingForCustomer, getCheckingPendingForCustomer, updateOrderStatus } = rootStore.orderStore;
  const { unseenMessages, setChatNotificationStatus } = rootStore.chatStore;
  const { paymentMethod, totalAmount } = route.params;
  const [searching, setSearching] = useState(true);
  const [searchArrive, setSearchArrive] = useState('search');
  const [searchingFind, setSearchingFind] = useState('searching');
  const [senderLocation, setSenderLocation] = useState({});
  const [destination, setDestination] = useState({});
  const [riderDest, setRiderDest] = useState({});
  const [parcelInfo, setParcelInfo] = useState(addParcelInfo ?? {});
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [riderLoading, setRiderLoading] = useState(false);
  const [nearbyRider, setNearByRider] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [rideDetailsVisible, setRideDetailsVisible] = useState(false);
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [multipleRider, setMultipleRider] = useState(true);
  const [minMaxHp, setMinMaxHp] = useState(screenHeight(69));
  const [rideProgess, setRideProgess] = useState(0.2);
  const [rideProgessImage, setRideProgessImage] = useState(hp('1%'));
  const [readMsg, setReadMsg] = useState(false)
  const [kms, setKms] = useState({
    distance_km: 0,
    eta: '0m 0s'
  });
  const [isTracking, setIsTracking] = useState(true)
  const [runingBike, setRuningBike] = useState(false)

  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };


  console.log('paymentMethod--', paymentMethod, addParcelInfo, parcelInfo);
  // useEffect(() => {
  //   // start interval that runs in foreground
  //   setRideProgessImage(hp('1%'));
  //   setRideProgess(0.2);
  //   intervalRef.current = setInterval(() => {
  //     console.log('Running every 7500ms');

  //     setRideProgess(prev => prev + 0.1);
  //     setRideProgessImage(prev => prev + hp('4.2%'));
  //   }, 7500); // 7500ms = 7.5s

  //   return () => {
  //     clearInterval(intervalRef.current);
  //   };
  // }, []);


  useEffect(() => {
    // start interval that runs in foreground and background
    if (runingBike) {
      setRideProgessImage(hp('1%'));
      setRideProgess(0.2);
      rideProgessRide = 0.2
      const intervalId = setInterval(() => {
        console.log('Running every 7.5s in background', rideProgess, rideProgessRide);
        if ((rideProgess || rideProgessRide) !== 1) {
          setRideProgess(prev => prev + 0.1);
          rideProgessRide = rideProgessRide + 0.1;
          setRideProgessImage(prev => prev + hp('4.2%'));
        }
        // update your progress state here
      }, 7500);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [runingBike]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('newOrder', data => {
      if (data?.order_type == 'parcel') {
        console.log('new order data -- ', data);
        setParcelInfo(data);
        setAddParcelInfo(data);
        setSearchArrive('arrive');
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
        navigation.navigate(screenName, { screen: 'home' });
        setSearchArrive('search');
        checkRiderStatus = {}
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('picked', data => {
      console.log('picked data -- ', data);
      // navigation.navigate('parcel', {screen: 'home'});
      if (data?.order_type == 'parcel') {
        setParcelInfo(data);
        setAddParcelInfo(data);
        setRiderDest(data?.rider?.geo_location);
        setSenderLocation(data?.sender_address?.geo_location);
        setDestination(data?.receiver_address?.geo_location);
        checkRiderStatus = data
        if (screenName == 'parcel') {
          navigation.navigate('pickSuccessfully');
          setSearchArrive('search');
        } else {
          setMinMaxHp(screenHeight(35));
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data -- ', data);
      if (data?.order_type == 'parcel') {
        if (screenName == 'ride') {
          navigation.navigate(screenName, { screen: 'home' });
          setSearchArrive('search');
          checkRiderStatus = {}
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);


  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('chatData', data => {
      console.log('chatData Order data -- ', data);
      if (data?.order_type == 'parcel') {
        checkUnseenMsg();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('chatPage', data => {
      console.log('chatPagedata -- ', data);
      if (data?.order_type == 'parcel') {
        setTimeout(() => {
          onChat();
        }, 500)

      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    socketServices.initailizeSocket();
    // ridePickupParcel()
  }, [isTracking]);


  useEffect(() => {
    if (Object?.keys(parcelInfo ?? addParcelInfo)?.length > 0) {
      setSenderLocation(parcelInfo?.sender_address?.geo_location);
      setDestination(parcelInfo?.receiver_address?.geo_location);
      setRiderDest(parcelInfo?.rider?.geo_location);

      setTimeout(() => {
        setSearching(false);
        if (
          parcelInfo?.status == 'accepted' ||
          parcelInfo?.status == 'picked'
        ) {
          setSearchArrive('arrive');
          if (parcelInfo?.status == 'picked') {
            setMinMaxHp(screenHeight(35));
          }
        }
      }, 1000);
    }
  }, [addParcelInfo, parcelInfo]);

  useEffect(() => {
    if (Object?.keys(parcelInfo ?? addParcelInfo)?.length > 0) {
      setSenderLocation(parcelInfo?.sender_address?.geo_location);
      setDestination(parcelInfo?.receiver_address?.geo_location);
      setRiderDest(parcelInfo?.rider?.geo_location);
      setTimeout(() => {
        setSearching(false);
        if (
          parcelInfo?.status == 'accepted' ||
          parcelInfo?.status == 'picked'
        ) {
          setSearchArrive('arrive');
          if (parcelInfo?.status == 'picked') {
            setMinMaxHp(screenHeight(35));
          }
        } else {
          onGetNearByRider(addParcelInfo ?? parcelInfo);
        }
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let query = {
        lat: getLocation('lat')?.toString(),
        lng: getLocation('lng')?.toString(),
        user_id: appUser?._id,
        user_type: 'customer',
        fcm_token: appUser?.fcm_token,
      };
      socketServices.emit('update-location', query);
      // socketServices.on('getremainingdistance', data => {
      //   console.log('Remaining distance data--:', data, data?.location);
      //   if ((data && data?.location && data?.location?.lat)) {
      //     setRiderDest(data?.location);
      //   }
      // });
      socketServices.on('getEtaToCustomer', (data) => {
        console.log('Distance (km):', data, data.distance_km);
        console.log('ETA:', data.eta);
        setKms(data)
      });

      // socketServices.on('testevent', data => {
      //   console.log('test event', data);
      // });

      socketServices.on('near-by-riders', data => {
        console.log('near-by-riders data--:', data, data?.data);
        if (data?.data?.length > 0 && data?.data[0]?.geo_location) {
          setNearByRider(data);
        } else {
          setNearByRider([]);
        }
      });
    }, 2500);


    // socketServices.on('getremainingdistance', data => {
    //   console.log('Remaining distance data--:', data, data?.location);
    //   if ((data && data?.location && data?.location?.lat)) {
    //     setRiderDest(data?.location);
    //   }
    // });
    socketServices.on('near-by-riders', data => {
      console.log('near-by-riders data--:', data, data?.data);
      if (data?.data?.length > 0 && data?.data[0]?.geo_location) {
        setNearByRider(data);
      } else {
        setNearByRider([]);
      }
    });
    socketServices.on('getEtaToCustomer', (data) => {
      console.log('Distance (km):', data, data.distance_km);
      console.log('ETA:', data.eta);
      setKms(data)
    });

    // socketServices.on('testevent', data => {
    //   console.log('test event', data);
    // });



    return () => {
      clearTimeout(timeoutId);
      // socketServices.removeListener('getremainingdistance');
      socketServices.removeListener('testevent');
      socketServices.removeListener('near-by-riders');
    };
  }, [isTracking]);


  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      // Prevent unnecessary calls if state hasn't changed
      if (appState.current === nextAppState) return;

      if (nextAppState === "background") {
        console.log("App went to background: stopping services");
        // alert('no');
        setIsTracking(false)
      }

      if (nextAppState === "active") {
        // alert('yes');
        setTimeout(() => {
          socketServices.initailizeSocket();
        }, 2000)
        setIsTracking(true)
        // restart any background tasks if needed
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkUnseenMsg();
      setChatNotificationStatus(true);
      handleAndroidBackButton('', 'parcel', 'parcel', navigation);
      if (parcelInfo?.status == 'accepted' || parcelInfo?.status == 'picked') {
        const intervalId = setInterval(() => {
          setCurrentLocation();
          setTimeout(() => {
            getSocketLocation(socketServices);
          }, 1500);
        }, 20000);
        return () => {
          // This will run when the screen is unfocused
          clearInterval(intervalId);
        };
      }
    }, [parcelInfo]),
  );

  useEffect(() => {
    const updateRes = setTimeout(() => {
      getIncompleteOrder();
    }, 500)
    return () => clearTimeout(updateRes);
  }, [])

  const getIncompleteOrder = async () => {
    // if (totalAmount == 0) {
    // const resIncompleteOrder = await getPendingForCustomer('parcel');

    // console.log('resIncompleteOrder ride--', resIncompleteOrder);
    // if (resIncompleteOrder?.length > 0) {
    //   if (resIncompleteOrder[0]?.status !== "pending") {
    //     if (resIncompleteOrder[0]?.status === "picked") {
    //       setParcelInfo(resIncompleteOrder[0]);
    //       setAddParcelInfo(resIncompleteOrder[0]);
    //       navigation.navigate('pickSuccessfully');
    //       setSearchArrive('search');
    //     } else {
    //       if (resIncompleteOrder[0]?.status !== parcelInfo?.status) {
    //         setParcelInfo(resIncompleteOrder[0]);
    //         setAddParcelInfo(resIncompleteOrder[0]);
    //       }
    //     }
    //   }
    // }
    // else {
    //   // if (resIncompleteOrder?.length == 0) {
    //   navigation.navigate('parcel', { screen: 'home' });
    //   // }
    // }

    const resIncompleteOrder = await getCheckingPendingForCustomer('parcel');
    // console.log('resIncompleteOrder parcel--', resIncompleteOrder);
    if (resIncompleteOrder?.statusCode == 200) {
      const resFilter = await resIncompleteOrder?.data?.filter((item) =>
        item?.order_type?.toLowerCase() === 'parcel'
      );
      if (resFilter?.length > 0) {
        checkRiderStatus = resFilter[0]
        if (resFilter[0]?.status !== "pending") {
          if (resFilter[0]?.status === "picked") {
            setParcelInfo(resFilter[0]);
            setAddParcelInfo(resFilter[0]);
            navigation.navigate('pickSuccessfully');
            setSearchArrive('search');
          } else {
            if (resFilter[0]?.status !== checkRiderStatus?.status) {
              setParcelInfo(resFilter[0]);
              setAddParcelInfo(resFilter[0]);
            }
          }
        }
      }
      else {
        navigation.navigate('parcel', { screen: 'home' });
        checkRiderStatus = {}
      }
    }

  }



  useEffect(() => {
    // start interval that runs in foreground and background
    const intervalId = setInterval(() => {
      console.log('Running every 7s in background');
      getCheckingIncompleteOrder();
      // update your ride progress state here
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  const getCheckingIncompleteOrder = async () => {

    // const resIncompleteOrder = await getPendingForCustomer('parcel');
    // console.log('resIncompleteOrder ride--', resIncompleteOrder);
    // if (resIncompleteOrder?.length > 0) {
    //   if (resIncompleteOrder[0]?.status !== "pending") {
    //     if (resIncompleteOrder[0]?.status === "picked") {
    //       setParcelInfo(resIncompleteOrder[0]);
    //       setAddParcelInfo(resIncompleteOrder[0]);
    //       navigation.navigate('pickSuccessfully');
    //       setSearchArrive('search');
    //     } else {
    //       if (resIncompleteOrder[0]?.status !== parcelInfo?.status) {
    //         setParcelInfo(resIncompleteOrder[0]);
    //         setAddParcelInfo(resIncompleteOrder[0]);
    //       }
    //     }
    //   }
    // }

    const resIncompleteOrder = await getCheckingPendingForCustomer('parcel');
    // console.log('resIncompleteOrder parcel--', resIncompleteOrder);
    if (resIncompleteOrder?.statusCode == 200) {
      const resFilter = await resIncompleteOrder?.data?.filter((item) =>
        item?.order_type?.toLowerCase() === 'parcel'
      );
      if (resFilter?.length > 0) {
        if (resFilter[0]?.status !== "pending") {
          if (resFilter[0]?.status === "picked") {
            setParcelInfo(resFilter[0]);
            setAddParcelInfo(resFilter[0]);
            navigation.navigate('pickSuccessfully');
            setSearchArrive('search');
          } else {
            if (resFilter[0]?.status !== checkRiderStatus?.status) {
              checkRiderStatus = resFilter[0]
              setParcelInfo(resFilter[0]);
              setAddParcelInfo(resFilter[0]);
            }
          }
        }
      }
      else {
        navigation.navigate('parcel', { screen: 'home' });
        checkRiderStatus = {}
      }
    }

  }



  // useEffect(() => {
  //   if (parcelInfo?.status !== 'accepted' && searchingFind == 'searching') {
  //     const findNearbyRiders = setInterval(() => {
  //       // console.log('info--', parcelInfo);
  //       let query = {
  //         lat: getLocation('lat')?.toString(),
  //         lng: getLocation('lng')?.toString(),
  //         user_id: appUser?._id,
  //         order_id: parcelInfo?._id,
  //         refresh: '',
  //       };
  //       // socketServices.emit('find-nearby-riders', query);
  //     }, 20000);
  //     return () => {
  //       clearInterval(findNearbyRiders);
  //     };
  //   }
  // }, [parcelInfo, nearbyRider, searchingFind]);

  // useEffect(() => {
  //   if (parcelInfo?.status !== 'accepted' && searchingFind == 'searching') {
  //     const refershFindRiders = setTimeout(async () => {
  //       setSearchingFind('refresh');
  //       await updateOrderStatus(
  //         parcelInfo?._id,
  //         'pending',
  //         handleDeleteLoading,
  //         onDeleteSuccess,
  //         false,
  //       );
  //     }, 60000);
  //     return () => {
  //       // This will run when the screen is unfocused
  //       clearTimeout(refershFindRiders);
  //     };
  //   }
  // }, [parcelInfo, searchingFind]);


  useEffect(() => {
    let intervalId;

    if (parcelInfo?.status !== 'accepted' && searchingFind === 'searching') {
      intervalId = setInterval(async () => {
        console.log('⏱️ Refreshing find rider...');
        setSearchingFind('refresh');
        setRuningBike(false)
        await updateOrderStatus(
          parcelInfo?._id,
          'pending',
          handleDeleteLoading,
          onDeleteSuccess,
          false
        );
      }, 60000); // every 60 seconds
    }

    return () => {
      clearInterval(intervalId); // Clear when screen unmounts or deps change
    };
  }, [parcelInfo?.status, searchingFind]);


  useEffect(() => {
    let intervalId;
    if (parcelInfo?.status !== 'accepted' && searchingFind === 'searching') {
      intervalId = setInterval(async () => {
        console.log('⏱️ (BG) Refreshing find rider...');
        setSearchingFind('refresh');
        setRuningBike(false)
        await updateOrderStatus(
          parcelInfo?._id,
          'pending',
          handleDeleteLoading,
          onDeleteSuccess,
          false
        );
      }, 60000); // every 60 seconds
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [parcelInfo?.status, searchingFind]);



  const checkUnseenMsg = async () => {
    let req = {
      orderId: addParcelInfo?._id ?? parcelInfo?._id,
      senderRole: 'customer'
    }
    const res = await unseenMessages(req);
    console.log("res unseenMessages", res);
    if (res?.statusCode == 200 && res?.data?.length > 0) {
      setReadMsg(true)
    } else {
      setReadMsg(false)
    }

  }

  const handleDeleteLoading = v => {
    console.log('vvvv--', v);
  };
  const onDeleteSuccess = () => {
    console.log('onDeleteSuccess--');
  };

  const refershFindRidersData = () => {
    setSearching(false);
    if (parcelInfo?.status == 'accepted' || parcelInfo?.status == 'picked') {
      setSearchArrive('arrive');
    } else {
      setSearchingFind('searching');
      onGetNearByRider(parcelInfo);
    }
  };

  const backToHome = () => {
    navigation.navigate(screenName, { screen: 'home' });
    setSearchArrive('search');
  };

  const onCancelOrderRequest = async () => {
    await updateOrderStatus(
      parcelInfo?._id,
      'deleted',
      handleOrderDeleteLoading,
      onOrderDeleteSuccess,
      false,
    );
  }

  const handleOrderDeleteLoading = () => {
    console.log('handleOrderDeleteLoading');
  }

  const onOrderDeleteSuccess = () => {
    console.log('onDeleteSuccess--');
    backToHome();
  }


  const getSocketLocation = async socketServices => {
    const { appUser } = rootStore.commonStore;
    let query = {
      lat: getLocation('lat')?.toString(),
      lng: getLocation('lng')?.toString(),
      user_id: appUser?._id,
      user_type: 'customer',
      fcm_token: appUser?.fcm_token,
    };
    socketServices.emit('update-location', query);

    let request = {
      lat: getLocation('lat')?.toString(),
      lng: getLocation('lng')?.toString(),
      rider_id: parcelInfo?.rider?._id,
      customer_id: appUser?._id,
      user_type: 'customer',
    };
    console.log('Socket state:', socketServices?.socket?.connected, request);
    socketServices.emit('remaining-distance', request);
  };

  const onGetNearByRider = async info => {
    console.log('info--', info, parcelInfo);
    let query = {
      lat: getLocation('lat')?.toString(),
      lng: getLocation('lng')?.toString(),
      user_id: appUser?._id,
      order_id: info?._id,
      refresh: 'refresh',
    };
    // socketServices.emit('find-nearby-riders', query);

    const value = {
      parcel_id: info?._id,
      geo_location: info?.sender_address?.geo_location,
      paymentMode: paymentMethod === 'Cash' ? 'cash' : 'online',
      total_amount: totalAmount,
    };

    const res = await parcelsFindRider(value, handleLoadingRider);
    console.log('res-- parcels Find Rider - ', res, value);
    if (res?.length > 0 && res[0]?.geo_location) {
      setNearByRider(res);
      setRuningBike(true)
      setMultipleRider(false);
    } else {
      setNearByRider([]);
      setRuningBike(true)
      setMultipleRider(false);
      socketServices.emit('find-nearby-riders', query);
    }
    setTimeout(() => {
      setMultipleRider(false);
    }, 3000);
  };

  const handleLoadingRider = v => {
    setRiderLoading(v);
  };

  const driverArrive = [
    // {
    //   id: 0,
    //   title: 'Order ID',
    //   value:  `${parcelInfo?._id}`,
    // },
    {
      id: 2,
      title: 'Vehicle Number',
      value: `${parcelInfo?.rider?.vehicle_info?.vehicle_number}`,
    },
  ];

  const hanldeLinking = type => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${'DuuItt@gmail.com'}`);
      } else {
        Linking.openURL(`tel:${parcelInfo?.rider?.phone?.toString()}`);
      }
    }
  };

  const onChat = () => {
    navigation.navigate("chat", { item: parcelInfo ?? addParcelInfo })
  }

  const openMap = (riderDest, destination, label) => {
    const latLng = `${riderDest?.lat},${riderDest?.lng}`;
    const latlng1 = `${destination?.lat},${destination?.lng}`;
    const url = Platform.select({
      ios: `http://maps.apple.com/?saddr=${latLng}&daddr=${latlng1}&q=${label}`, //   url = `http://maps.apple.com/?ll=${latLng}&q=${label}`;
      android: `geo:${latLng}?q=${latlng1}(${label})`,
    });

    Linking.openURL(url).catch(err =>
      console.error('Failed to open map:', err),
    );
  };

  const onCancelRequest = async () => {
    const value = {
      orderId: parcelInfo?._id,
      customerId: parcelInfo?.customer_id,
      reason: cancelReason,
    };

    await parcels_Cancel(value, onSuccess, handleLoading);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onSuccess = () => {
    setCancelVisible(false);
    socketServices.removeListener('update-location');
    socketServices.removeListener('remaining-distance');
    socketServices.disconnectSocket();
    setTimeout(() => {
      navigation.navigate(screenName, { screen: 'home' });
    }, 200);
  };

  const onDotPress = () => {
    // refRBSheet.current.close();
    setTimeout(() => {
      setRideDetailsVisible(true);
    }, 500);
  };

  const onPressCancelRide = () => {
    setRideDetailsVisible(false);
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };

  const onGestureEvent = ({ nativeEvent }) => {
    console.log('nativeEvent----------', nativeEvent, parcelInfo);
    // if (parcelInfo?.status == 'picked') {
    //   if (nativeEvent?.translationY >= 0) {
    //     setMinMaxHp(screenHeight(35));
    //   }
    // } else {
    //   if (nativeEvent?.translationY >= 0) {
    //     setMinMaxHp(screenHeight(35));
    //   } else {
    //     setMinMaxHp(screenHeight(67));
    //   }
    // }

    if (parcelInfo?.status == 'picked') {
      if (
        nativeEvent?.absoluteY >= 200 &&
        nativeEvent?.absoluteY <= 399 &&
        nativeEvent?.velocityY > 0
      ) {
        setMinMaxHp(screenHeight(35));
      }
    } else {
      if (
        nativeEvent?.absoluteY >= 200 &&
        nativeEvent?.absoluteY <= 399 &&
        nativeEvent?.velocityY > 0
      ) {
        setMinMaxHp(screenHeight(35));
      } else if (
        nativeEvent?.absoluteY >= 500 &&
        nativeEvent?.absoluteY <= 900 &&
        nativeEvent?.velocityY < 0
      ) {
        setMinMaxHp(screenHeight(69));
      }
    }
  };

  const onUpdateKmsTime = (distanceInKm, eta) => {
    console.log("distanceInKm, eta -- ", distanceInKm, eta);
    setKms({
      distance_km: distanceInKm ?? 0,
      eta: eta ?? '0m 0s'
    });
  }

  return (
    <GestureHandlerRootView style={styles.main}>
      <View style={styles.main}>
        <View style={styles.mapView}>
          {searchArrive == 'search' ? (
            <>
              {multipleRider == true ? (
                <AnimatedLoader type="multipleRiderLoader" />
              ) : (
                <MapRouteMarker
                  searchingRideParcel={appImages.searchingParcel}
                  origin={senderLocation}
                  markerArray={nearbyRider}
                  mapContainerView={{
                    height: screenHeight(80),
                    // height: hp('82%')
                  }}
                />
              )}
            </>
          ) : (
            <>
              {/* {riderDest?.lng && senderLocation?.lng ? ( */}
              {/* <MapRoute
                riderCustomerDetails={parcelInfo}
                origin={riderDest}
                destination={
                  parcelInfo?.status == 'picked' ? destination : senderLocation
                }
                mapContainerView={
                  Platform.OS == 'ios'
                    ? {
                      height:
                        minMaxHp == screenHeight(69)
                          ? screenHeight(31)
                          : screenHeight(58),
                    }
                    : {
                      height:
                        minMaxHp == screenHeight(69)
                          ? screenHeight(31)
                          : screenHeight(68),
                    }
                }
              /> */}
              <MapRouteTracking
                onKmsTime={onUpdateKmsTime}
                riderCustomerDetails={parcelInfo}
                origin={riderDest}
                destination={
                  parcelInfo?.status == 'picked' ? destination : senderLocation
                }
                mapContainerView={
                  Platform.OS == 'ios'
                    ? {
                      height:
                        minMaxHp == screenHeight(69)
                          ? screenHeight(31)
                          : screenHeight(58),
                    }
                    : {
                      height:
                        minMaxHp == screenHeight(69)
                          ? screenHeight(31)
                          : screenHeight(68),
                    }
                }
              />
              {/* ) : null} */}
              {/* {parcelInfo?.status == 'picked' && (
                <TouchableOpacity
                  onPress={async () => {
                    const destination =
                      parcelInfo?.status == 'picked'
                        ? destination
                        : senderLocation;

                    await openMap(riderDest, destination, 'Destination');
                  }}
                  activeOpacity={0.8}
                  style={styles.googleMapsIconTouch}>
                  <Image
                    resizeMode="cover"
                    style={styles.googleMpasImage}
                    source={appImages?.googleMapsIcon}
                  />
                </TouchableOpacity>
              )} */}
            </>
          )}
        </View>
        <BackBtn onPress={() => {
          backToHome();
        }} />
        {searchArrive == 'search' ? (
          <View style={styles.containerSearchingView}>
            {searchingFind == 'searching' ? (
              <>
                {parcelInfo?.status === 'find-rider' ||
                  parcelInfo?.status === 'pending' ? (
                  <View style={styles.innerSearchingView}>
                    {/* <View style={styles.textMainView}>
                      <Text style={styles.searchingPartnerText}>
                        {screenName == 'parcel'
                          ? 'Searching Delivery Partner'
                          : 'Searching Ride'}
                      </Text>
                      <Text style={styles.findNearbyText}>
                        Finding drivers nearby
                      </Text>
                    </View> */}
                    <MeetingPickupComp
                      firstText={screenName == 'parcel'
                        ? 'Searching Delivery Partner'
                        : 'Searching Ride'}
                      secondText={'Finding drivers nearby'}
                      onPressDot={() => {
                        onDotPress();
                      }}
                    />
                    <View style={{ marginTop: hp('2%') }}>
                      <Image
                        resizeMode="contain"
                        // style={styles.bikeImage}
                        style={[
                          styles.bikeImage,
                          { marginLeft: rideProgessImage },
                        ]}
                        source={appImages.searchingParcel}
                      />
                      <Progress.Bar
                        indeterminate={searching}
                        indeterminateAnimationDuration={1000}
                        // progress={0.2}
                        progress={rideProgess}
                        width={screenWidth(84)}
                        height={screenHeight(0.5)}
                        color={colors.color43}
                        borderColor={colors.color95}
                        unfilledColor={colors.color95}
                      />
                    </View>
                  </View>
                ) : (
                  <AnimatedLoader
                    absolute={'relative'}
                    type={'selectedRiderLoader'}
                  />
                )}
              </>
            ) : (
              <RiderNotAvailableComp
                onRefershFindRiders={() => {
                  setRideProgessImage(hp('0%'));
                  setRideProgess(0.2);
                  rideProgessRide = 0.2;
                  setNearByRider([]);
                  refershFindRidersData();
                }}
                onBackToHome={() => {
                  navigation.navigate('priceConfirmed', { item: parcelInfo });
                  // backToHome();
                }}
                onCancelOrder={() => {
                  onDotPress();
                  // onCancelOrderRequest();
                }}
              />
            )}
          </View>
        ) : (
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View
              style={[styles.containerDriverTouch, { height: minMaxHp }]}>
              <View style={styles.topLineView} />
              <View style={{ marginHorizontal: 20 }}>
                <MeetingPickupComp
                  // firstText={'Meet at your pickup stop'}
                  firstText={parcelInfo?.status == 'picked'
                    ? 'Drop you off at location'
                    : 'Meet at your pickup stop'}
                  secondText={'Ride Details'}
                  onPressDot={() => {
                    onDotPress();
                  }}
                />
                {minMaxHp == screenHeight(69) && (
                  <>
                    <ImageNameRatingComp parcelInfo={parcelInfo} />
                    <View style={{ marginTop: hp('-3.5%') }}>
                      <TextRender
                        title={'Vehicle Number'}
                        value={
                          `${parcelInfo?.rider?.vehicle_info?.vehicle_number}`
                          // item?.title == 'Cash'
                          //   ? currencyFormat(Number(item?.value))
                          //   : item?.value
                        }
                      // bottomLine={true}
                      />
                    </View>
                    {/* <DriverArrivingComp
                      unReadMsg={readMsg}
                      topLine={false}
                      title={`${kms?.distance_km ?? 0} km Pickup in ${kms?.eta ?? '0m 0s'}`}
                      onMessage={() => {
                        onChat()
                        // hanldeLinking('email');
                      }}
                      onCall={() => {
                        hanldeLinking('call');
                      }}
                    /> */}

                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.colorD9,
                        marginTop: '4%',
                        marginHorizontal: -20,
                      }}
                    />

                    <OtpShowComp
                      title={'Parcel OTP'}
                      // data={parcelOtp}
                      data={parcelInfo?.parcel_otp?.sender_otp
                        ?.toString()
                        ?.split('')}
                    />
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.colorD9,
                        marginTop: '4%',
                        marginHorizontal: -20,
                      }}
                    />
                    <View style={{ marginTop: hp('2%') }}>
                      <DriverArrivingComp
                        unReadMsg={readMsg}
                        topLine={false}
                        title={`${kms?.distance_km ?? 0} km Pickup in ${kms?.eta ?? '0m 0s'}`}
                        onMessage={() => {
                          onChat()
                          // hanldeLinking('email');
                        }}
                        onCall={() => {
                          hanldeLinking('call');
                        }}
                        bottomLine={true}
                      />
                    </View>
                    {/* <TextRender
                      title={'Vehicle Number'}
                      value={
                        `${parcelInfo?.rider?.vehicle_info?.vehicle_number}`
                        // item?.title == 'Cash'
                        //   ? currencyFormat(Number(item?.value))
                        //   : item?.value
                      }
                      bottomLine={true}
                    /> */}

                  </>
                )}
                <PickDropImageComp
                  item={{
                    pickup: parcelInfo?.sender_address?.address,
                    drop: parcelInfo?.receiver_address?.address,
                  }}
                  image={screenName == 'parcel'
                    ? appImages.packetImage
                    : appImages.packetRideImage}
                />
                {/* <View style={{ marginLeft: '6%', alignSelf: 'center' }}>
                  <HomeSlider data={sliderItems} />
                </View> */}
              </View>
            </Animated.View>
          </PanGestureHandler>
        )}

        <PopUpRideDetails
          isVisible={rideDetailsVisible}
          onClose={() => {
            setRideDetailsVisible(false);
          }}
          title={'Ride Details'}
          info={parcelInfo}
          onPressCancelRide={() => {
            onPressCancelRide();
          }}
          loading={false}
          packetImage={
            screenName == 'parcel'
              ? appImages.packetImage
              : appImages.packetRideImage
          }
          riderLoading={riderLoading}
        />

        <PopUpCancelInstruction
          isVisible={visible}
          onClose={() => {
            setVisible(false);
          }}
          title={'Why do you want to cancel ?'}
          cancelRideInst={screenName == 'parcel' ? cancelParcel : cancelRide}
          onCancelReason={item => {
            setCancelReason(item?.title);
            setVisible(false);
            setTimeout(() => {
              setCancelVisible(true);
            }, 500);
          }}
        />

        <PopUpRideCancel
          isVisible={cancelVisible}
          onClose={() => {
            setCancelVisible(false);
          }}
          title={'Are you sure you want to cancel ?'}
          message={
            screenName == 'parcel'
              ? cancelParcelRide?.parcel
              : cancelParcelRide?.ride
          }
          onCancelRequest={() => {
            onCancelRequest();
          }}
          loading={loading}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default SearchingParcelForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  mapView: {
    flex: 1,
  },
  containerSearchingView: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    bottom: 0,
    alignSelf: 'center',
    height: screenHeight(22),
    width: wp('100%'),
    borderWidth: 0.5,
    borderColor: colors.black20,
  },
  innerSearchingView: {
    paddingHorizontal: 30,
    marginTop: '0.5%',
  },
  textMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
  },
  searchingPartnerText: {
    fontSize: RFValue(18),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  findNearbyText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.colorAA,
    marginTop: '2%',
  },
  bikeImage: {
    width: 50,
    height: 50,
    marginBottom: '-1%',
  },
  containerDriverTouch: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    bottom: 0,
    height: screenHeight(35),
    width: screenWidth(100),
  },
  innerDriverView: {
    paddingHorizontal: 20,
    marginTop: '2%',
  },
  topLineView: {
    height: hp('0.5%'),
    backgroundColor: colors.colorD9,
    width: screenWidth(15),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '3%',
  },
  googleMapsIconTouch: {
    position: 'absolute',
    right: hp('2%'),
    top: hp('2%'),
  },
  googleMpasImage: {
    height: 45,
    width: 45,
  },
});
