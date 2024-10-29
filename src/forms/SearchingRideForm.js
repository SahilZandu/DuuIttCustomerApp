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
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../commons/AppImages';
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
import {useFocusEffect} from '@react-navigation/native';
import AnimatedLoader from '../components/AnimatedLoader/AnimatedLoader';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];

const SearchingRideForm = ({navigation, route}) => {
  const {addParcelInfo, parcels_Cancel, parcelsFindRider} =
    rootStore.parcelStore;
  const {appUser} = rootStore.commonStore;
  const refRBSheet = useRef(null);
  const {paymentMethod} = route.params;
  const [searching, setSearching] = useState(true);
  const [searchArrive, setSearchArrive] = useState('search');
  const [geoLocation, setGeoLocation] = useState({});
  const [destination, setDestination] = useState({});
  const [parcelInfo, setParcelInfo] = useState(addParcelInfo);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [riderLoading, setRiderLoading] = useState(false);
  const [nearbyRider, setNearByRider] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [rideDetailsVisible, setRideDetailsVisible] = useState(false);
  const [sliderItems, setSliderItems] = useState(imageArray);
  const [multipleRider, setMultipleRider] = useState(true);
  const [minMaxHp, setMinMaxHp] = useState(hp('75%'));

  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };

  console.log(
    'paymentMethod--',
    paymentMethod,
    addParcelInfo,
    // parcelInfo?.parcel_otp?.sender_otp?.toString()?.split(''),
    // addParcelInfo?.parcel_otp?.sender_otp?.toString()?.split(''),
  );

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
    setTimeout(() => {
      if (addParcelInfo?.status == 'accepted') {
        setSearchArrive('arrive');
        // refRBSheet.current.open();
      }
      setParcelInfo(addParcelInfo);
    }, 500);
  }, [addParcelInfo]);

  useEffect(() => {
    setTimeout(() => {
      // if(parcelInfo?.status == 'accepted'){
      //   setSearchArrive('arrive');
      //   refRBSheet.current.open();
      // }else{
      setSearchArrive('arrive');
      // refRBSheet.current.open();
      // }
    }, 10000);
  }, [parcelInfo]);

  useEffect(() => {
    socketServices.initailizeSocket();
    // ridePickupParcel()
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let query = {
        lat: getLocation('lat')?.toString(),
        lng: getLocation('lng')?.toString(),
        user_id: appUser?._id,
        user_type: 'customer',
      };
      socketServices.emit('update-location', query);

      socketServices.on('getremainingdistance', data => {
        console.log('Remaining distance data:', data);
      });
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

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
    }, [socketServices]),
  );

  const getSocketLocation = async socketServices => {
    const {appUser} = rootStore.commonStore;
    let query = {
      lat: getLocation('lat')?.toString(),
      lng: getLocation('lng')?.toString(),
      user_id: appUser?._id,
      user_type: 'customer',
    };
    socketServices.emit('update-location', query);

    let request = {
      lat: getLocation('lat')?.toString(),
      lng: getLocation('lng')?.toString(),
      // rider_id: parcelInfo?.rider?._id,
      rider_id: '66ec10d66a97b571cbce371c',
      customer_id: appUser?._id,
      user_type: 'customer',
    };
    console.log('Socket state:', socketServices?.socket?.connected, request);
    socketServices.emit('remaining-distance', request);
  };

  const onGetNearByRider = async info => {
    console.log('info--', info);
    const value = {
      parcel_id: info?._id,
      geo_location: info?.sender_address?.geo_location,
      paymentMode: paymentMethod === 'Cash' ? 'cash' : 'online',
    };

    const res = await parcelsFindRider(value, handleLoadingRider);
    console.log('res-- parcels Find Rider - ', res, value);
    setNearByRider(res);
    setTimeout(() => {
      setMultipleRider(false);
    }, 1000);
  };

  const handleLoadingRider = v => {
    setRiderLoading(v);
  };

  const cancelRide = [
    {
      id: 0,
      title: 'Where is my order',
    },
    {
      id: 1,
      title: 'I want to cancel my order',
    },
    {
      id: 2,
      title: 'I have coupon related queries',
    },
    {
      id: 3,
      title: 'I want to give instructions for my order',
    },
    {
      id: 4,
      title: 'Requested accidently',
    },
    {
      id: 5,
      title: 'Other',
    },
  ];

  const driverArrive = [
    {
      id: 0,
      title: 'Tracking ID',
      value: 'N8881765',
    },
    {
      id: 2,
      title: 'Bike Number',
      value: 'HR 26CN 5724',
    },
    // {
    //   id: 3,
    //   title: 'Cash',
    //   value: 45.5,
    // },
  ];

  const hanldeLinking = type => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${'DuuItt@gmail.com'}`);
      } else {
        Linking.openURL(`tel:${'1234567890'}`);
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
      navigation.navigate('parcel', {screen: 'home'});
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
    }, 30000);
    setTimeout(() => {
      navigation.navigate('pickSuccessfully');
    }, 32000);
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
    console.log('nativeEvent----------', nativeEvent);
    if (nativeEvent?.translationY >= 0) {
      setMinMaxHp(hp('34%'));
    } else {
      setMinMaxHp(hp('75%'));
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
                  origin={geoLocation}
                  markerArray={nearbyRider}
                  mapContainerView={{height: hp('82%')}}
                />
              )}
            </>
          ) : (
            <MapRoute
              origin={geoLocation}
              destination={destination}
              mapContainerView={{height: hp('58%')}}
            />
          )}
        </View>
        {searchArrive == 'search' ? (
          <View style={styles.containerSearchingView}>
            <View style={styles.innerSearchingView}>
              <View style={styles.textMainView}>
                <Text style={styles.searchingPartnerText}>
                  Searching Delivery Partner
                </Text>
                <Text style={styles.findNearbyText}>
                  Finding drivers nearby
                </Text>
              </View>
              <View style={{marginTop: '4%'}}>
                <Image
                  resizeMode="contain"
                  style={styles.bikeImage}
                  source={appImages.searchingRide}
                />
                <Progress.Bar
                  indeterminate={searching}
                  indeterminateAnimationDuration={1000}
                  progress={0.2}
                  width={wp('84%')}
                  height={hp('0.5%')}
                  color={colors.color43}
                  borderColor={colors.color95}
                  unfilledColor={colors.color95}
                />
              </View>
            </View>
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
                {minMaxHp == hp('75%') && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: '5%',
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 55, width: 55}}
                        source={appImages.avtarImage}
                      />
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: RFValue(12),
                          fontFamily: fonts.semiBold,
                          color: colors.black,
                          marginLeft: '4%',
                          width: wp('56.2%'),
                        }}>
                        Felicia Cudmore
                      </Text>
                      <Rating rating={'4.5'} />
                    </View>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.colorD9,
                        marginTop: '4%',
                        marginHorizontal: -20,
                      }}
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

          // <TouchableOpacity
          //   onPress={async () => {
          //     refRBSheet.current.open();
          //   }}
          //   activeOpacity={0.9}
          //   style={styles.containerDriverTouch}>
          //   <View style={styles.innerDriverView}>
          //     <DriverMeetPickup
          //       topLine={true}
          //       onPressDot={() => {
          //         onDotPress();
          //       }}
          //     />
          //   </View>
          // </TouchableOpacity>
        )}

        {/* <RBSheet
        height={hp('80%')}
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        keyboardAvoidingViewEnabled={Platform.OS == 'ios' ? true : false}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          // draggableIcon: {
          //   height: 0, // Hide draggable icon
          // },
        }}>
        <View style={{marginHorizontal: 20}}>
          <MeetingPickupComp
            firstText={'Meet at your pickup stop'}
            secondText={'Ride Details'}
            onPressDot={() => {
              onDotPress();
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <Image
              resizeMode="contain"
              style={{height: 55, width: 55}}
              source={appImages.avtarImage}
            />
            <Text
              numberOfLines={2}
              style={{
                fontSize: RFValue(12),
                fontFamily: fonts.semiBold,
                color: colors.black,
                marginLeft: '4%',
                width: wp('56.2%'),
              }}>
              Felicia Cudmore
            </Text>
            <Rating rating={'4.5'} />
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.colorD9,
              marginTop: '4%',
              marginHorizontal: -20,
            }}
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
            data={parcelInfo?.parcel_otp?.sender_otp?.toString()?.split('')}
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

          <View style={{marginLeft: '6%', alignSelf: 'center'}}>
            <HomeSlider data={sliderItems} />
          </View>
        </View>
      </RBSheet> */}

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
        />

        <PopUpCancelInstruction
          isVisible={visible}
          onClose={() => {
            setVisible(false);
          }}
          title={'Why do you want to cancel ?'}
          cancelRideInst={cancelRide}
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
            'This pickup has been offered to a driver right now, and should be confirmed within seconds.'
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
    backgroundColor: colors.white,
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
    height: '20%',
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
    height: hp('34%'),
    width: wp('100%'),
  },
  innerDriverView: {
    paddingHorizontal: 20,
    marginTop: '2%',
  },
  topLineView: {
    height:hp("0.5%"),
    backgroundColor: colors.colorD9,
    width: wp('15%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '3%',
  },
});
