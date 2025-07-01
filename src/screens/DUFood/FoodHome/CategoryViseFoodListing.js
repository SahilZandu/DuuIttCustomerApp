import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Image,
  FlatList,
  DeviceEventEmitter,
  Text,
  StyleSheet,
} from 'react-native';
import { appImages } from '../../../commons/AppImages';
import Header from '../../../components/header/Header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import { setCurrentLocation } from '../../../components/GetAppLocation';
import { rootStore } from '../../../stores/rootStore';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import DashboardFilters from './DashboardFilters';
import RestaurantsCard from '../../../components/Cards/RestaurantsCard';
import DashboardCartBtn from '../Components/DashboardCartBtn';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../theme/fonts/fonts';
import { colors } from '../../../theme/colors';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import PopUp from '../../../components/appPopUp/PopUp';

export default function CategoryViseFoodListing({ navigation, route }) {
  const { category } = route.params;

  const { appUser } = rootStore.commonStore;
  const { deleteCart, getCart, getRestraurent } =
    rootStore.cartStore;
  const { restaurantListForDishCategory, restaurantCustomerLikeDislike } =
    rootStore.foodDashboardStore;
  const [restoInfo, setRestoInfo] = useState({});
  const [cartItems, setcartItems] = useState({});
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [internet, setInternet] = useState(true);
  const [relatedRestaurant, setRelatedRestaurant] = useState([]);
  const [relatedRestFilter, setRelatedRestFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRemoveCart, setIsRemoveCart] = useState(false);

  const topRestaurentsList = [
    {
      id: '1',
      name: 'Saurya FastFood',
      imageUrl: appImages.foodIMage,
      veg_nonveg: 'veg',
    },
    {
      id: '2',
      name: 'Saurya FastFood',
      imageUrl: appImages.foodIMage,
      veg_nonveg: 'veg',
    },
    {
      id: '3',
      name: 'Saurya FastFood',
      imageUrl: appImages.foodIMage,
      veg_nonveg: 'veg',
    },
    {
      id: '4',
      name: 'Saurya FastFood',
      imageUrl: appImages.foodIMage,
      veg_nonveg: 'veg',
    },
    // Add more restaurants as needed
  ];

  useFocusEffect(
    useCallback(() => {
      console.log('category', category);
      checkInternet();
      handleAndroidBackButton(navigation);
      setCurrentLocation();
      onUpdateUserInfo();
      onRestaurentInfo();
      getCartItemsCount();
    }, []),
  );

  useEffect(() => {
    getRelatedRestaurantList();
  }, [category]);

  const getRelatedRestaurantList = async () => {
    const res = await restaurantListForDishCategory(category, handleLoading);
    console.log('res---getRelatedRestaurantList', res);
    setRelatedRestaurant(res);
    setRelatedRestFilter(res);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onUpdateUserInfo = () => {
    const { appUser } = rootStore.commonStore;
    setAppUserInfo(appUser);
  };
  const onRestaurentInfo = async () => {
    const restInfoo = await getRestraurent();

    console.log('restaurentInfo>', restInfoo);
    if (restInfoo?.restaurentname != undefined) {
      setRestoInfo(restInfoo);
    } else {
      setRestoInfo({});
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


  const onDeleteCart = async (showPopUp) => {
    const deleteCartData = await deleteCart(cartItems, showPopUp);
    console.log('deleteCartData--', deleteCartData);
    if (deleteCartData?.restaurant_id?.length > 0) {
      setIsRemoveCart(false);
      getCartItemsCount();
    } else {
      setIsRemoveCart(false);
    }
  };

  const handleLikeUnlike = async item => {
    const likeUnLikeArray = await relatedRestaurant?.map((data, i) => {
      if (data?.restaurant?._id == item?._id) {
        return {
          ...data,
          restaurant: {
            ...data.restaurant,
            likedRestaurant: data?.restaurant?.likedRestaurant ? false : true,
          },
        };
      } else {
        return { ...data };
      }
    });

    const request = {
      id: item?._id,
      like: item?.likedRestaurant == true ? false : true,
    };
    setRelatedRestaurant([...likeUnLikeArray]);
    console.log('item--handleLikeUnlike', likeUnLikeArray, item);
    const resLikeUnLike = await restaurantCustomerLikeDislike(request);
    // console.log("resLikeUnLike---",resLikeUnLike);
    if (resLikeUnLike?.statusCode == 200) {
      setRelatedRestaurant([...likeUnLikeArray]);
      setRelatedRestFilter([...likeUnLikeArray]);
    } else {
      setRelatedRestaurant([...relatedRestaurant]);
      setRelatedRestFilter([...relatedRestFilter]);
    }
  };

  function topRestaurentItem({ item, index }) {
    return (
      <View key={index}>
        <RestaurantsCard
          item={item?.restaurant}
          navigation={navigation}
          onLike={item => {
            handleLikeUnlike(item);
          }}
        />
      </View>
    );
  }

  const getCartItemsCount = async c => {
    const cart = await getCart();
    console.log('user cart', cart);

    if (cart?.food_item?.length > 0) {
      setcartItems(cart);
    } else {
      setcartItems({});
    }
  };

  const loadMoredata = () => {
    console.log('load more');
    // if (!loadingMore && topRestaurentsList?.length >= perPage) {
    //   perPage = perPage + 20;
    //   setLoadingMore(true);
    //   getOrderList();
    // }
  };

  return (
    <View style={styles.container}>
      {internet == false ? (
        <NoInternet />
      ) : (
        <>
          <Header
            title={category?.name}
            backArrow={true}
            onPress={() => {
              navigation.goBack();
            }}
          />
          {loading ? (
            <AnimatedLoader type={'restaurantCartLoader'} />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={styles.innerView}>
                <View style={styles.filterView}>
                  <DashboardFilters
                    onChange={f => {
                      // filters = f;
                      // getLocationCurrent();
                    }}
                  />
                </View>
                <View style={styles.flatListView}>
                  {relatedRestaurant?.length > 0 ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={relatedRestaurant}
                      renderItem={topRestaurentItem}
                      keyExtractor={item => item?._id}
                      onEndReached={loadMoredata}
                      onEndReachedThreshold={0.5}
                      contentContainerStyle={styles.flatListContainer}
                    />
                  ) : (
                    <View style={styles.noDataView}>
                      <Text style={styles.noDataText}>
                        There aren't any nearby restaurants at the moment.
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {cartItems?.food_item?.length > 0 && (
                <View style={styles.bottomCartBtnView}>
                  {/* pending FoodTrackingOrder functionality */}
                  {/* <FoodTrackingOrder
                bottom={
                  cartItems?.food_item?.length > 0 ? hp('18.5%') : hp('8%')
                }
                navigation={navigation}
                trackedArray={[
                  {
                    order_type: 'food',
                    tracking_id: '678654bi5y',
                  },
                ]}
              /> */}

                  <DashboardCartBtn
                    bottom={hp('1%')}
                    isDash={true}
                    cartData={cartItems}
                    onViewCart={
                      () => {
                        navigation.navigate('cart', {
                          restaurant: cartItems?.restaurant,
                        })
                      }
                    }
                    onDeletePress={async () => {
                      setIsRemoveCart(true);
                    }}
                  />
                </View>
              )}
            </View>
          )}
        </>
      )}
      <PopUp
        visible={isRemoveCart}
        type={'delete'}
        onClose={() => setIsRemoveCart(false)}
        title={'Confirm Cart Clearance'}
        text={
          'Are you sure you want to remove all items from your cart? This action cannot be undone.'
        }
        onDelete={() => {
          onDeleteCart(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  innerView: {
    flex: 1,
    marginTop: '-3%',
  },
  filterView: {
    justifyContent: 'center',
    paddingBottom: '2.5%',
    marginLeft: '5%',
  },
  flatListView: {
    flex: 1,
    alignItems: 'center',
    marginTop: '-1%',
  },
  flatListContainer: {
    justifyContent: 'center',
    paddingBottom: '15%',
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  noDataText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  bottomCartBtnView: {
    justifyContent: 'center', alignItems: 'center'
  }
});
