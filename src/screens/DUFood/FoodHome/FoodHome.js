import React, {useEffect, useState, useCallback} from 'react';
import {View, Image, FlatList, DeviceEventEmitter, Text} from 'react-native';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import {homeRideCS, silderArray} from '../../../stores/DummyData/Home';
import ChangeRoute2 from '../../../components/ChangeRoute2';
import {setCurrentLocation} from '../../../components/GetAppLocation';
import {rootStore} from '../../../stores/rootStore';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import MikePopUp from '../../../components/MikePopUp';
import FoodSlider from '../../../components/slider/foodSlider';
import {SvgXml} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import DashboardFilters from './DashboardFilters';
import RestaurantsCard from '../../../components/Cards/RestaurantsCard';
import DashboardCartBtn from '../Components/DashboardCartBtn';
import DashboardTrackOrderBtn from '../Components/DashboardTrackOrderBtn';

export default function FoodHome({navigation}) {
  const {appUser} = rootStore.commonStore;
  const {saveCartItem, deleteCart,loadCartList,getRestraurent} = rootStore.cartStore;
  const [restoInfo, setRestoInfo] = useState({});
  const [cartItems, setcartItems] = useState([]);

  const [appUserInfo, setAppUserInfo] = useState(appUser);

  const [internet, setInternet] = useState(true);
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [isOtherCart, setIsOtherCart] = useState(false);

  const repeatOrdersList = [
    {
      id: '1',
      name: 'Surya FastFood',
      imageUrl: appImages.foodIMage,
    },
    {
      id: '2',
      name: 'Restaurant Two',
      imageUrl: appImages.foodIMage,
    },
    {
      id: '3',
      name: 'Surya FastFood',
      imageUrl: appImages.foodIMage,
    },
    {
      id: '4',
      name: 'Surya FastFood',
      imageUrl: appImages.foodIMage,
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
      checkInternet();
      handleAndroidBackButton(navigation);
      setCurrentLocation();
      onUpdateUserInfo();
      onRestaurentInfo();
      getCartItemsCount();
    }, []),
  );

  const onUpdateUserInfo = () => {
    const {appUser} = rootStore.commonStore;
    setAppUserInfo(appUser);
  };
  const onRestaurentInfo = async () => {
    const restInfoo =await getRestraurent();
    
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
  const renderRepeatOrderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <SvgXml style={styles.star} xml={like} />
      <Image source={item.imageUrl} resizeMode="cover" style={styles.image} />

      <Text numberOfLines={2} style={styles.name}>
        {item.name}
      </Text>
      <View style={styles.viewContainer}>
        <SvgXml xml={star} />
        <Text style={styles.rating}>3.9</Text>
        <Text style={styles.mint}>25-30 mins</Text>
      </View>
    </View>
  );
  const renderRecommendedOrderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={item.imageUrl} resizeMode="cover" style={styles.image} />

      <Text numberOfLines={2} style={[styles.name, {fontSize: 14}]}>
        {item.name}
      </Text>
      <View style={[styles.viewContainer, {justifyContent: 'space-between'}]}>
        <Text style={styles.rating}>99</Text>
        <AddButton />
      </View>
    </View>
  );
  const renderProductItem = ({item}) => (
    <View style={[styles.itemContainer, {alignItems: 'center'}]}>
      <Image source={item.imageUrl} resizeMode="cover" style={styles.image} />

      <Text
        numberOfLines={2}
        style={[styles.name, {fontSize: 14, marginTop: 0}]}>
        {item.name}
      </Text>
    </View>
  );
  const AddButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>ADD</Text>
      </View>
    );
  };
  const RepeatOrderList = () => {
    return (
      <FlatList
        data={repeatOrdersList}
        renderItem={renderRepeatOrderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const RecommendedOrderList = () => {
    return (
      <FlatList
        data={recomendedOrdersList}
        renderItem={renderRecommendedOrderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const ProductsList = () => {
    return (
      <FlatList
        data={productsList}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  function topRestaurentItem(item, index) {
    return (
      <View key={index}>
        <RestaurantsCard
          item={item}
          navigation={navigation}
          onLike={like => {
            // handleLikeUnlike(like, item)
          }}
        />
      </View>
    );
  }

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

   if(cartItems.length>0)
   {
    setcartItems(cartItems);
   }
   else{
    setcartItems([]);
   }
  };

  return (
    <View style={[styles.container]}>
      {internet == false ? (
        <NoInternet />
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
          <ScrollView style={{flex: 1}}>
            <View style={styles.outerScrollView}>
              <AppInputScroll
                padding={true}
                keyboardShouldPersistTaps={'handled'}>
                {/* <View style={{marginTop: '2%', marginHorizontal: 20}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{width: wp('90%'), height: hp('18%')}}
                    source={appImages.rideHomeImage}
                  />
                </View>
                <ChangeRoute2
                  data={homeRideCS}
                  navigation={navigation}
                  route={'RIDE'}
                />
              </View> */}
                {/* <View style={styles.bottomImageView}>
                <Image
                  resizeMode="cover"
                  style={styles.bottomImage}
                  source={appImages.rideHomeBootmImage}
                />
              </View> */}

                <View style={{marginHorizontal: 20, justifyContent: 'center'}}>
                  <View
                    style={{
                      marginHorizontal: -10,
                      alignContent: 'center',
                    }}>
                    <FoodSlider
                      data={sliderItems}
                      imageWidth={wp('77%')}
                      imageHeight={hp('18%')}
                    />
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.titleText}>Repeat order</Text>
                  <View style={{marginTop: 10}}>
                    <RepeatOrderList />
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.titleText}>Recommended orders</Text>
                  <View style={{marginTop: 10}}>
                    <RecommendedOrderList />
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.titleText}>
                    What would you like to have?
                  </Text>
                  <View style={{marginTop: 10}}>
                    <ProductsList />
                  </View>
                </View>

                <View>
                  <Text style={styles.titleText}>
                    Top Restaurants to explore
                  </Text>

                  <View style={{marginTop: 10}}>
                    <DashboardFilters
                      onChange={f => {
                        // filters = f;
                        // getLocationCurrent();
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      minHeight: hp('80%'),
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    {topRestaurentsList?.length > 0 ? (
                      topRestaurentsList?.map((item, key) =>
                        topRestaurentItem(item, key),
                      )
                    ) : (
                      <View
                        style={{
                          // justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: hp('6%'),
                          height: hp('80%'),
                          paddingTop: '20%',
                        }}>
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontFamily: latoFonts.regular,
                            color: 'rgba(0, 0, 0, 0.65)',
                          }}>
                          There aren't any nearby restaurants at the moment.
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </AppInputScroll>
            </View>
          </ScrollView>
          {isOtherCart &&
           restoInfo.restaurentname!==null
           && cartItems.length>0 
           && (
            //  !loading &&

            <View
              style={{
                bottom: '6%',
              }}>
              {/* <DashboardTrackOrderBtn
                bottom={'10%'}
                isDash={true}
                items={getCartItemsCount('')}
                restaurantData={isOtherCart}
                onViewCart={() =>
                  // navigation.navigate('orderPlaced', )

                  navigation.navigate('trackOrderPreparing')
                }
                onDeletePress={async () => {
                  
                  setRemoveCart(true);
                }}
              /> */}

              <DashboardCartBtn
                bottom={'6%'}
                isDash={true}
                items={cartItems.length}
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

const star = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 0L5.29313 2.22016L7.80423 2.76393L6.09232 4.67984L6.35114 7.23607L4 6.2L1.64886 7.23607L1.90768 4.67984L0.195774 2.76393L2.70687 2.22016L4 0Z" fill="#F9BD00"/>
</svg>`;
const unlike = `<svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.99726 1.83832C4.19752 0.920871 2.8639 0.674081 1.86188 1.51419C0.859858 2.35429 0.718787 3.7589 1.50568 4.7525C2.15993 5.57861 4.13991 7.32093 4.78884 7.88485C4.86144 7.94795 4.89774 7.97949 4.94009 7.99189C4.97704 8.0027 5.01748 8.0027 5.05444 7.99189C5.09678 7.97949 5.13308 7.94795 5.20568 7.88485C5.85461 7.32093 7.83459 5.57861 8.48884 4.7525C9.27573 3.7589 9.15189 2.34545 8.13264 1.51419C7.1134 0.682918 5.797 0.920871 4.99726 1.83832Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const like = `<svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.99726 1.83832C4.19752 0.920871 2.8639 0.674081 1.86188 1.51419C0.859858 2.35429 0.718787 3.7589 1.50568 4.7525C2.15993 5.57861 4.13991 7.32093 4.78884 7.88485C4.86144 7.94795 4.89774 7.97949 4.94009 7.99189C4.97704 8.0027 5.01748 8.0027 5.05444 7.99189C5.09678 7.97949 5.13308 7.94795 5.20568 7.88485C5.85461 7.32093 7.83459 5.57861 8.48884 4.7525C9.27573 3.7589 9.15189 2.34545 8.13264 1.51419C7.1134 0.682918 5.797 0.920871 4.99726 1.83832Z" fill="#E10A0A" stroke="#E10A0A" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
