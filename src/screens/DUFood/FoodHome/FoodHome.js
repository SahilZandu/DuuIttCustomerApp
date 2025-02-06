import React, {useEffect, useState, useCallback} from 'react';
import {View, FlatList, DeviceEventEmitter, Text} from 'react-native';
import {appImages} from '../../../commons/AppImages';
import {styles} from './styles';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import {silderArray} from '../../../stores/DummyData/Home';
import {rootStore} from '../../../stores/rootStore';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import MikePopUp from '../../../components/MikePopUp';
import FoodSlider from '../../../components/slider/foodSlider';
import {ScrollView} from 'react-native-gesture-handler';
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

let geoLocation = {
  lat: null,
  lng: null,
};

let perPage = 20;

export default function FoodHome({navigation}) {
  const {appUser} = rootStore.commonStore;
  const {deleteCart, getCart} = rootStore.cartStore;
  const {restaurentList, restaurentAll, allDishCategory, allCategoryList} =
    rootStore.foodDashboardStore;
  let selectedFilter = '';
  const [loading, setLoading] = useState(
    restaurentList?.length > 0 ? false : true,
  );
  const [loadingCategory, setLoadingCategory] = useState(
    allCategoryList?.length > 0 ? false : true,
  );
  const [categoryList, setCategoryList] = useState(allCategoryList ?? []);
  const [cartItems, setcartItems] = useState({});
  const [orderList, setOrderList] = useState(restaurentList ?? []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [internet, setInternet] = useState(true);
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [sliderItems, setSliderItems] = useState(silderArray);

  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;
    return d ? d : '';
  };
  const [isRemoveCart, setIsRemoveCart] = useState(false);

  const getOrderList = async () => {
    // console.log('getOrderList');
    const res = await restaurentAll(
      geoLocation,
      selectedFilter,
      perPage,
      handleLoading,
    );
    setOrderList(res);
    setLoadingMore(false);
  };

  const getCategoryList = async () => {
    // console.log('getCategoryList');
    const res = await allDishCategory(handleLoadingCatagory);
    // console.log("res---",res);
    setCategoryList(res);
  };
  const handleLoadingCatagory = v => {
    setLoadingCategory(v);
  };

  const repeatOrdersList = [
    {
      id: '1',
      name: 'Surya FastFood',
      imageUrl: appImages.foodIMage,
      like: 1,
    },
    {
      id: '2',
      name: 'Restaurant Two',
      imageUrl: appImages.foodIMage,
      like: 0,
    },
    {
      id: '3',
      name: 'Surya FastFood',
      imageUrl: appImages.foodIMage,
      like: 1,
    },
    {
      id: '4',
      name: 'Surya FastFood',
      imageUrl: appImages.foodIMage,
      like: 0,
    },
    // Add more restaurants as needed
  ];
  const recomendedOrdersList = [
    {
      id: '1',
      name: 'Pav Bhaji',
      imageUrl: appImages.foodIMage,
    },
    {
      id: '2',
      name: 'Kdi Paneer',
      imageUrl: appImages.foodIMage,
    },
    {
      id: '3',
      name: 'Samosa (2 Pieces)',
      imageUrl: appImages.foodIMage,
    },
    {
      id: '4',
      name: 'Pav Bhaji',
      imageUrl: appImages.foodIMage,
    },
    // Add more restaurants as needed
  ];

  const handleLoading = v => {
    setLoading(v);
  };

  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
      setCurrentLocation();
      setTimeout(() => {
        if (getLocation) {
          onUpdateLatLng();
          getOrderList();
          getCategoryList();
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
  };

  const loadMoredata = () => {
    console.log('load more');
    if (!loadingMore && orderList?.length >= perPage) {
      perPage = perPage + 20;
      setLoadingMore(true);
      getOrderList();
    }
  };
  const onUpdateUserInfo = () => {
    const {appUser} = rootStore.commonStore;
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

  const topRestaurentItem = ({item}) => (
    // <View key={index}>
    <RestaurantsCard
      item={item}
      navigation={navigation}
      onLike={like => {
        // handleLikeUnlike(like, item)
      }}
    />
    // </View>
  );

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
    } else {
      setcartItems({});
    }
  };

  const onDeleteCart=async()=>{
 const deleteCartData =  await deleteCart(cartItems);
 console.log("deleteCartData--",deleteCartData);
     setIsRemoveCart(false);
     getCartItemsCount();
  }

  return (
    <View style={[styles.container]}>
      {internet == false ? (
        <NoInternet />
      ) : (loading && loadingCategory) == true ? (
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
            stickyHeaderIndices={[4]}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: hp('10%'),
            }}>
            <View style={styles.sliderMainView}>
              <View style={styles.sliderInnerView}>
                <FoodSlider
                  data={sliderItems}
                  imageWidth={wp('78%')}
                  imageHeight={hp('18%')}
                />
              </View>
            </View>

            <View style={styles.orderMainView}>
              <RepeatOrder data={repeatOrdersList} />
            </View>

            <View style={styles.orderMainView}>
              <RecommendedOrder data={recomendedOrdersList} />
            </View>

            <View style={styles.orderMainView}>
              <CategoryCard data={categoryList} navigation={navigation} />
            </View>

            <View style={styles.exploreView}>
              <Text style={styles.titleText}>Top Restaurants to explore</Text>
              <View style={styles.filterView}>
                <DashboardFilters
                  onChange={f => {
                    // console.log('f>', f);
                    selectedFilter = f;
                    getOrderList();
                    // getLocationCurrent();
                  }}
                />
              </View>
            </View>

            <View style={styles.restaurantMainView}>
              {orderList?.length > 0 ? (
                <FlatList
                  scrollEnabled={false}
                  // nestedScrollEnabled={true}
                  data={orderList}
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
                bottom={hp('8%')}
                isDash={true}
                cartData={cartItems}
                onViewCart={() =>
                  navigation.navigate('trackOrderPreparing')
                  // navigation.navigate('cart', {
                  //   restaurant: cartItems?.restaurant,
                  // })
                }
                onDeletePress={async () => {
                  // setRemoveCart(true);
                  // setIsOtherCart(false);
                  setIsRemoveCart(true);
                }}
              />
            </View>
          )}
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
          onDeleteCart()
        }}
      />
    </View>
  );
}
