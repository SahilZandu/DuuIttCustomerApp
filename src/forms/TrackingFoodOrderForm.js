import React, { useCallback, useEffect, useState } from 'react';
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
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';
import { Surface, useTheme } from 'react-native-paper';
import { colors } from '../theme/colors';
import { appImages, appImagesSvg } from '../commons/AppImages';
import DriverTrackingProfileComp from '../components/DriverTrackingProfileComp';
import DriverTrackingComp from '../components/DriverTrackingComp';
import TextRender from '../components/TextRender';
import { currencyFormat } from '../halpers/currencyFormat';
import { FlatList } from 'react-native-gesture-handler';
import { rootStore } from '../stores/rootStore';
import AnimatedLoader from '../components/AnimatedLoader/AnimatedLoader';
import handleAndroidBackButton from '../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import OtpShowComp from '../components/OtpShowComp';
import ModalPopUp from '../components/ModalPopUp';
import MapRoute from '../components/MapRoute';
import TrackingFoodDetailsComp from '../components/TrackingFoodDetailsComp';
import TouchTextIconComp from '../components/TouchTextIconComp';
import CancelOrderPopUp from '../screens/DUFood/Components/CancelOrderPopUp';

const trackArray = [
  {
    id: 0,
    name: 'Arrived to pick up location',
    status: 'completed',
  },
  {
    id: 1,
    name: 'Picked',
    status: 'packing_processing',
  },
  {
    id: 2,
    name: 'Arrived to destination',
    status: 'cooking',
  },
  {
    id: 3,
    name: 'Delivered',
    status: 'waiting_for_confirmation',
  },
];

const TrackingFoodOrderForm = ({ navigation }) => {
  const { getFoodOrderTracking, foodOrderTrackingList } =
    rootStore.foodDashboardStore;
  const { appUser } = rootStore.commonStore;
  const { unseenMessages, setChatNotificationStatus, setChatData } = rootStore.chatStore;
  const [loading, setLoading] = useState(
    foodOrderTrackingList?.length?.length > 0 ? false : true,
  );
  const [isSelected, setIsSelected] = useState(null);
  const [trackedArray, setTrackedArray] = useState(foodOrderTrackingList);
  const [trackingArray, setTrackingArray] = useState(trackArray);
  const [isModalTrack, setIsModalTrack] = useState(false);
  const [trackItem, setTrackItem] = useState({});
  const [isSelectedItem, setIsSelectedIsItem] = useState(foodOrderTrackingList[0] ?? {});
  const [origin, setOrigin] = useState({});
  const [isCancelOrder, setIsCancelOrder] = useState(false)
  const [checkChatMsg, setCheckChatMsg] = useState([])


  useFocusEffect(
    useCallback(() => {
      setChatNotificationStatus(true)
      handleAndroidBackButton(navigation);
      getTrackingOrder();
    }, []),
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data -- ', data);
      if (data?.order_type == 'food') {
        getTrackingOrder();
        setIsModalTrack(false);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('picked', data => {
      console.log('picked data -- ', data);
      if (data?.order_type == 'food') {
        getTrackingOrder();
        setIsModalTrack(false);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('acceptedFoodOrder', data => {
      console.log('acceptedFoodOrder data -- ', data);
      if (data?.order_type == 'food') {
        getTrackingOrder();
        setIsModalTrack(false);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('foodOrderUpdate', data => {
      console.log('foodOrderUpdate data -- ', data);
      if (data?.order_type == 'food') {
        getTrackingOrder();
        setIsModalTrack(false);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);


  const onChat = (data) => {
    setChatData([])
    let newCheckMsg = [...checkChatMsg]
    const filterCheckMsg = newCheckMsg?.filter((item, i) => {
      return item?._id !== data?._id
    })

    let itemData = trackedArray?.filter((item, i) => {
      return item?._id == data?._id
    })

    setCheckChatMsg(filterCheckMsg);
    setTimeout(() => {
      navigation.navigate("chat", { item: itemData?.length > 0 ? itemData[0] : data })
    }, 500)

  }


  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('chatData', data => {
      console.log('chatData Order data -- ', data);
      if (data?.order_type == 'food') {
        let newMsg = [...checkChatMsg]
        const checkMsg = newMsg?.find(item => item?.rider?._id === data?.rider?._id);
        if ((checkMsg && checkMsg?.rider)) {
          setCheckChatMsg(newMsg)
        } else {
          newMsg.push(data)
          setCheckChatMsg(newMsg)
        }
        // checkUnseenMsg(data);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('chatPage', data => {
      console.log('chatPagedata -- ', data);
      if (data?.order_type == 'food') {
        setTimeout(() => {
          onChat(data);
        }, 500);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const checkUnseenMsg = async (data) => {
    let req = {
      orderId: data?._id,
      senderRole: 'rider'
    }
    const res = await unseenMessages(req);
    console.log("res unseenMessages", res);

  }


  const getTrackingOrder = async () => {
    const res = await getFoodOrderTracking(handleLoading);
    setTrackedArray(res);
    setTrackItem(res?.length > 0 ? res[0] : {});
    setOrigin(res?.length > 0 ? res[0]?.sender_address?.geo_location : {});
  };
  // console.log('trackItem---', trackItem);

  const handleLoading = v => {
    setLoading(v);
  };

  const hanldeLinking = (item, type) => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${item?.rider?.email ?? 'DuuItt@gmail.com'}`);
      } else {
        Linking.openURL(`tel:${item?.rider?.phone ?? '1234567890'}`);
      }
    }
  };

  const setTrackStatus = status => {
    switch (status) {
      case 'waiting_for_confirmation':
        return 0;
      case 'cooking':
        return 0;
      case 'packing_processing':
        return 0;
      case 'ready_to_pickup':
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

  useEffect(() => {
    if (trackedArray?.length > 0) {
      onViewDetailsStatus();
    }
  }, [])

  const onViewDetailsStatus = () => {
    setIsSelected(0);
    setIsSelectedIsItem(trackedArray[0])
    const res = setTrackStatus(trackedArray[0]?.status);
    // console.log('res--', res);
    const updatedTrackArray = trackingArray?.map((item, i) => {
      if (i <= res) {
        return { ...item, status: 'completed' };
      } else {
        return { ...item, status: 'waiting_for_confirmation' };
      }
    });

    setTrackingArray([...updatedTrackArray]);
  };



  const onViewDetails = (status, index) => {
    setIsSelected(prev => (prev === index ? null : index));
    const res = setTrackStatus(status);
    // console.log('res--', res);
    setIsSelectedIsItem(trackedArray[index])
    const updatedTrackArray = trackingArray?.map((item, i) => {
      if (i <= res) {
        return { ...item, status: 'completed' };
      } else {
        return { ...item, status: 'waiting_for_confirmation' };
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
      default:
        return appImages.order1;
    }
  };

  const moreOptions = [

    {
      id: '0',
      title: 'Help Support',
      onPress: () => {
        navigation.navigate('customerSupport');
      },
      icon: appImagesSvg.customerSupport,
      show: true,
      disable: false,
    },
    {
      id: '1',
      title: 'Order Details',
      onPress: () => {
        navigation.navigate('orderDetails', { item: isSelectedItem })
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
    {
      id: '3',
      title: 'Cancel Order',
      onPress: () => {
        setIsCancelOrder(true);
      },
      icon: appImagesSvg.cancelOrderSvg,
      show: true,
      disable: false,
    },

  ];

  const renderItem = ({ item, index }) => {
    console.log('item--renderItem', item, index, item?.rider);
    if (index == 0) {
      setTrackItem(item);
      //   setOrigin(item?.sender_address?.geo_location);
    }
    return (
      <View style={{ marginHorizontal: 20 }}>
        <TrackingFoodDetailsComp
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
              { height: item?.rider?._id?.length > 0 ? hp('55%') : hp('47%') },
            ]}>
            <View style={styles.innerTrackingView}>
              {item?.rider?._id?.length > 0 && (
                <>
                  <DriverTrackingProfileComp
                    item={{
                      image:
                        item?.rider?.profile_pic?.length > 0
                          ? item?.rider?.profile_pic
                          : setTrackImage(item?.rider?.order_type),

                      name: item?.rider?.name
                        ? item?.rider?.name
                        : 'DuuItt Rider',
                      rating: item?.rider?.riderReviews?.average_rating ?? '4.5',
                    }}
                    onMessage={() => {
                      // hanldeLinking(item, 'email');
                      onChat(item)
                    }}
                    onCall={() => {
                      hanldeLinking(item, 'call');
                    }}
                  />
                  <View style={styles.lineView} />
                </>
              )}
              <DriverTrackingComp
                data={trackingArray}
                image={appImages.routeFood}
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
                  navigation.navigate('trackOrderPreparing', { item: item });
                  setTrackItem(item);
                  // setIsModalTrack(true);
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
                    resizeMode={'contain'}
                    style={styles.tarckImage}
                    source={appImages.mapTrackImage}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Surface>
        )}
        {isSelected === index && (
          <Surface
            elevation={3}
            style={[
              styles.trackingDetailsSurfaceView,
              { height: hp('22%') },
            ]}>
            <TouchTextIconComp firstIcon={true} data={moreOptions} />
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
        <View style={{ flex: 1 }}>
          {trackedArray?.length > 0 ? (
            <FlatList
              initialNumToRender={20}
              data={trackedArray}
              renderItem={renderItem}
              keyExtractor={item => item?._id?.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp('10%') }}
            />
          ) : (
            <View style={styles.noDataView}>
              <Text style={styles.noDataText}>No Data Found</Text>
            </View>
          )}
        </View>
      )}
      <CancelOrderPopUp
        visible={isCancelOrder}
        item={isSelectedItem}
        onClose={() => setIsCancelOrder(false)}
        refershData={() => { getTrackingOrder() }}
      />

      {/* <ModalPopUp
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
              mapContainerView={{ height: hp('60%') }}
            />
          </View>
        </View>
      </ModalPopUp> */}
    </View>
  );
};

export default TrackingFoodOrderForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  trackingSurfaceView: {
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('53%'),
    marginTop: '3%',
    // justifyContent: 'flex-start',
  },
  trackingDetailsSurfaceView: {
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('53%'),
    marginTop: '3%',
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
