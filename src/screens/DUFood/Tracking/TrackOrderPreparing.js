import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, DeviceEventEmitter, Linking } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fonts } from '../../../theme/fonts/fonts';
import { appImages, appImagesSvg } from '../../../commons/AppImages';
import { colors } from '../../../theme/colors';
import FoodSlider from '../../../components/slider/foodSlider';
import { silderArrayOrder } from '../../../stores/DummyData/Home';
import FastImage from 'react-native-fast-image';
import { SvgXml } from 'react-native-svg';
import AppInputScroll from '../../../halpers/AppInputScroll';
import MapRoute from '../../../components/MapRoute';
import ReviewsRatingComp from '../../../components/ReviewsRatingComp';
import ReviewsRatingFoodComp from '../../../components/ReviewRatingFoodComp';
import Url from '../../../api/Url';
import socketServices from '../../../socketIo/SocketServices';
import { getCurrentLocation, setCurrentLocation } from '../../../components/GetAppLocation';
import { rootStore } from '../../../stores/rootStore';
import { useFocusEffect } from '@react-navigation/native';
import { Wrapper } from '../../../halpers/Wrapper';


export default function TrackOrderPreparing({ navigation, route }) {
  const { item } = route.params
  const { appUser } = rootStore.commonStore;
  const [sliderItems, setSliderItems] = useState(silderArrayOrder);
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  const [orderStep, setOrderStep] = useState(0);
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [itemDetails, setItemDetails] = useState(item ?? {})
  const [arivelTime, setArivelTime] = useState(item?.arrival_time ?? '0 Min')

  console.log("item,itemDetails-----", item, itemDetails);

  useEffect(() => {
    if (item) {
      setItemDetails(item)
      setArivelTime(item?.arrival_time == 0 ? '0 Min' : item?.arrival_time ?? '0 Min')
      setOrigin(item?.rider?.current_location ?? item?.sender_address?.geo_location)
      setDestination(item?.receiver_address?.geo_location ?? {})

      switch (item?.status) {
        case 'waiting_for_confirmation':
          setOrderStep(0);
          break;
        case 'cooking':
        case 'packing_processing':
        case 'ready_to_pickup':
          setOrderStep(1);
          break;
        case 'picked':
          setOrderStep(2);
          break;
        default:
          setOrderStep(0)
      }
    }

  }, [item]);


  const getOrderStatusDetailsTitle = (status) => {
    switch (status) {
      case 'waiting_for_confirmation':
        return 'Waiting for Restaurant Confirm';
      case 'cooking':
        return 'Your Order is Being Cooked';
      case 'packing_processing':
        return 'Packing Your Delicious Order';
      case 'ready_to_pickup':
        return 'Order Ready for Pickup';
      case 'picked':
        return 'Rider is On the Way';
      default:
        return 'Your Order Status Updated';
    }
  };


  const getOrderStatusDetailsDes = (status) => {
    switch (status) {
      case 'waiting_for_confirmation':
        return 'The restaurant is reviewing your order. Please wait.';
      case 'cooking':
        return 'Your food is being freshly prepared by the chef.';
      case 'packing_processing':
        return 'Your order is being safely packed for delivery.';
      case 'ready_to_pickup':
        return 'The food is ready and waiting to be picked up.';
      case 'picked':
        return 'The rider has picked up your order and is on the way.';
      default:
        return 'Your order status has been updated.';
    }
  };


  useEffect(() => {
    if (itemDetails) {
      setOrigin(itemDetails?.rider?.current_location ?? itemDetails?.sender_address?.geo_location)
      setDestination(itemDetails?.receiver_address?.geo_location)
      switch (itemDetails?.status) {
        case 'waiting_for_confirmation':
          setOrderStep(0);
          break;
        case 'cooking':
        case 'packing_processing':
        case 'ready_to_pickup':
          setOrderStep(1);
          break;
        case 'picked':
          setOrderStep(2);
          break;
        default:
          setOrderStep(0)
      }

    }

  }, [itemDetails])


  useFocusEffect(
    useCallback(() => {
      if (!socketServices.isSocketConnected()) {
        socketServices.initailizeSocket();
      }
      setCurrentLocation();
      if (itemDetails?.rider?._id?.length > 0) {
        const intervalId = setInterval(() => {
          setCurrentLocation();
          setTimeout(() => {
            getSocketLocation(socketServices, itemDetails);
          }, 1500);
        }, 10000);
        return () => {
          // This will run when the screen is unfocused
          clearInterval(intervalId);
        };
      }
    }, [itemDetails]),
  );

  // const onChat = (data) => {
  //     setChatData([])
  //     let newCheckMsg = [...checkChatMsg]
  //     const filterCheckMsg = newCheckMsg?.filter((item, i) => {
  //       return item?._id !== data?._id
  //     })

  //     let itemData = trackedArray?.filter((item, i) => {
  //       return item?._id == data?._id
  //     })

  //     setCheckChatMsg(filterCheckMsg);
  //     setTimeout(() => {
  //       navigation.navigate("chat", { item: itemData?.length > 0 ? itemData[0] : data })
  //     }, 500)

  //   }


  //   useEffect(() => {
  //     const subscription = DeviceEventEmitter.addListener('chatData', data => {
  //       console.log('chatData Order data -- ', data);
  //       if (data?.order_type == 'food') {
  //         let newMsg = [...checkChatMsg]
  //         const checkMsg = newMsg?.find(item => item?.rider?._id === data?.rider?._id);
  //         if ((checkMsg && checkMsg?.rider)) {
  //           setCheckChatMsg(newMsg)
  //         } else {
  //           newMsg.push(data)
  //           setCheckChatMsg(newMsg)
  //         }
  //         // checkUnseenMsg(data);
  //       }
  //     });
  //     return () => {
  //       subscription.remove();
  //     };
  //   }, []);

  //   useEffect(() => {
  //     const subscription = DeviceEventEmitter.addListener('chatPage', data => {
  //       console.log('chatPagedata -- ', data);
  //       //  getTrackingOrder();
  //       if (data?.order_type == 'food') {
  //         setTimeout(() => {
  //           onChat(data);
  //         }, 500);
  //       }
  //     });
  //     return () => {
  //       subscription.remove();
  //     };
  //   }, []);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let query = {
        lat: getLocation('lat')?.toString(),
        lng: getLocation('lng')?.toString(),
        user_id: appUser?._id,
        user_type: 'customer',
        fcm_token: appUser?.fcm_token,
      };
      let data = {
        order_id: itemDetails?._id ?? item?._id
      }
      socketServices.emit('track-order', data);
      if (itemDetails?.rider?._id?.length > 0) {
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
      }

      socketServices.on('testevent', data => {
        console.log('test event tracking food order', data);
      });

      socketServices.on('track-order-response', data => {
        console.log('track-order-response food order', data);
        if (data?.arrival_to_customer?.length > 0) {
          setArivelTime(data?.arrival_to_customer)
        } else {
          setArivelTime('0 Min')
        }
      });

    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);


  const getSocketLocation = async (socketServices, trackItem) => {
    // console.log('trackItem---', trackItem);
    const { appUser } = rootStore.commonStore;
    let query = {
      lat: getLocation('lat')?.toString(),
      lng: getLocation('lng')?.toString(),
      user_id: appUser?._id,
      user_type: 'customer',
      fcm_token: appUser?.fcm_token,
    };
    socketServices.emit('update-location', query);

    let data = {
      order_id: itemDetails?._id ?? item?._id
    }
    socketServices.emit('track-order', data);

    let request = {
      lat: getLocation('lat')?.toString(),
      lng: getLocation('lng')?.toString(),
      rider_id: trackItem?.rider?._id,
      customer_id: appUser?._id,
      user_type: 'customer',
    };
    // console.log(
    //   'Socket state tracking:',
    //   socketServices?.socket?.connected,
    //   request,
    // );
    socketServices.emit('remaining-distance', request);
  };


  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data Food -- ', data);
      // setIsReviewRider(true)
      if (data?.order_type == 'food') {
        setTimeout(() => {
          navigation?.goBack();
        }, 100)
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
        setItemDetails(data)
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('picked', data => {
      console.log('picked data --Food ', data);
      if (data?.order_type == 'food') {
        setItemDetails(data)
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);



  const hanldeLinking = (type, item) => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${'DuuItt@gmail.com'}`);
      } else {
        Linking.openURL(`tel:${item?.rider?.phone ?? '1234567890'}`);
      }
    }
  };

  const onChat = (data) => {
    navigation.navigate("chat", { item: data })

  }


  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
    >
      <View style={styles.container}>
        <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
          <View>
            <View style={styles.restaurantConatiner}>
              {((origin?.lng && destination?.lng) && orderStep == 2) ? (
                <MapRoute
                  orderData={itemDetails}
                  origin={origin}
                  destination={destination}
                  mapContainerView={{ height: hp('45%') }}
                />
              ) : (
                <FastImage
                  style={styles.topImage}
                  source={
                    orderStep === 0
                      ? appImages.preparingFood
                      : appImages.cookingFood

                  }
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
              <View style={styles.upperLightGreenView}>
                <View style={styles.chefTextView}>
                  <Text style={styles.chefText}>
                    {getOrderStatusDetailsTitle(itemDetails?.status ?? item?.status)}
                    {/* {orderStep === 1
                    ? 'Chef is cooking the food'
                    : orderStep === 2
                      ? 'Chef prepared the food'
                      : 'Chef is preparing the food'} */}
                  </Text>
                  <Text numberOfLines={2} style={styles.waitingForText}>
                    {getOrderStatusDetailsDes(itemDetails?.status ?? item?.status)}
                    {/* {orderStep === 1
                    ? 'Making the best quality food for you'
                    : orderStep === 2
                      ? 'Waiting for the delivery partner for pickup'
                      : 'Making the best quality food for you'} */}

                  </Text>
                </View>
                <View style={styles.arivalInMainView}>
                  <View style={styles.arivalInView}>
                    <Text style={styles.arriveInText}>Arival in</Text>
                    <Text style={styles.mintText}> {arivelTime ?? itemDetails?.arrival_time ?? '0 Min'} </Text>
                  </View>
                  <Text style={styles.onTimeView}>On time</Text>
                </View>
              </View>
            </View>

            {orderStep === 2 ? (
              <View style={styles.riderMainView}>
                <Image
                  resizeMode="cover"
                  source={
                    (item?.rider && item?.rider?.profile_pic?.length > 0) ? {
                      uri: item?.rider?.profile_pic
                    } :
                      appImages.avtarImage
                  }
                  style={styles.riderImage}
                />
                <View style={styles.nameRateView}>
                  <Text numberOfLines={1} style={styles.riderName}>{itemDetails?.rider?.name}</Text>
                  <View style={styles.ratingView}>
                    <SvgXml xml={appImagesSvg.whiteStar} />
                    <Text style={styles.ratingText}>{(itemDetails?.rider?.riderReviews?.average_rating?.toFixed(1)) ?? 0}</Text>
                  </View>
                </View>
                <View style={styles.phoneMsgImage}>
                  <TouchableOpacity
                    onPress={() => {
                      //  hanldeLinking('email', itemDetails) 
                      onChat(itemDetails ?? item)
                    }}
                    activeOpacity={0.8}>
                    <Image
                      resizeMode="contain"
                      style={{ width: 34, height: 34 }}
                      source={appImages.chat}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { hanldeLinking('call', itemDetails) }}
                    activeOpacity={0.8}>
                    <SvgXml xml={appImagesSvg.phone} />

                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.getDriverView}>
                <SvgXml xml={appImagesSvg.bikeSvg} />
                <View style={styles.getDriverInnerView}>
                  <Text style={styles.getDriverText}>
                    You’ll get a driver when food’s almost ready
                  </Text>
                  <Text style={styles.youOnTimeText}>
                    Deliver the food to you on time
                  </Text>
                </View>
                <Image
                  resizeMode="cover"
                  style={styles.trackedBikeImage}
                  source={appImages.trackBikeMap}
                />
              </View>
            )}

            <View style={styles.sliderMainView}>
              <View style={styles.sliderInnerView}>
                <FoodSlider
                  data={sliderItems}
                  oneCard={true}
                  imageWidth={wp('90%')}
                  imageHeight={hp('18%')}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              activeOpacity={0.8}
              style={styles.backBtnView}>
              <SvgXml
                xml={
                  orderStep === 2
                    ? appImagesSvg.backArrow
                    : appImagesSvg.whitebackArrow
                }
              />
            </TouchableOpacity>
          </View>
        </AppInputScroll>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  restaurantConatiner: {
    flex: 1,
    backgroundColor: colors.appBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: wp('100%'),
    height: hp('40%'),
  },
  upperLightGreenView: {
    width: wp('100%'),
    backgroundColor: colors.colorD6,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: hp('-3%'),
    flexDirection: 'row',
  },
  chefTextView: {
    // padding: wp('6%'),
    width: wp('54%'),
    height: hp('10%'),
    marginHorizontal: 20,
    marginTop: '3%'
  },
  chefText: {
    fontFamily: fonts.bold,
    color: colors.black,
    fontSize: RFValue(11),
  },
  waitingForText: {
    fontFamily: fonts.regular,
    color: colors.color51,
    fontSize: RFValue(10),
    marginTop: '3%',
    lineHeight: 20
  },
  arivalInMainView: {
    marginTop: hp('-3%'),
    alignItems: 'center',
    alignContent: 'center',
  },
  arivalInView: {
    alignItems: 'center',
    backgroundColor: colors.main,
    alignSelf: 'flex-start',
    borderRadius: 10,
    elevation: 2,
    // padding: wp('5%'),
    height: hp('10%'),
    width: wp('30%'),
    shadowOffset: { width: -1, height: 6 },
  },
  arriveInText: {
    fontFamily: fonts.bold,
    color: colors.white,
    fontSize: RFValue(16),
    marginTop: '7%'
  },
  mintText: {
    fontFamily: fonts.bold,
    color: colors.white,
    fontSize: RFValue(11),
    marginTop: '5%'
  },
  onTimeView: {
    fontFamily: fonts.bold,
    color: colors.main,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 5,
    paddingHorizontal: '2%',
    elevation: 2,
    overflow: 'hidden',
    fontSize: RFValue(12),
    marginTop: hp('-2%'),
    marginLeft: 20,
    marginEnd: 20,
  },
  riderMainView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    // margin: 20,
    // padding: 10,
    height: hp("10%"),
    borderRadius: 10,
    marginTop: "4%",
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingHorizontal: wp('4%'),
    shadowOffset: { width: 0, height: 6 },
    marginBottom: '3%',
    marginHorizontal: 20

  },
  riderImage: {
    borderRadius: 100,
    width: 60,
    height: 60,
  },
  nameRateView: {
    paddingStart: 10,
    paddingEnd: 10,
    width: wp('47%'),
  },
  riderName: {
    fontFamily: fonts.bold,
    color: colors.black,
    fontSize: RFValue(12),
  },
  ratingView: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 20,
    width: wp('13%'),
    flexDirection: 'row',
    backgroundColor: colors.colorFA,
    paddingStart: 6,
    paddingEnd: 6,
    paddingTop: 4,
    paddingBottom: 4,
  },
  ratingText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: RFValue(12),
  },
  phoneMsgImage: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  getDriverView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingHorizontal: wp('6%'),
    shadowOffset: { width: 0, height: 6 },
  },
  getDriverInnerView: {
    paddingStart: 10,
    paddingEnd: 10,
    width: wp('50%'),
  },
  getDriverText: {
    fontFamily: fonts.bold,
    color: colors.black,
    fontSize: RFValue(12),
  },
  youOnTimeText: {
    fontFamily: fonts.medium,
    color: colors.color5E,
    fontSize: RFValue(11),
  },
  trackedBikeImage: {
    width: 60,
    height: 80,
    marginTop: 10,
    marginBottom: 10,
  },
  sliderMainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderInnerView: {
    alignContent: 'center',
  },
  backBtnView: {
    position: 'absolute',
    backgroundColor: colors.color3D10,
    top: '1%',
    left: '3%',
    padding: '1%',
    borderRadius: 10,
  },
});
