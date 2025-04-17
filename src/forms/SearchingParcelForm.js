import React, {useEffect, useState, useCallback, useRef} from 'react';
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
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';
import * as Progress from 'react-native-progress';
import DriverArrivingComp from '../components/DriverArrivingComp';
import TextRender from '../components/TextRender';
import OtpShowComp from '../components/OtpShowComp';
import MapRouteMarker from '../components/MapRouteMarker';
import {rootStore} from '../stores/rootStore';
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
import {useFocusEffect} from '@react-navigation/native';
import AnimatedLoader from '../components/AnimatedLoader/AnimatedLoader';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {screenHeight, screenWidth} from '../halpers/matrics';
import {
  cancelParcel,
  cancelParcelRide,
  cancelRide,
} from '../stores/DummyData/CancelData';
import RiderNotAvailableComp from '../components/RiderNotAvailableComp';
import ImageNameRatingComp from '../components/ImageNameRatingComp';
import {silderArray} from '../stores/DummyData/Home';

const SearchingParcelForm = ({navigation, route, screenName}) => {
  const {addParcelInfo, setAddParcelInfo, parcels_Cancel, parcelsFindRider} =
    rootStore.parcelStore;
  const intervalRef = useRef(null);
  const {appUser} = rootStore.commonStore;
  const {updateOrderStatus} = rootStore.orderStore;
  const {paymentMethod, totalAmount} = route.params;
  const [searching, setSearching] = useState(true);
  const [searchArrive, setSearchArrive] = useState('search');
  const [searchingFind, setSearchingFind] = useState('searching');
  const [senderLocation, setSenderLocation] = useState({});
  const [destination, setDestination] = useState({});
  const [riderDest, setRiderDest] = useState({});
  const [parcelInfo, setParcelInfo] = useState(addParcelInfo);
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

  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };

  console.log('paymentMethod--', paymentMethod, addParcelInfo, parcelInfo);
  useEffect(() => {
    setRideProgessImage(hp('1%'));
    setRideProgess(0.2);
    intervalRef.current = setInterval(() => {
      console.log('Running every 7500ms');

      setRideProgess(prev => prev + 0.1);
      setRideProgessImage(prev => prev + hp('4.2%'));
    }, 7500); // 7500ms = 7.5s

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

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
        navigation.navigate(screenName, {screen: 'home'});
        setSearchArrive('search');
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
          navigation.navigate(screenName, {screen: 'home'});
          setSearchArrive('search');
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    socketServices.initailizeSocket();
    // ridePickupParcel()
  }, []);

  useEffect(() => {
    if (Object?.keys(parcelInfo)?.length > 0) {
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
          onGetNearByRider(parcelInfo);
        }
      }, 1000);
    }
  }, [parcelInfo]);

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
      socketServices.on('getremainingdistance', data => {
        console.log('Remaining distance data--:', data, data?.location);
        if (data && data?.location) {
          setRiderDest(data?.location);
        }
      });

      socketServices.on('testevent', data => {
        console.log('test event', data);
      });

      socketServices.on('near-by-riders', data => {
        console.log('near-by-riders data--:', data, data?.data);
        if (data?.data?.length > 0 && data?.data[0]?.geo_location) {
          setNearByRider(data);
        } else {
          setNearByRider([]);
        }
      });
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
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
    if (parcelInfo?.status !== 'accepted' && searchingFind == 'searching') {
      const findNearbyRiders = setInterval(() => {
        // console.log('info--', parcelInfo);
        let query = {
          lat: getLocation('lat')?.toString(),
          lng: getLocation('lng')?.toString(),
          user_id: appUser?._id,
          order_id: parcelInfo?._id,
          refresh: '',
        };
        socketServices.emit('find-nearby-riders', query);
      }, 20000);
      return () => {
        clearInterval(findNearbyRiders);
      };
    }
  }, [parcelInfo, nearbyRider, searchingFind]);

  useEffect(() => {
    if (parcelInfo?.status !== 'accepted' && searchingFind == 'searching') {
      const refershFindRiders = setTimeout(async () => {
        setSearchingFind('refresh');
        await updateOrderStatus(
          parcelInfo?._id,
          'pending',
          handleDeleteLoading,
          onDeleteSuccess,
          false,
        );
      }, 60000);
      return () => {
        // This will run when the screen is unfocused
        clearTimeout(refershFindRiders);
      };
    }
  }, [parcelInfo, searchingFind]);

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
    navigation.navigate(screenName, {screen: 'home'});
    setSearchArrive('search');
  };

  const getSocketLocation = async socketServices => {
    const {appUser} = rootStore.commonStore;
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
    socketServices.emit('find-nearby-riders', query);

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
    } else {
      setNearByRider([]);
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
      title: 'Bike Number',
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
      navigation.navigate(screenName, {screen: 'home'});
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

  const onGestureEvent = ({nativeEvent}) => {
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
              <MapRoute
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
              {parcelInfo?.status == 'picked' && (
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
              )}
            </>
          )}
        </View>
        {searchArrive == 'search' ? (
          <View style={styles.containerSearchingView}>
            {searchingFind == 'searching' ? (
              <View style={styles.innerSearchingView}>
                <View style={styles.textMainView}>
                  <Text style={styles.searchingPartnerText}>
                    {screenName == 'parcel'
                      ? 'Searching Delivery Partner'
                      : 'Searching Ride'}
                  </Text>
                  <Text style={styles.findNearbyText}>
                    Finding drivers nearby
                  </Text>
                </View>
                <View style={{marginTop: '4%'}}>
                  <Image
                    resizeMode="contain"
                    // style={styles.bikeImage}
                    style={[styles.bikeImage, {marginLeft: rideProgessImage}]}
                    source={appImages.searchingRide}
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
              <RiderNotAvailableComp
                onRefershFindRiders={() => {
                  setRideProgessImage(hp('1%'));
                  setRideProgess(0.2);
                  refershFindRidersData();
                }}
                onBackToHome={() => {
                  backToHome();
                }}
              />
            )}
          </View>
        ) : (
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View
              style={[styles.containerDriverTouch, {height: minMaxHp}]}>
              <View style={styles.topLineView} />
              <View style={{marginHorizontal: 20}}>
                <MeetingPickupComp
                  firstText={'Meet at your pickup stop'}
                  secondText={'Ride Details'}
                  onPressDot={() => {
                    onDotPress();
                  }}
                />
                {minMaxHp == screenHeight(69) && (
                  <>
                    <ImageNameRatingComp parcelInfo={parcelInfo} />

                    <DriverArrivingComp
                      topLine={false}
                      title={'Pickup in 10 minutes'}
                      onMessage={() => {
                        hanldeLinking('email');
                      }}
                      onCall={() => {
                        hanldeLinking('call');
                      }}
                    />

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

                    {/* {driverArrive?.map((item, i) => {
                      return ( */}
                    <TextRender
                      title={'Bike Number'}
                      value={
                        `${parcelInfo?.rider?.vehicle_info?.vehicle_number}`
                        // item?.title == 'Cash'
                        //   ? currencyFormat(Number(item?.value))
                        //   : item?.value
                      }
                      bottomLine={true}
                    />
                    {/* ); */}
                    {/* })} */}
                  </>
                )}
                <View style={{marginLeft: '6%', alignSelf: 'center'}}>
                  <HomeSlider data={sliderItems} />
                </View>
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
    marginTop: '3%',
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
