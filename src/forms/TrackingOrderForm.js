import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {Surface} from 'react-native-paper';
import {colors} from '../theme/colors';
import {appImages, appImagesSvg} from '../commons/AppImages';
import Svg, {SvgXml} from 'react-native-svg';
import DriverTrackingProfileComp from '../components/DriverTrackingProfileComp';
import DriverTrackingComp from '../components/DriverTrackingComp';
import TextRender from '../components/TextRender';
import {currencyFormat} from '../halpers/currencyFormat';
import {FlatList} from 'react-native-gesture-handler';
import {rootStore} from '../stores/rootStore';
import Url from '../api/Url';
import TrackingDetailsComp from '../components/TrackingDetailsComp';
import AnimatedLoader from '../components/AnimatedLoader/AnimatedLoader';
import handleAndroidBackButton from '../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import OtpShowComp from '../components/OtpShowComp';
import ModalPopUp from '../components/ModalPopUp';
import MapRoute from '../components/MapRoute';
import socketServices from '../socketIo/SocketServices';
import {
  getCurrentLocation,
  setCurrentLocation,
} from '../components/GetAppLocation';

const trackArray = [
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
    status: 'pending',
  },
  {
    id: 3,
    name: 'Delivered',
    status: 'pending',
  },
];

const TrackingOrderForm = ({navigation}) => {
  const {ordersTrackOrder, orderTrackingList} = rootStore.orderStore;
  const {appUser} = rootStore.commonStore;
  const [loading, setLoading] = useState(
    orderTrackingList?.length?.length > 0 ? false : true,
  );
  const [isSelected, setIsSelected] = useState(0);
  const [trackedArray, setTrackedArray] = useState(orderTrackingList);
  const [trackingArray, setTrackingArray] = useState(trackArray);
  const [isModalTrack, setIsModalTrack] = useState(false);
  const [trackItem, setTrackItem] = useState({});
  const [origin, setOrigin] = useState({});

  // useEffect(() => {
  //   getTrackingOrder();
  // }, []);

  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      getTrackingOrder();
      socketServices.initailizeSocket();
    }, []),
  );

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
        console.log(
          'Remaining distance data-- tracking:',
          data,
          data?.location,
        );
        if (data && data?.location) {
          setOrigin(data?.location);
        }
      });

      // socketServices.on('testevent', data => {
      //   console.log('test event tracking', data);
      // });
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
          getSocketLocation(socketServices, trackItem);
        }, 1500);
      }, 10000);
      return () => {
        // This will run when the screen is unfocused
        clearInterval(intervalId);
      };
    }, [trackItem]),
  );

  const getSocketLocation = async (socketServices, trackItem) => {
    console.log('trackItem---', trackItem);
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
      rider_id: trackItem?.rider?._id,
      customer_id: appUser?._id,
      user_type: 'customer',
    };
    console.log(
      'Socket state tracking:',
      socketServices?.socket?.connected,
      request,
    );
    socketServices.emit('remaining-distance', request);
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data -- ', data);
      getTrackingOrder();
      setIsModalTrack(false);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const getTrackingOrder = async () => {
    const res = await ordersTrackOrder(handleLoading);
    setTrackedArray(res);
    setTrackItem(res?.length > 0 ? res[0] : {});
    setOrigin(res?.length > 0 ? res[0]?.sender_address?.geo_location : {});
  };
  console.log('trackItem---', trackItem);

  const handleLoading = v => {
    setLoading(v);
  };

  const hanldeLinking = type => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${'DuuItt@gmail.com'}`);
      } else {
        Linking.openURL(`tel:${'1234567890'}`);
      }
    }
  };

  const setTrackStatus = status => {
    switch (status) {
      case 'arrive_to_pick':
        return 0;
      case 'picked':
        return 1;
      case 'arrived_to_destination':
        return 2;
      case 'delivered':
        return 3;
      default:
        return -1;
    }
  };

  const onViewDetails = (status, index) => {
    // if (isSelected == index) {
    //   setIsSelected('');
    // } else {
    //   setIsSelected(index);
    // }
    setIsSelected(prev => (prev === index ? null : index));
    const res = setTrackStatus(status);
    // console.log('res--', res);
    const updatedTrackArray = trackingArray?.map((item, i) => {
      if (i <= res) {
        return {...item, status: 'completed'};
      } else {
        return {...item, status: 'pending'};
      }
    });

    setTrackingArray([...updatedTrackArray]);
  };

  const setTrackImage = status => {
    switch (status) {
      case 'food':
        return appImages.order1;
      case 'parcel':
        return appImages.order2;
      case 'ride':
        return appImages.order3;
    }
  };

  const renderItem = ({item, index}) => {
    console.log('item--', item, index);
    if (index == 0) {
      setTrackItem(item);
      setOrigin(item?.sender_address?.geo_location);
    }

    return (
      <View style={{marginHorizontal: 20}}>
        <TrackingDetailsComp
          onViewDetails={onViewDetails}
          item={item}
          xml={
            isSelected === index
              ? appImagesSvg.upGreenIcon
              : appImagesSvg.downGreenIcon
          }
          index={index}
        />
        {isSelected === index && (
          <Surface
            elevation={3}
            style={[
              styles.trackingSurfaceView,
              {height:item?.secure ? hp('62%') : hp('54.5%')},
            ]}>
            <View style={styles.innerTrackingView}>
              <DriverTrackingProfileComp
                item={{
                  image:
                    item?.rider?.profile_pic?.length > 0
                      ? item?.rider?.profile_pic
                      : setTrackImage(item?.order_type),

                  name: item?.rider?.name
                    ? item?.rider?.name
                    : 'Felicia Cudmore',
                  rating: '4.5',
                }}
                onMessage={() => {
                  hanldeLinking('email');
                }}
                onCall={() => {
                  hanldeLinking('call');
                }}
              />
              <View style={styles.lineView} />
              <DriverTrackingComp
                data={trackingArray}
                image={appImages.packetImage}
                //   bottomLine={true}
              />
              <View style={styles.lineView} />
              <TextRender
                title={'Cash'}
                value={currencyFormat(item?.total_amount)}
                bottomLine={false}
              />
              {item?.secure && (
                <>
                  <View style={styles.lineView} />
                  <OtpShowComp
                    title={'Parcel OTP'}
                    data={item?.parcel_otp?.receiver_otp?.toString()?.split('')}
                  />
                </>
              )}
              <View style={styles.lineView} />
              <TouchableOpacity
                onPress={() => {
                  setTrackItem(item);
                  setIsModalTrack(true);
                }}
                activeOpacity={0.8}
                style={styles.tarckTouch}>
                <View style={styles.trackMainView}>
                  <View style={styles.liveTextView}>
                    <Text style={styles.liveTrackText}>Live Track</Text>
                    <Text style={styles.parcelUsingText}>
                      You can also track your parcel using map
                    </Text>
                  </View>
                  <Image
                    style={styles.tarckImage}
                    source={appImages.mapTrackImage}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Surface>
        )}
      </View>
    );
  };

  return (
    <View style={styles.main}>
      {loading == true && trackedArray?.length == 0 ? (
        <AnimatedLoader type={'trackingOrderLoader'} />
      ) : (
        <View style={{flex: 1}}>
          {trackedArray?.length > 0 ? (
            <FlatList
              initialNumToRender={20}
              data={trackedArray}
              renderItem={renderItem}
              keyExtractor={item => item?._id?.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: hp('10%')}}
            />
          ) : (
            <View style={styles.noDataView}>
              <Text style={styles.noDataText}>No Data Found</Text>
            </View>
          )}
        </View>
      )}
      <ModalPopUp
        isVisible={isModalTrack}
        onClose={() => {
          setIsModalTrack(false);
        }}>
        <View style={styles.modalMainView}>
          <Text style={styles.liveTrackingText}>Live Tracking</Text>
          <View style={styles.mapRouteView}>
            <MapRoute
              origin={origin}
              destination={trackItem?.receiver_address?.geo_location}
              mapContainerView={{height: hp('60%')}}
            />
          </View>
        </View>
      </ModalPopUp>
    </View>
  );
};

export default TrackingOrderForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  trackingSurfaceView: {
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('62%'),
    marginTop: '3%',
    // justifyContent: 'flex-start',
  },
  innerTrackingView: {
    marginHorizontal: 20,
    marginTop: '4%',
  },
  lineView: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '4%',
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: RFValue(15),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  tarckTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: '-5%',
  },
  trackMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
  },
  liveTextView: {
    flex: 1,
    marginLeft: '4%',
    marginTop: '-3%',
  },
  liveTrackText: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  parcelUsingText: {
    fontSize: RFValue(11),
    fontFamily: fonts.regular,
    color: colors.black75,
    marginTop: '1%',
  },
  tarckImage: {
    marginRight: '2%',
    alignSelf: 'center',
    width: wp('21%'),
    height: hp('10%'),
    marginTop: '1%',
  },
  modalMainView: {
    backgroundColor: colors.white,
    height: hp('60%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  liveTrackingText: {
    fontSize: RFValue(16),
    fontFamily: fonts.bold,
    color: colors.black,
    marginLeft: '5%',
    marginTop: '4%',
  },
  mapRouteView: {
    marginHorizontal: '4%',
    marginTop: hp('2%'),
  },
});
