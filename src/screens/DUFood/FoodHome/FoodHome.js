import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, DeviceEventEmitter, Text, Alert } from 'react-native';
import { appImages } from '../../../commons/AppImages';
import { styles } from './styles';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import { filters, silderArray } from '../../../stores/DummyData/Home';
import { rootStore } from '../../../stores/rootStore';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import MikePopUp from '../../../components/MikePopUp';
import FoodSlider from '../../../components/slider/foodSlider';
import { ScrollView } from 'react-native-gesture-handler';
import DashboardFilters from './DashboardFilters';
import RestaurantsCard from '../../../components/Cards/RestaurantsCard';
import DashboardCartBtn from '../Components/DashboardCartBtn';
import DashboardTrackOrderBtn from '../Components/DashboardTrackOrderBtn';
import {
  getCurrentLocation,
  setCurrentLocation,
} from '../../../components/GetAppLocation';
import RepeatOrder from '../../../components/Cards/RepeatOrder';
import RecommendedOrder from '../../../components/Cards/RecommendedOrder';
import CategoryCard from '../../../components/Cards/CategoryCard';
import FoodTrackingOrder from '../Components/FoodTrackingOrder';
import PopUp from '../../../components/appPopUp/PopUp';
import ModalPopUpTouch from '../../../components/ModalPopUpTouch';
import { colors } from '../../../theme/colors';
import ReviewsRatingComp from '../../../components/ReviewsRatingComp';
import OnlineFoodUnavailable from '../../../components/OnlineFoodUnavailable';


let geoLocation = {
  lat: null,
  lng: null,
};

let perPage = 20;
let recommendedData = [];
export default function FoodHome({ navigation }) {
  const { appUser } = rootStore.commonStore;
  const { deleteCart, getCart, setCart, updateCart } = rootStore.cartStore;
  const {
    restaurentList,
    restaurentAll,
    allDishCategory,
    allCategoryList,
    restaurantCustomerLikeDislike,
    getRepeatedOrderList,
    repeatedOrderList,
    recommendedOrderList,
    getRecomendedItems,
    getFoodOrderTracking,
    foodOrderTrackingList,
  } = rootStore.foodDashboardStore;

  let selectedFilter = '';
  const [loading, setLoading] = useState(
    restaurentList?.length > 0 ? false : true,
  );
  const [loadingCategory, setLoadingCategory] = useState(
    allCategoryList?.length > 0 ? false : true,
  );
  const [categoryList, setCategoryList] = useState(allCategoryList ?? []);
  const [cartItems, setcartItems] = useState({});
  const [restaurantList, setRestaurantList] = useState(restaurentList ?? []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [internet, setInternet] = useState(true);
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [repeatOrdersList, setRepeatOrdersList] = useState(
    repeatedOrderList ?? [],
  );
  const [loadingRepeat, setLoadingRepeat] = useState(
    repeatedOrderList?.length > 0 ? false : true,
  );
  const [recomendedList, setRecomendedList] = useState(
    recommendedOrderList ?? [],
  );
  const [loadingRecommended, setLoadingRecommended] = useState(
    recommendedOrderList?.length > 0 ? false : true,
  );
  const [clickItem, setClickItem] = useState({});
  const [trackedArray, setTrackedArray] = useState(foodOrderTrackingList ?? []);
  const [isReviewStar, setIsReviewStar] = useState(true);
  const [loadingRating, setLoadingRating] = useState(false);

  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;
    return d ? d : '';
  };
  const [isRemoveCart, setIsRemoveCart] = useState(false);
  const [isRemoveCartOtherRes, setIsRemoveCartOtherRes] = useState(false);

  const getRestaurantList = async () => {
    const res = await restaurentAll(
      geoLocation,
      selectedFilter,
      perPage,
      handleLoading,
    );
    setRestaurantList(res);
    setLoadingMore(false);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const getRepeatedOrderListData = async () => {
    const res = await getRepeatedOrderList(geoLocation, handleRepeatLoading);
    console.log('res getRepeatedOrderListData', res);
    setRepeatOrdersList(res);
  };

  const handleRepeatLoading = (v) => {
    setLoadingRepeat(v)
  }

  const getRecomendedItemsData = async () => {
    const res = await getRecomendedItems(geoLocation, handleRecommendedLoading);
    // console.log("res getRecomendedItemsData",res,recomendedList)
    setRecomendedList(res);
    recommendedData = res;
  };

  const handleRecommendedLoading = (v) => {
    setLoadingRecommended(v)
  }

  // console.log('res getRecomendedItemsData', recomendedList);

  const getCategoryList = async () => {
    // console.log('getCategoryList');
    const res = await allDishCategory(handleLoadingCatagory);
    // console.log("res---",res);
    setCategoryList(res);
  };
  const handleLoadingCatagory = v => {
    setLoadingCategory(v);
  };

  // const repeatOrdersList = [
  //   {
  //     id: '1',
  //     name: 'Surya FastFood',
  //     imageUrl: appImages.foodIMage,
  //     like: 1,
  //   },
  //   {
  //     id: '2',
  //     name: 'Restaurant Two',
  //     imageUrl: appImages.foodIMage,
  //     like: 0,
  //   },
  //   {
  //     id: '3',
  //     name: 'Surya FastFood',
  //     imageUrl: appImages.foodIMage,
  //     like: 1,
  //   },
  //   {
  //     id: '4',
  //     name: 'Surya FastFood',
  //     imageUrl: appImages.foodIMage,
  //     like: 0,
  //   },
  //   // Add more restaurants as needed
  // ];

  // const recomendedOrdersList = [
  //   {
  //     id: '1',
  //     name: 'Pav Bhaji',
  //     imageUrl: appImages.foodIMage,
  //   },
  //   {
  //     id: '2',
  //     name: 'Kdi Paneer',
  //     imageUrl: appImages.foodIMage,
  //   },
  //   {
  //     id: '3',
  //     name: 'Samosa (2 Pieces)',
  //     imageUrl: appImages.foodIMage,
  //   },
  //   {
  //     id: '4',
  //     name: 'Pav Bhaji',
  //     imageUrl: appImages.foodIMage,
  //   },
  //   // Add more restaurants as needed
  // ];



  const getTrackingOrder = async () => {
    const res = await getFoodOrderTracking(handleTrackingLoading);
    setTrackedArray(res);
  };

  const handleTrackingLoading = v => {
    setLoading(v);
  };

  useFocusEffect(
    useCallback(() => {
      recommendedData = recommendedOrderList;
      checkInternet();
      handleAndroidBackButton(navigation);
      setCurrentLocation();
      getTrackingOrder();
      setTimeout(() => {
        if (getLocation) {
          onUpdateLatLng();
        }
      }, 300);

      onUpdateUserInfo();
      getCartItemsCount();

    }, []),
  );

  const onUpdateLatLng = () => {
    geoLocation = {
      lat: getLocation('lat'),
      lng: getLocation('lng'),
    };
    setTimeout(() => {
      getRepeatedOrderListData();
      getRecomendedItemsData();
      getRestaurantList();
      getCategoryList();
    }, 1000)


  };

  const loadMoredata = () => {
    console.log('load more');
    if (!loadingMore && restaurantList?.length >= perPage) {
      perPage = perPage + 20;
      setLoadingMore(true);
      getRestaurantList();
    }
  };
  const onUpdateUserInfo = () => {
    const { appUser } = rootStore.commonStore;
    setAppUserInfo(appUser);
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

  const hanldeSearch = async s => {
    console.log('get res:--', s);
  };

  const handleLikeUnlike = async item => {
    const likeUnLikeArray = await restaurantList?.map((data, i) => {
      if (data?._id == item?._id) {
        return {
          ...data,
          likedRestaurant: data?.likedRestaurant == true ? false : true,
        };
      } else {
        return { ...data };
      }
    });

    const request = {
      id: item?._id,
      like: item?.likedRestaurant == true ? false : true,
    };
    setRestaurantList([...likeUnLikeArray]);
    // console.log('item--handleLikeUnlike', likeUnLikeArray, item);
    const resLikeUnLike = await restaurantCustomerLikeDislike(request);
    // console.log("resLikeUnLike---",resLikeUnLike);
    if (resLikeUnLike?.statusCode == 200) {
      setRestaurantList([...likeUnLikeArray]);
    } else {
      setRestaurantList([...restaurantList]);
    }
  };

  const topRestaurentItem = ({ item }) => {
    return (
      <RestaurantsCard
        item={item}
        navigation={navigation}
        onLike={item => {
          handleLikeUnlike(item);
        }}
      />
    );
  };

  const onSuccessResult = item => {
    // console.log('item=== onSuccessResult', item);
    setSearchRes(item);
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };

  const getCartItemsCount = async () => {
    const cart = await getCart();
    console.log('user cart', cart);
    if (cart?.food_item?.length > 0) {
      setcartItems(cart);
      setTimeout(() => {
        onCheckRecommededItem(cart?.food_item);
      }, 500);
    } else {
      onCheckRecommededItem([]);
      setcartItems({});
    }
  };

  const onCheckRecommededItem = foodItemArray => {
    console.log('foodItemArray--', foodItemArray);
    if (foodItemArray?.length > 0) {
      let recommendedListData = (recommendedData ?? []).map(item => {
        const exactItem = foodItemArray?.find(data => data?._id === item?._id);
        return exactItem
          ? {
            ...item,
            item: {
              ...item.item, // Keep existing properties
              quantity: exactItem?.quantity, // ✅ Update quantity inside `item.item`
            },
          }
          : {
            ...item,
            item: {
              ...item.item, // Keep existing properties
              quantity: 0, // ✅ Update quantity inside `item.item`
            },
          };
      });
      console.log('recommendedListData--', recommendedListData);
      // Ensure a state update with a new reference
      if (recommendedListData?.length > 0) {
        setRecomendedList(recommendedListData);
        recommendedData = recommendedListData;
      } else {
        setRecomendedList(recommendedData);
      }
    } else {
      getRecomendedItemsData();
    }
  };

  const onDeleteCart = async showPopUp => {
    const deleteCartData = await deleteCart(cartItems, showPopUp);
    // console.log('deleteCartData--', deleteCartData);
    if (deleteCartData?.restaurant_id?.length > 0) {
      setIsRemoveCart(false);
      getCartItemsCount();
    } else {
      setIsRemoveCart(false);
      getCartItemsCount();
    }
  };

  const setCartData = async item => {
    const resCart = await setCart(item?.cart_items, appUser, item?.restaurant);
    // console.log("resCart---++++",resCart);
    if (resCart?.restaurant_id?.length > 0) {
      navigation.navigate('cart', {
        restaurant: item?.restaurant,
      });
    }
  };

  const onPressRepeatOrder = async item => {
    // console.log('item--++++++', item);
    if (cartItems?.food_item?.length > 0) {
      const deleteCartData = await deleteCart(cartItems, false);
      // console.log('deleteCartData---++++',deleteCartData);
      if (deleteCartData?.restaurant_id?.length > 0) {
        setCartData(item);
      }
    } else {
      setCartData(item);
    }
  };

  const handleLikeDislikeRepeated = async item => {
    console.log('handleLikeDislikeRepeated----', item);
    // return
    const likeUnLikeArray = await repeatOrdersList?.map((data, i) => {
      // if (data?._id == item?._id) {
      if (data?.restaurant?._id == item?.restaurant?._id) {
        return {
          ...data,
          restaurant: {
            ...data.restaurant,
            likedRestaurant:
              data?.restaurant?.likedRestaurant == true ? false : true,
          },
        };
      } else {
        return { ...data };
      }
    });
    const request = {
      id: item?.restaurant_id,
      like: item?.restaurant?.likedRestaurant == true ? false : true,
    };
    setRepeatOrdersList([...likeUnLikeArray]);
    // console.log('item--handleLikeUnlike', likeUnLikeArray, item);
    const resLikeUnLike = await restaurantCustomerLikeDislike(request);
    // console.log('resLikeUnLike---', resLikeUnLike);
    if (resLikeUnLike?.statusCode == 200) {
      setRepeatOrdersList([...likeUnLikeArray]);
    } else {
      setRepeatOrdersList([...repeatOrdersList]);
    }
  };

  const onDeleteCartUpdateRest = async showPopUp => {
    const deleteCartData = await deleteCart(cartItems, showPopUp);
    // console.log('deleteCartData--', deleteCartData);
    let restaurant = {
      _id: clickItem?.item?.restaurant_id,
    };
    if (deleteCartData?.restaurant_id?.length > 0) {
      setIsRemoveCartOtherRes(false);
      const resSetCart = await setCart([clickItem], appUser, restaurant);
      if (resSetCart?.restaurant_id?.length > 0) {
        getCartItemsCount();
      }
    } else {
      setIsRemoveCartOtherRes(false);
    }
  };

  const handleAddDecRecommended = async (item, quan) => {
    // console.log(
    //   'item ,quantity---',
    //   item,
    //   quan,
    //   item?.restaurant_id || item?.item?.restaurant_id,
    // );
    // return
    let restaurant = {
      _id: item?.restaurant_id || item?.item?.restaurant_id,
    };
    let newItem = {
      ...item,
      ...item.item,
      quantity: quan,
      food_item_id: item?._id,
      food_item_price: item?.item?.selling_price,
    };

    // console.log('item,quan,handleAddRemove', item, quan,newItem,item?.restaurant_id || item?.item?.restaurant_id, item?.item?.restaurant_id);
    const getCartList = { ...cartItems };

    // console.log('getCartList handleAddRemove:-', getCartList, item, restaurant,item?.restaurant_id || item?.item?.restaurant_id,item?.item?.restaurant_id);

    if (getCartList?.cart_items?.length > 0) {
      if (getCartList?.restaurant_id == item?.item?.restaurant_id) {
        // const checkAvailabilityById = getCartList?.cart_items?.find(
        //   cartItem => cartItem?.food_item_id === item?._id,
        // );
        // console.log('getCartList checkAvailability', checkAvailabilityById);

        const checkAvailabilityById = getCartList?.food_item?.find(
          cartItem => cartItem?._id === item?._id,
        );
        // console.log('getCartList checkAvailability', checkAvailabilityById);
        let addOnData = {
          food_item_id: item?._id,
          add_on_items: checkAvailabilityById?.selected_add_on ?? [],
        };

        let updatedCartList = getCartList?.cart_items;

        if (checkAvailabilityById) {
          updatedCartList = getCartList?.cart_items?.map(data => {
            if (data?.food_item_id == item?._id) {
              return { ...data, quantity: quan };
            }
            return {
              ...data,
            };
          });
          // console.log(
          //   'updatedCartList--',
          //   updatedCartList,
          //   appUser,
          //   restaurant,
          //   getCartList,
          // );
          const resUpdateCart = await updateCart(
            updatedCartList,
            appUser,
            restaurant,
            getCartList,
            addOnData,
          );
          if (resUpdateCart?.statusCode == 200) {
            getCartItemsCount();
          }
        } else {
          // console.log('updateCart--', updatedCartList, appUser, restaurant, [
          //   newItem,
          // ]);
          const resUpdateCart = await updateCart(
            [...updatedCartList, ...[newItem]],
            appUser,
            restaurant,
            getCartList,
            addOnData,
          );

          if (resUpdateCart?.statusCode == 200) {
            getCartItemsCount();
          }
        }
      } else {
        setClickItem(newItem);
        setIsRemoveCartOtherRes(true);
      }
    } else {
      // console.log('setCart--first', [newItem], appUser, restaurant);
      const resSetCart = await setCart([newItem], appUser, restaurant);
      if (resSetCart?.restaurant_id?.length > 0) {
        // getCartItemsCount();
        navigation.navigate('resturantProducts', {
          item: item?.restaurant,
        });
      }
    }
  };

  return (
    <View style={[styles.container]}>
      {internet == false ? (
        <NoInternet />
      ) : ((loading && loadingCategory && loadingRepeat && loadingRecommended)) == true ? (
        <AnimatedLoader type={'foodHomeLoader'} />
      ) : (
        <>
          <DashboardHeader2
            navigation={navigation}
            onPress={() => {
              navigation.goBack();
            }}
            appUserInfo={appUserInfo}
            autoFocus={isKeyboard}
            value={searchRes}
            onChangeText={t => {
              setSearchRes(t);
              if (t) {
                hanldeSearch(t);
              }
            }}
            onMicroPhone={() => {
              setVisible(true);
            }}
            onFocus={() => setIskeyboard(true)}
            onBlur={() => setIskeyboard(false)}
            onCancelPress={() => {
              setSearchRes('');
            }}
          // onRefershData={onRefershData}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.mainScreen}
            // stickyHeaderIndices={
            //   (repeatOrdersList?.length ?? 0) > 2 &&
            //     (recomendedList?.length ?? 0) > 2
            //     ? [3]
            //     : (repeatOrdersList?.length ?? 0) > 2 ||
            //       (recomendedList?.length ?? 0) > 2
            //       ? [2]
            //       : [1]
            // }
            stickyHeaderIndices={[3]}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: hp('10%'),
            }}>
            {/* <View style={styles.sliderMainView}>
              <View style={styles.sliderInnerView}>
                <FoodSlider
                  data={sliderItems}
                  imageWidth={wp('78%')}
                  imageHeight={hp('16%')}
                />
              </View>
            </View> */}

            {repeatOrdersList?.length > 0 && (
              <View style={styles.orderMainView}>
                <RepeatOrder
                  data={repeatOrdersList}
                  onPress={item => {
                    onPressRepeatOrder(item);
                  }}
                  onPressLikeDislike={item => {
                    handleLikeDislikeRepeated(item);
                  }}
                />
              </View>
            )}

            {recomendedList?.length > 0 && (
              <View style={styles.orderMainView}>
                <RecommendedOrder
                  data={recomendedList}
                  onAddDec={handleAddDecRecommended}
                />
              </View>
            )}

            <View style={styles.orderMainView}>
              <CategoryCard data={categoryList} navigation={navigation} />
            </View>

            <View style={styles.exploreView}>
              <Text style={styles.titleText}>Top Restaurants to explore</Text>
              <View style={styles.filterView}>
                <DashboardFilters
                  data={filters}
                  onChange={f => {
                    // console.log('f>', f);
                    selectedFilter = f;
                    getRestaurantList();
                    // getLocationCurrent();
                  }}
                />
              </View>
            </View>

            <View style={styles.restaurantMainView}>
              {restaurantList?.length > 0 ? (
                <FlatList
                  scrollEnabled={false}
                  // nestedScrollEnabled={true}
                  data={restaurantList}
                  renderItem={topRestaurentItem}
                  keyExtractor={item => item.id}
                  onEndReached={loadMoredata}
                  onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% from the bottom
                  contentContainerStyle={{
                    justifyContent: 'center',
                    paddingBottom:
                      cartItems?.food_item?.length > 0 ? hp('30%') : hp('20%'),
                  }}
                />
              ) : (
                <View style={styles.dataFoundView}>
                  <Text style={styles.dataFoundText}>
                    There aren't any nearby restaurants at the moment.
                  </Text>
                </View>
              )}
            </View>


          </ScrollView>
          {/* <OnlineFoodUnavailable
              appUserData={appUserInfo}
              navigation={navigation} /> */}

          <View style={styles.bottomCartBtnView}>
            {trackedArray?.length > 0 && (
              <FoodTrackingOrder
                bottom={cartItems?.food_item?.length > 0 ? hp('18.3%') : hp('8.5%')}
                navigation={navigation}
                trackedArray={trackedArray}
              />
            )}
            {cartItems?.food_item?.length > 0 && (
              <DashboardCartBtn
                bottom={hp('8.5%')}
                isDash={true}
                cartData={cartItems}
                onViewCart={() => {
                  //   navigation.navigate('trackOrderPreparing')
                  navigation.navigate('cart', {
                    restaurant: cartItems?.restaurant,
                  });
                }}
                onDeletePress={async () => {
                  // setRemoveCart(true);
                  // setIsOtherCart(false);
                  setIsRemoveCart(true);
                }}
              />
            )}
          </View>

        </>
      )}
      <MikePopUp
        visible={visible}
        title={'Sorry! Didn’t hear that'}
        text={'Try saying restaurant name or a dish.'}
        onCancelBtn={onCancel}
        onSuccessResult={onSuccessResult}
      />
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
      <PopUp
        visible={isRemoveCartOtherRes}
        type={'delete'}
        onClose={() => setIsRemoveCartOtherRes(false)}
        title={'Confirm Cart Clearance'}
        text={
          'Other restaurant item is already in your cart. Please remove it.? This action cannot be undone.'
        }
        onDelete={() => {
          onDeleteCartUpdateRest(false);
        }}
      />

      {/* <ReviewsRatingComp 
       type={'FOOD'}
      title={'Did you enjoy your meal?'}
      isVisible={isReviewStar}
      onClose={()=>{setIsReviewStar(false)}}
      loading={loadingRating}
      onHandleLoading={(v)=>{setLoadingRating(v)}}
      /> */}
    </View>
  );
}
