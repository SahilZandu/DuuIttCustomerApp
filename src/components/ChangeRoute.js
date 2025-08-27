// import React, {useEffect, useState} from 'react';
// import {
//   Pressable,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   FlatList,
// } from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {SvgXml} from 'react-native-svg';
// import {colors} from '../theme/colors';
// import {fonts} from '../theme/fonts/fonts';
// import {Strings} from '../translates/strings';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';

// const ChangeRoute = ({data, navigation}) => {

//   const onRoutePress =(item)=>{
//     if(item?.name == 'FOOD'){
//       navigation.navigate('food',{screen:'home'})
//     }else if(item?.name == 'RIDE'){
//       navigation.navigate('ride',{screen:'home'})
//     }else if(item?.name == 'PARCEL'){
//       navigation.navigate('parcel',{screen:'home'})
//     }
//     else{
//       navigation.navigate('dashborad',{screen:'home'})
//     }

//   }

//   const renderItem = ({item, i}) => {
//     return (
//       <TouchableOpacity
//         onPress={()=>{onRoutePress(item)}}
//         activeOpacity={0.8}
//         key={i}
//         style={{
//           justifyContent: 'space-evenly',
//           width: wp('28%'),
//           height: hp('18%'),
//           backgroundColor: colors.colorDo,
//           borderRadius: 10,
//           borderColor:colors.colorD6,
//           borderWidth:1.5,
//           marginTop: '2%',
//           margin: 6,
//         }}>
//         <SvgXml
//           style={{marginLeft: '14%', marginTop: '24%'}}
//           xml={item?.duIcon}
//         />
//         <Text
//           style={{
//             marginLeft: '14%',
//             marginTop: '18%',
//             fontSize: RFValue(15),
//             fontFamily: fonts.bold,
//             color: colors.color27,
//           }}>
//           {item?.name}
//         </Text>
//         <Image
//           resizeMode="contain"
//           style={{
//             alignSelf: 'center',
//             marginTop: '26%',
//             width: 90,
//             height: 90,
//           }}
//           source={item?.image}
//         />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View
//       style={{
//         marginTop: '3%',
//       }}>
//       <Text
//         style={{
//           fontSize: RFValue(13),
//           fontFamily: fonts.semiBold,
//           color: colors.black,
//           marginHorizontal: 10,
//         }}>
//         {Strings.chooseYourService}
//       </Text>
//       <View style={{flex: 1,
//       flexWrap: 'wrap',
//        marginHorizontal: 3}}>
//         <FlatList
//           nestedScrollEnabled={true}
//           scrollEnabled={false}
//           bounces={false}
//           style={{
//             marginTop: '1%',
//             alignSelf: 'center',
//           }}
//           contentContainerStyle={{paddingBottom: '1%'}}
//           showsVerticalScrollIndicator={false}
//           data={data}
//           renderItem={renderItem}
//           keyExtractor={item => item.id}
//           numColumns={3} // Set number of columns
//         />
//       </View>
//     </View>
//   );
// };

// export default ChangeRoute;

import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { Strings } from '../translates/strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { screenHeight } from '../halpers/matrics';
import { Surface } from 'react-native-paper';
import OrderIndicator from '../halpers/OrderIndicator';
import { rootStore } from '../stores/rootStore';
import { useFocusEffect } from '@react-navigation/native';
import CornerTriangle from '../halpers/OrderIndicator';

const ChangeRoute = ({ data, navigation }) => {
  const {
    ordersTrackOrder,
    orderTrackingList,
    getPendingForCustomer,
    setRideOrderInProgress,
    setParcelTrackingOrder,
    setParcelOrderInProgress,
  } = rootStore.orderStore;
  const { getCart, cartItemData } = rootStore.cartStore;
  const {
    getFoodOrderTracking,
    foodOrderTrackingList,
  } = rootStore.foodDashboardStore;
  const [incompletedParcelOrder, setIncompletedParcelOrder] = useState([])
  const [incompletedRideOrder, setIncompletedRideOrder] = useState([])
  const [trackedParcelOrder, setTrackedParcelOrder] = useState(orderTrackingList ?? [])
  const [foodTrackedArray, setFoodTrackedArray] = useState(foodOrderTrackingList ?? [])
  const [cartItems, setCartItems] = useState(cartItemData ?? {})


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  )

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('cancelOrder', data => {
      console.log('cancel Order data -- ', data);
      if (data?.order_type) {
        fetchData();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data --Ride ', data);
      if (data?.order_type) {
        fetchData();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        getIncompleteParcelOrder(),
        getTrackingParcelOrder(),
        getIncompleteRideOrder(),
        getFoodTrackingOrder(),
        getCartItemsFood()
      ]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getCartItemsFood = async () => {
    const cart = await getCart();
    console.log('user cart', cart);
    if (cart?.cart_items?.length > 0) {
      setCartItems(cart);
    }
    else {
      setCartItems({});
    }
  };

  const getFoodTrackingOrder = async () => {
    const res = await getFoodOrderTracking(handleTrackingLoading);
    setFoodTrackedArray(res);
  };

  const handleTrackingLoading = (v) => {
    console.log("v", v);

  }


  const getIncompleteParcelOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('parcel');
    console.log('resIncompleteOrder parcel--', resIncompleteOrder);

    if (resIncompleteOrder?.length > 0 &&
      (resIncompleteOrder[0]?.status !== 'pending'
      )) {
      setParcelOrderInProgress(resIncompleteOrder)
      setIncompletedParcelOrder(resIncompleteOrder);
    } else {
      setParcelOrderInProgress([])
      setIncompletedParcelOrder([])
    }
  };

  const getIncompleteRideOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('ride');
    console.log('resIncompleteOrder parcel--', resIncompleteOrder);

    if (resIncompleteOrder?.length > 0 &&
      (resIncompleteOrder[0]?.status !== 'pending')
    ) {
      setRideOrderInProgress(resIncompleteOrder)
      setIncompletedRideOrder(resIncompleteOrder);
    } else {
      setRideOrderInProgress([])
      setIncompletedRideOrder([])
    }
  };

  const getTrackingParcelOrder = async () => {
    const resTrack = await ordersTrackOrder(handleLoadingTrack);
    if (resTrack?.length > 0) {
      setParcelTrackingOrder(resTrack)
      setTrackedParcelOrder(resTrack);
    } else {
      setParcelTrackingOrder([])
      setTrackedParcelOrder([]);
    }
  };

  const handleLoadingTrack = v => {
    console.log('Track...', v);
  };


  const onRoutePress = item => {
    if (item?.name == 'FOOD') {
      navigation.navigate('food', { screen: 'home' });
    } else if (item?.name == 'RIDE') {
      navigation.navigate('ride', { screen: 'home' });
    } else if (item?.name == 'PARCEL') {
      navigation.navigate('parcel', { screen: 'home' });
    } else {
      navigation.navigate('dashborad', { screen: 'home' });
    }
  };


  const setIndicatorShow = (name, ride, parcel, parcelTrack, foodCart, foodTarcking) => {
    if (ride?.length > 0 && name == "RIDE") {
      return true
    } else if ((parcel?.length > 0 || parcelTrack?.length > 0) && name == "PARCEL") {
      return true
    }
    else if ((foodCart?.cart_items?.length > 0 || foodTarcking?.length > 0) && name == "FOOD") {
      return true
    }
    else {
      return false
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        <Surface
          elevation={1}
          style={{
            shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
            backgroundColor: colors.white,
            alignSelf: 'center',
            borderRadius: 10,
            height: hp('14%'),
            width: wp('88%'),
            marginTop: '7%',
            // paddingVertical: '5%',
          }}>
          {index % 2 == 0 ? (
            <TouchableOpacity
              onPress={() => {
                onRoutePress(item);
              }}
              activeOpacity={0.8}
              key={index}
              style={{
                flex: 1,
                flexDirection: 'row',
                // height: screenHeight(14),
                // backgroundColor: colors.white,
                // borderRadius: 10,
                // borderWidth: 1,
                // borderColor: colors.black30,
                // marginTop: '5%',
              }}>
              <View
                style={{ flex: 1, marginLeft: wp('5%'), marginTop: hp('2%') }}>
                <SvgXml xml={item?.duIcon} />
                <Text
                  style={{
                    fontSize: RFValue(15),
                    fontFamily: fonts.bold,
                    color: colors.color27,
                    marginTop: '2%',
                  }}>
                  {item?.name}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: fonts.regular,
                    color: colors.black75,
                    marginTop: '1%',
                    width: wp('45%'),
                  }}>
                  {item?.title}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: wp('3%'),
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    alignSelf: 'center',
                    width: wp('32%'),
                    height: 130,
                    bottom: hp('-1%'),
                  }}
                  source={item?.image}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                onRoutePress(item);
              }}
              activeOpacity={0.8}
              key={index}
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp('5%'),
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    alignSelf: 'center',
                    width: wp('32%'),
                    height: 130,
                    bottom: hp('-1%'),
                    left: wp('-2%'),
                  }}
                  source={item?.image}
                />
              </View>
              <View style={{
                marginLeft:
                  Platform.OS === 'ios' ? wp('5%')
                    : wp('7%'), marginTop: hp('2%')
              }}>
                <SvgXml xml={item?.duIcon} />
                <Text
                  style={{
                    fontSize: RFValue(15),
                    fontFamily: fonts.bold,
                    color: colors.color27,
                    marginTop: '2%',
                  }}>
                  {item?.name}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: fonts.regular,
                    color: colors.black75,
                    marginTop: '1%',
                    width: wp('45%'),
                  }}>
                  {item?.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Surface>
        {setIndicatorShow(item?.name, incompletedRideOrder, incompletedParcelOrder, trackedParcelOrder, cartItems, foodTrackedArray) && <CornerTriangle onPress={() => { onRoutePress(item) }} />}
        {/* {setIndicatorShow(item?.name, incompletedRideOrder, incompletedParcelOrder, trackedParcelOrder) && <OrderIndicator
          onPress={() => { onRoutePress(item); }}
          isHashOrders={s => console.log('s', s)}
        />
        } */}
      </>
    );
  };

  return (
    <View
      style={{
        marginTop: '3%',
        marginHorizontal: 10,
      }}>
      <Text
        style={{
          fontSize: RFValue(13),
          fontFamily: fonts.semiBold,
          color: colors.black,
        }}>
        {Strings.chooseYourService}
      </Text>
      <View
        style={{
          flex: 1,
        }}>
        <FlatList
          nestedScrollEnabled={true}
          scrollEnabled={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: '1%' }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        // numColumns={3} // Set number of columns
        />
      </View>
    </View>
  );
};

export default ChangeRoute;
