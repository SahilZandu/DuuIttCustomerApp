import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import CTA from '../components/cta/CTA';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
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
import PickDropImageComp from '../components/PickDropImageComp';
import DriverTrackingProfileComp from '../components/DriverTrackingProfileComp';
import DriverTrackingComp from '../components/DriverTrackingComp';
import MapRouteMarker from '../components/MapRouteMarker';
import {rootStore} from '../stores/rootStore';
import Modal from 'react-native-modal';
import MapRoute from '../components/MapRoute';
import BTN from '../components/cta/BTN';



const SearchingRideForm = ({navigation, route}) => {
  const {addParcelInfo, parcels_Cancel, parcelsFindRider} =
    rootStore.parcelStore;
  const refRBSheet = useRef(null);
  const refRBSheetTrack = useRef(null);
  const {paymentMethod} = route.params;
  const [searching, setSearching] = useState(true);
  const [searchArrive, setSearchArrive] = useState('search');
  const [trackingDriver, setTrackingDriver] = useState('otp');
  const [geoLocation, setGeoLocation] = useState({});
  const [destination, setDestination] = useState({});
  const [parcelInfo, setParcelInfo] = useState({});
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [riderLoading, setRiderLoading] = useState(false);
  const [nearbyRider, setNearByRider] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);

  console.log('paymentMethod--', paymentMethod, addParcelInfo);

  useEffect(() => {
    if (Object?.keys(addParcelInfo)?.length > 0) {
      setGeoLocation(addParcelInfo?.sender_address?.geo_location);
      setDestination(addParcelInfo?.receiver_address?.geo_location)
      setParcelInfo(addParcelInfo);
      setTimeout(() => {
        setSearching(false);
        onGetNearByRider(addParcelInfo);
      }, 1000);
    }
  }, [addParcelInfo]);

  useEffect(() => {
    setTimeout(() => {
      setSearchArrive('arrive');
      if (trackingDriver == 'confirm') {
        refRBSheetTrack.current.open();
      } else {
        refRBSheet.current.open();
      }
    }, 5000);
  }, []);

  const onGetNearByRider = async info => {
    console.log('info--', info);

    const value = {
      parcel_id: info?.customer_id,
      geo_location: info?.sender_address?.geo_location,
      paymentMode: paymentMethod === 'Cash' ? 'cash' : 'online',
    };

    const res = await parcelsFindRider(value, handleLoadingRider);
    console.log('res--', res);
    setNearByRider(res);
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
    {
      id: 3,
      title: 'Cash',
      value: 45.5,
    },
  ];

  const parcelOtp = [2, 4, 5, 6];

  const trackingArray = [
    {
      id: 0,
      name: 'Arrived to pick up location',
      status: 'completed',
    },
    {
      id: 1,
      name: 'Picked',
      status: 'completed',
    },
    {
      id: 2,
      name: 'Arrived to destination',
      status: 'inProgress',
    },
    {
      id: 3,
      name: 'Delivered',
      status: 'not Arrive',
    },
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
      parcel_id: addParcelInfo?.customer_id,
      reason: cancelReason,
    };

    await parcels_Cancel(value, onSuccess, handleLoading);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onSuccess = () => {
    setCancelVisible(false);
    setTimeout(() => {
      navigation.navigate('parcel', {screen: 'home'});
    },200);
  };

  return (
    <View style={styles.main}>
      <View style={styles.mapView}>
        {searchArrive == 'search' ? (
          <MapRouteMarker
            origin={geoLocation}
            markerArray={nearbyRider}
            mapContainerView={{height: hp('82%')}}
          />
        ) : (
          <MapRoute
             origin={geoLocation}
             destination={destination}
            mapContainerView={{height: hp('82%')}}
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
              <Text style={styles.findNearbyText}>Finding drivers nearby</Text>
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

            {/* <Spacer space={'11%'} />
            <CTA
              onPress={async () => {
                setSearchArrive('arrive');
                if (trackingDriver == 'confirm') {
                  refRBSheetTrack.current.open();
                } else {
                  refRBSheet.current.open();
                }
              }}
              title={'Cancel Pickup'}
              textTransform={'capitalize'}
              bottomCheck={10}
              backgroundColor={colors.white}
              labelColor={colors.main}
            /> */}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={async () => {
            if (trackingDriver == 'confirm') {
              refRBSheetTrack.current.open();
            } else {
              refRBSheet.current.open();
            }
          }}
          activeOpacity={0.9}
          style={styles.containerDriverTouch}>
          <View style={styles.innerDriverView}>
            {trackingDriver == 'confirm' ? (
              <DriverTrackingProfileComp
                topLine={true}
                item={{
                  image: appImages.avtarImage,
                  name: 'Felicia Cudmore',
                  rating: '4.5',
                }}
                onMessage={() => {
                  hanldeLinking('email');
                }}
                onCall={() => {
                  hanldeLinking('call');
                }}
              />
            ) : (
              <DriverArrivingComp
                topLine={true}
                title={'Pickup in 10 minutes'}
                onMessage={() => {
                  hanldeLinking('email');
                }}
                onCall={() => {
                  hanldeLinking('call');
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      )}

      {trackingDriver == 'confirm' ? (
        <RBSheet
          height={hp('52%')}
          ref={refRBSheetTrack}
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
          }}>
          <View style={{marginHorizontal: 20, marginTop: '-3%'}}>
            <DriverTrackingProfileComp
              item={{
                image: appImages.avtarImage,
                name: 'Felicia Cudmore',
                rating: '4.5',
              }}
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

            <DriverTrackingComp
              data={trackingArray}
              image={appImages.packetImage}
              bottomLine={true}
            />
            <TextRender
              title={'Tracking ID'}
              value={'N8881765'}
              bottomLine={false}
            />
          </View>
        </RBSheet>
      ) : (
        <RBSheet
          height={hp('78%')}
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
            <PickDropImageComp
              item={{pickup: 'TDI TAJ PLAZA Block-505', drop: 'TDI city'}}
              image={appImages.packetImage}
            />
            <View
              style={{
                height: 1,
                backgroundColor: colors.colorD9,
                marginTop: '7%',
                marginHorizontal: -20,
              }}
            />
            <OtpShowComp title={'Parcel OTP'} data={parcelOtp} />
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
            <Spacer space={'9%'} />
            <CTA
              onPress={async () => {
                if (trackingDriver == 'confirm') {
                  refRBSheetTrack.current.close();
                } else {
                  refRBSheet.current.close();
                }
                setTimeout(() => {
                  setVisible(true);
                }, 500);
              }}
              title={'Cancel Pickup'}
              textTransform={'capitalize'}
              backgroundColor={colors.white}
              labelColor={colors.main}
            />
          </View>
        </RBSheet>
      )}

      <Modal
        animationType="slide"
        isVisible={visible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{justifyContent: 'flex-end', margin: 0}}>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
          }}
          activeOpacity={0.8}
          style={{alignSelf: 'center'}}>
          <Image
            resizeMode="contain"
            style={{height: 45, width: 45}}
            source={appImages.crossClose} // Your icon image
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: '2%',
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingBottom: '12%',
              // height: hp('80%'),
            }}>
            <Spacer space={'2%'} />

            <View style={{marginHorizontal: 24}}>
              <Text
                style={{
                  fontSize: RFValue(16),
                  fontFamily: fonts.bold,
                  color: colors.black,
                  marginTop: '4%',
                }}>
                Why do you want to cancel ?
              </Text>

              {cancelRide?.map((item, index) => {
                return (
                  <View style={{justifyContent: 'center'}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setCancelReason(item?.title);
                        setVisible(false);
                        setTimeout(() => {
                          setCancelVisible(true);
                        }, 500);
                      }}
                      key={index}
                      style={{
                        flexDirection: 'row',
                        marginTop: '2%',
                        alignItems: 'center',
                        height: hp('7%'),
                      }}>
                      <Text
                        style={{
                          fontSize: RFValue(14),
                          fontFamily: fonts.regular,
                          marginLeft: '3%',
                          color: '#242424',
                        }}>
                        {item?.title}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: '#D9D9D9',
                        // marginTop: '1%',
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <Spacer space={'8%'} />
            <CTA
              title={'Wait for driver'}
              textTransform={'capitalize'}
              onPress={() => {
                setVisible(false);
              }}
              bottomCheck={1}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        isVisible={cancelVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{justifyContent: 'flex-end', margin: 0}}>
        <TouchableOpacity
          onPress={() => {
            setCancelVisible(false);
          }}
          activeOpacity={0.8}
          style={{alignSelf: 'center'}}>
          <Image
            resizeMode="contain"
            style={{height: 45, width: 45}}
            source={appImages.crossClose} // Your icon image
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: '2%',
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingBottom: '12%',
              // height: hp('80%'),
            }}>
            <Spacer space={'2%'} />

            <View style={{marginHorizontal: 24}}>
              <Text
                style={{
                  fontSize: RFValue(16),
                  fontFamily: fonts.bold,
                  color: colors.black,
                  marginTop: '4%',
                }}>
                Are you sure you want to cancel ?
              </Text>

              <Text
                style={{
                  fontSize: RFValue(13),
                  fontFamily: fonts.regular,
                  color: colors.color24,
                  marginTop: '6%',
                }}>
                This pickup has been offered to a driver right now, and should
                be confirmed within seconds.
              </Text>
            </View>
            <Spacer space={'9%'} />
            <View style={{flexDirection:'row',
            justifyContent:'space-evenly',
            alignItems:'center',marginHorizontal:10}}>
            <BTN
              title={'Cancel Request'}
              textTransform={'capitalize'}
              onPress={() => {
                onCancelRequest();
              }}
              backgroundColor={colors.white}
              labelColor={colors.main}
              loading={loading}
              width={wp('42%')}
              bottomCheck={1}
            />
            {/* <Spacer space={'4%'} /> */}
            <BTN
              width={wp('42%')}
              title={'Wait for driver'}
              textTransform={'capitalize'}
              onPress={() => {
                setCancelVisible(false);
              }}
              bottomCheck={1}
            />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    justifyContent: 'center',
    height: '11%',
    width: wp('100%'),
  },
  innerDriverView: {
    paddingHorizontal: 20,
    marginTop: '2%',
  },
});
