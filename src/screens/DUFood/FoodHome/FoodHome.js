import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  DeviceEventEmitter,
  Text,
} from 'react-native';
import {appImages,} from '../../../commons/AppImages';
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


let geoLocation = {
  lat: null,
  lng: null,
};

let perPage = 20;

export default function FoodHome({navigation}) {
  const {appUser} = rootStore.commonStore;
  const {saveCartItem, deleteCart, loadCartList, getRestraurent} =
    rootStore.cartStore;
    const {restaurentList, restaurentAll,allDishCategory,allCategoryList} = rootStore.foodDashboardStore;
  let selectedFilter = '';
  const [loading, setLoading] = useState(
    restaurentList?.length > 0 ? false : true,
  );
  const [loadingCategory, setLoadingCategory] = useState(
    allCategoryList?.length > 0 ? false : true,
  );
  const [categoryList, setCategoryList] = useState(allCategoryList ?? []);
  const [restoInfo, setRestoInfo] = useState({});
  const [cartItems, setcartItems] = useState([]);
  const [orderList, setOrderList] = useState(restaurentList ?? []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [internet, setInternet] = useState(true);
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [isOtherCart, setIsOtherCart] = useState(false);
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;
    return d ? d : '';
  };



  const getOrderList = async () => {
    console.log('getOrderList');
    const res = await restaurentAll(
      geoLocation,
      selectedFilter,
      perPage,
      handleLoading,
    );
    setOrderList(res);
    setLoadingMore(false);
  };

  const  getCategoryList = async () => {
    console.log('getCategoryList');
    const res = await allDishCategory(
      handleLoadingCatagory,
    );
    console.log("res---",res);
    setCategoryList(res);
  };
  const handleLoadingCatagory =(v)=>{
    setLoadingCategory(v);
  }

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
  const productsList = [
    {
      id: '1',
      name: 'Pizza',
      imageUrl: appImages.burgerImage,
    },
    {
      id: '2',
      name: 'Burger',
      imageUrl: appImages.burgerImage,
    },
    {
      id: '3',
      name: 'Lassi',
      imageUrl: appImages.burgerImage,
    },
    {
      id: '4',
      name: 'Noodles',
      imageUrl: appImages.burgerImage,
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
          // setIsRefersh(true);
          // console.log('geoLocation>', geoLocation.lat + ' ' + geoLocation.lng);
          getOrderList();
          getCategoryList();
        }
      }, 300);
      onUpdateUserInfo();
      console.log('appUserInfo._id>', appUserInfo._id);
      onRestaurentInfo();
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
  const onRestaurentInfo = async () => {
    const restInfoo = await getRestraurent();

    console.log('restaurentInfo>', restInfoo);
    if (restInfoo?.restaurentname != undefined) {
      setRestoInfo(restInfoo);
      setIsOtherCart(true);
    } else {
      setRestoInfo({});
      setIsOtherCart(false);
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
    console.log('item=== onSuccessResult', item);
    setSearchRes(item);
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };

  const getCartItemsCount = async c => {
    // const totalQuantity = c.reduce(
    //   (total, item) => total + Number(item.quantity),
    //   0,
    // );

    // return totalQuantity;
    const cartItems = await loadCartList();
    console.log('user cart', cartItems);

    if (cartItems.length > 0) {
      setcartItems(cartItems);
    } else {
      setcartItems([]);
    }
  };

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
           contentContainerStyle={{ flexGrow: 1 }}>
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
              <CategoryCard data={categoryList
                //  productsList
              } navigation={navigation} />
            </View>

            <View style={styles.exploreView}>
              <Text style={styles.titleText}>Top Restaurants to explore</Text>
              <View style={styles.filterView}>
                <DashboardFilters
                  onChange={f => {
                    console.log('f>', f);
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
                    paddingBottom: '30%',
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
          {isOtherCart &&
            restoInfo.restaurentname !== null &&
            cartItems.length > 0 && (
              //  !loading &&
              <View
                style={styles.bottomCartBtnView}>
                {/* <DashboardTrackOrderBtn
                bottom={hp('8.5%')}
                isDash={true}
                items={getCartItemsCount('')}
                restaurantData={isOtherCart}
                onViewCart={() =>
                  navigation.navigate('orderPlaced', )

                  // navigation.navigate('trackOrderPreparing')
                }
                onDeletePress={async () => {
                  
                  setRemoveCart(true);
                }}
              /> */}

                <DashboardCartBtn
                  bottom={hp('8%')}
                  isDash={true}
                  items={cartItems?.length}
                  restaurantData={restoInfo}
                  onViewCart={() =>
                    // navigation.navigate('orderPlaced', )

                    navigation.navigate('cart', {
                      restaurant: [],
                      // restaurant: isOtherCart?.orgdata,
                    })
                  }
                  onDeletePress={async () => {
                    await deleteCart();
                    // setRemoveCart(true);
                    setIsOtherCart(false);
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
    </View>
  );
}
