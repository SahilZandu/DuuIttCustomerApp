import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  Linking,
  Animated,
  ScrollView,
  DeviceEventEmitter,
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
import RBSheet from '@lunalee/react-native-raw-bottom-sheet';
import Rating from '../components/Rating';
import TextRender from '../components/TextRender';
import {currencyFormat} from '../halpers/currencyFormat';
import OtpShowComp from '../components/OtpShowComp';
import MapRouteMarker from '../components/MapRouteMarker';
import {rootStore} from '../stores/rootStore';
import MapRoute from '../components/MapRoute';
import DriverMeetPickup from '../components/DriverMeetPickup';
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
import { screenHeight, screenWidth } from '../halpers/matrics';


const SearchingRideForm = ({navigation, route}) => {
  const intervalId = useRef(null);
  const {addParcelInfo, parcels_Cancel, parcelsFindRider} =
    rootStore.parcelStore;
  const {appUser} = rootStore.commonStore;
  const {updateOrderStatus} = rootStore.orderStore;
  const refRBSheet = useRef(null);
  const {paymentMethod,totalAmount} = route.params;
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
  const [minMaxHp, setMinMaxHp] = useState(screenHeight(78));

  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };

  console.log('paymentMethod--', paymentMethod, addParcelInfo);

  useEffect(() => {
    if (Object?.keys(addParcelInfo)?.length > 0) {
      setGeoLocation(addParcelInfo?.sender_address?.geo_location);
      setDestination(addParcelInfo?.receiver_address?.geo_location);
      setParcelInfo(addParcelInfo);
      setTimeout(() => {
        setSearching(false);
        onGetNearByRider(addParcelInfo);
      }, 1000);
    }
  }, [addParcelInfo]);

  useEffect(() => {
    const {addParcelInfo} = rootStore.parcelStore;
    if (Object?.keys(addParcelInfo)?.length > 0) {
      setSenderLocation(addParcelInfo?.sender_address?.geo_location);
      setDestination(addParcelInfo?.receiver_address?.geo_location);
      setRiderDest(addParcelInfo?.rider?.geo_location);
      setParcelInfo(addParcelInfo);
      setTimeout(() => {
        setSearching(false);
        if (
          addParcelInfo?.status == 'accepted' ||
          addParcelInfo?.status == 'picked'
        ) {
          setSearchArrive('arrive');
          if (addParcelInfo?.status == 'picked') {
            setMinMaxHp(screenHeight(35));
          }
          // refRBSheet.current.open();
        } else {
          onGetNearByRider(addParcelInfo);
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
  },[]);

  useFocusEffect(
   useCallback(() => {
    const intervalId = setInterval(() => {
      setCurrentLocation();
      setTimeout(() => {
        getSocketLocation(socketServices);
      }, 1000);
    }, 10000);
       return () => {
          // This will run when the screen is unfocused
          clearInterval(intervalId);
       };
    }, [socketServices])
  )

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
      total_amount: totalAmount
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
    {
      id: 0,
      title: 'Order ID',
      value:  `${parcelInfo?._id}`,
    },
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

  const onCancelRequest = async () => {
    const value = {
      orderId: addParcelInfo?._id,
      customerId: addParcelInfo?.customer_id,
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

  const ridePickupParcel = () => {
    setTimeout(() => {
      setVisible(false);
      setCancelVisible(false);
      setRideDetailsVisible(false);
      socketServices.removeListener('update-location');
      socketServices.removeListener('remaining-distance');
      socketServices.disconnectSocket();
      // refRBSheet.current.close();
    },30000);
    setTimeout(() => {
      navigation.navigate('pickSuccessfully');
    },32000);
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
    if (parcelInfo?.status == 'picked') {
      if (nativeEvent?.translationY >= 0) {
        setMinMaxHp(screenHeight(35));
      }
    } else {
      if (nativeEvent?.translationY >= 0) {
        setMinMaxHp(screenHeight(35));
      } else {
        setMinMaxHp(screenHeight(78));
      }
    }
    // if(nativeEvent?.absoluteY >= 451 && nativeEvent?.absoluteY <= 600){
    //   setMinMaxHp(hp('60%'))
    // }
    // else if(nativeEvent?.absoluteY >= 250 && nativeEvent?.absoluteY <= 450){
    //   setMinMaxHp(hp('30%'))
    // }else{
    //   setMinMaxHp(hp('30%'))
    // }
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
            <MapRoute
              origin={riderDest}
              destination={
                senderLocation
                // destination
              }
              mapContainerView={
                Platform.OS == 'ios'
                  ? {height: screenHeight(58)}
                  : {height: screenHeight(68)}
              }
            />
          )}
        </View>
        {searchArrive == 'search' ? (
          // <MapRouteMarker
          //   origin={geoLocation}
          //   markerArray={[]}
          //   mapContainerView={{height: hp('82%')}}
          // />
          <MapRoute
            origin={geoLocation}
            destination={destination}
            mapContainerView={{height: hp('58%')}}
          />
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
                {minMaxHp == screenHeight(78) && (
                  <>
                    <ImageNameRatingComp
                    parcelInfo={parcelInfo}
                     />
                     
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

                    {driverArrive?.map((item, i) => {
                      return (
                        <TextRender
                          title={item?.title}
                          value={
                            item?.title == 'Cash'
                              ? currencyFormat(Number(item?.value))
                              : item?.value
                          }
                          bottomLine={true}
                        />
                      );
                    })}
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

export default SearchingRideForm;

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
});
