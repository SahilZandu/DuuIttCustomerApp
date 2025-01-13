import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
// import {rootStore} from '../stores/rootStore';
import {SvgXml} from 'react-native-svg';
import {styles} from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {currencyFormat} from '../../../halpers/currencyFormat';
import Header from '../../../components/header/Header';
// import CartHeader from './CartHeader';
import CartItems from './CartItems';
// import CartInstructions from './CartInstructions';
import CartBill from './CartBill';
// import CTA from '../Components/CTA/CTA';
// import PickedOrderModalComponent from '../Components/PickedOrderModalComponent';
// import RazorpayCheckout from 'react-native-razorpay';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import CartCoupanApply from './CartCoupanApply';
import {useFocusEffect} from '@react-navigation/native';
// import CartItemUpdate from '../Components/CartItemUpdate';
// import Base_Image_Url from '../api/Url';
// import CancellationPolicy from './CancellationPolicy';
// import PerparationNotice from './PerparationNotice';
// import { usePayment } from '../helpers/usePayment';
import DotedLine from '../Components/DotedLine';
import {colors} from '../../../theme/colors';
import BillSummary from '../Components/BillSummary';
import AddNote from '../Components/AddNote';
import DeliveryInstructions from '../Components/DeliveryInstructions';
import CouponDetail from '../Components/CouponDetail';
let itemForEdit = null;

let idForUpdate = null;

const CouponsList = ({navigation, route}) => {
  const {restaurant} = route.params;
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
  console;
  const [selectedItem, setSelectedItem] = useState(null);

  // const {
  //   getCart,
  //   setCart,
  //   setCartEmpty,
  //   saveInstructions,
  //   updateCartItem,
  //   applyCoupon,
  //   removeApplyCoupon,
  //   getCouponList,
  //   cartOffer,
  //   checkCartIsVaild,
  // } = rootStore.cartStore;

  // const {createOrder, getOrgDistance} = rootStore.orderStore;

  // const imageUrl = Base_Image_Url?.Base_Image_UrlProduct;

  // const [appCart, setAppCart] = useState(null);
  const [appCart, setAppCart] = useState({
    cartitems: [
      {
        product: {
          veg_non_veg: 'non-veg',
          title: 'cake',
        },
        varient_name: 'varient',
        sub_total: '200',
        grand_total: '200',
      },
      {
        product: {
          veg_non_veg: 'non-veg',
          title: 'cake',
        },
        varient_name: 'varient',
        sub_total: '200',
        grand_total: '200',
      },
    ],
  });
  const [cartTotal, setCartTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [offerCart, setOfferCart] = useState([]);
  const [activeOffer, setActiveOffer] = useState({});
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isBillDetail, setIsBillDetail] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(false);
  const [isInstruction, setIsInstruction] = useState(false);

  const [cartBillG, setCartBillG] = useState(null);
  const [userOrgDistance, setUserOrgDistance] = useState(null);

  // useFocusEffect(
  //   useCallback(() => {
  //     getUserCart();
  //     getOfferCart();
  //     const {cartOffer} = rootStore.cartStore;
  //     console.log('offer card', cartOffer);
  //     if (cartOffer?.coupon_code) {
  //       setTimeout(() => {
  //         setActiveOffer(cartOffer);
  //       }, 300);
  //     }
  //   }, [cartOffer, loadingOffer]),
  // );

  // useEffect(() => {
  //   setTimeout(() => {
  //     const {cartOffer} = rootStore.cartStore;
  //     setActiveOffer(cartOffer);
  //   }, 300);
  // }, [loadingOffer]);

  useEffect(() => {
    getUserCart();
  }, []);

  useEffect(() => {
    if (appCart) {
      const intervalId = setInterval(() => {
        reFreshDistance(appCart?.org_id);
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [appCart]);

  const reFreshDistance = id => {
    getUserOrgDistance(id);
  };

  const getOfferCart = async () => {
    const resOffer = await getCouponList();
    console.log('resOffer===', resOffer);
    setOfferCart(resOffer);
  };
  const AddInstruction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIsInstruction(!isInstruction);
        }}
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          backgroundColor: 'white',
          padding: 10,
          alignItems: 'center',
          marginTop: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#CACACA',
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: {width: 0, height: 4},
        }}>
        <Image
          style={{width: 12, height: 12, marginEnd: 10}}
          source={appImages.retaurentNote}
        />
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: RFValue(11),
            color: '#242424',
          }}>
          Add instructions for delivery partner
        </Text>
      </TouchableOpacity>
    );
  };

  const getUserOrgDistance = async orgId => {
    if (orgId) {
      const getDi = await getOrgDistance(orgId);
      console.log('getdii', getDi);
      setUserOrgDistance(getDi ? getDi.travel_time : null);
    }
  };

  const handleSuccess = data => {
    setCartEmpty();
    navigation.navigate('orderPlaced', {orderData: data});
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const onSuccess = data => {
    let paymentId = data?.razorpay_payment_id;
    createOrder(appCart, cartBillG, handleSuccess, handleLoading, paymentId);
  };

  const onError = () => {
    setLoading(false);
  };

  const handleOrderCreate = async () => {
    setLoading(true);

    let checkIsCartValid = await checkCartIsVaild();

    console.log('get cart is valid:', checkIsCartValid);

    if (checkIsCartValid) {
      //  usePayment(cartBillG,onSuccess, onError)
      //  createOrder(appCart, cartBillG, handleSuccess, handleLoading);
    } else {
      setLoading(false);
    }
  };

  const getUserCart = async () => {
    const cart = await getCart();
    console.log('user cart', cart);
    if (cart) {
      setAppCart(cart);
      getUserOrgDistance(cart?.org_id);
    } else {
      navigation.goBack();
    }
  };

  const handleIsNote = vale => {
    setIsOpenNote(vale);
  };
  const handleAddRemove = async (item, quan) => {
    const vcId = item?.varient_id ? item?.varient_id : null;
    const vcName = item?.varient_name ? item?.varient_name : null;
    const vcPrice = item?.varient_price ? item?.varient_price : null;
    const addons =
      item.addon_item && item.addon_item.length > 0 ? item.addon_item : null;
    const iPrice = item?.sub_total;

    await setCart(
      item?.product,
      quan,
      vcId,
      vcName,
      vcPrice,
      restaurant,
      addons,
      iPrice,
    );
    getUserCart();
  };

  const onSucces = () => {
    getUserCart();
  };

  const getPlaceOrderTotal = bill => {
    if (bill) {
      return currencyFormat(
        bill.cartTotal + bill.tax + bill.pfree - bill.discount,
      );
    } else {
      return currencyFormat(0);
    }
  };
  const AddButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>ADD</Text>
      </View>
    );
  };
  const renderRecommendedOrderItem = ({item}) =>{ 
    const isSelected = selectedItem === item.id;
    return(
      <TouchableOpacity
      onPress={() => {
        // If item is clicked, select/deselect it
        //setSelectedItem(isSelected ? null : item.id);
     navigation.navigate('couponDetail');
      }}
    
    >
    <View style={[styles.itemContainer,{marginHorizontal:20,}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image style={{width: 24, height: 24,marginEnd:10}} source={appImages.offerPercent} />
          <Text
          style={{fontFamily:fonts.bold,
            fontSize:RFValue('14'),
            
          color:'#000'}}
          >Get 20% OFF up to ₹75</Text>
        </View>
          <SvgXml xml={isSelected ? appImagesSvg.selectedRadioButton
          : appImagesSvg.unSelectedRadioButton}/>
      </View>
      <Text
      style={{color:'#28B056',
      fontFamily:fonts.medium,
      fontSize:RFValue('12'),
      marginLeft:40}}>
      Save ₹75 with this code 
</Text>
<Text
      style={{marginLeft:40,borderRadius:12,
        width:wp('20%'),
        marginTop:10,
        textAlignVertical:'center',
        textAlign:'center',
      paddingLeft:10,
      paddingEnd:10,
      paddingTop:2,
      paddingBottom:2,
      color:'#AFAFAF',
      borderColor:'#AFAFAF',
      borderWidth:1}}>
      DUIT75 
</Text>
    </View>
    </TouchableOpacity>
  );
      }


  const RecommendedOrderList = () => {
    return (
      <FlatList
      style={{marginTop:20}}
        data={recomendedOrdersList}
        renderItem={renderRecommendedOrderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={
        
            <View
            style={{backgroundColor:'#D9D9D9',
            height:1,
            margin:20,
            }}>
            </View>
          
        }
      />
    );
  };
  const onApplyOffer = async (item, activeCode) => {
    if (activeCode?.length > 0) {
      setLoadingOffer(true);
      setActiveOffer({});
      await removeApplyCoupon(handleLoadingOffer, onSucces);
    } else {
      setLoadingOffer(true);
      await applyCoupon(item, handleLoadingOffer, navigation, false, onSucces);
    }
  };

  const handleLoadingOffer = v => {
    setLoadingOffer(v);
  };

  const handleEdit = item => {
    idForUpdate = null;
    idForUpdate = item.itemsUID;
    itemForEdit = null;
    itemForEdit = item;
    setIsEdit(true);
  };

  const Delivery = () => {
    return (
      <View style={{margin: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            backgroundColor: 'white',
            padding: 10,
            alignItems: 'center',

            borderTopEndRadius: 10,
            borderTopLeftRadius: 10,
            borderWidth: 1,
            borderColor: '#CACACA',
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: {width: 0, height: 4},
          }}>
          {/* <Image
            style={{width: 12, height: 12, marginEnd: 10}}
            source={appImages.retaurentNote}
          /> */}
          <SvgXml style={{marginEnd: 10}} xml={appImagesSvg.deliveryTime} />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: RFValue(12),
              color: '#242424',
            }}>
            Delivery in 30 mins
          </Text>
        </View>

        <View
          style={{
            width: wp('90%'),

            alignSelf: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            padding: 10,
            marginTop: hp('-1%'),

            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#CACACA',
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: {width: 0, height: 4},
          }}>
          <View
            style={{
              width: wp('84%'),
              flexDirection: 'row',
              alignSelf: 'flex-start',
              justifyContent: 'space-between',

              marginTop: 10,
            }}>
            <View
              style={{
                width: wp('70%'),
                flexDirection: 'row',
              }}>
              {/* <Image
                style={{width: 12, height: 12, marginEnd: 10}}
                source={appImages.retaurentNote}
              /> */}
              <SvgXml style={{marginEnd: 10}} xml={appImagesSvg.markerColor} />
              <View>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: fonts.medium,
                    fontSize: RFValue(12),
                    color: '#242424',
                  }}>
                  Delivery at Home
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: fonts.medium,
                    fontSize: RFValue(11),
                    color: '#8A8A8A',
                  }}>
                  11, 1 Floor, Tower tdi, Narayana E Techno Sc...
                </Text>
                <AddInstruction />
              </View>
            </View>
            <SvgXml xml={appImagesSvg.rightArrow} />
          </View>

          <DotedLine />

          <View
            style={{
              width: wp('84%'),
              flexDirection: 'row',
              alignSelf: 'flex-start',
              justifyContent: 'space-between',

              marginTop: 10,
            }}>
            <View
              style={{
                width: wp('70%'),
                flexDirection: 'row',
              }}>
              {/* <Image
                style={{width: 12, height: 12, marginEnd: 10}}
                source={appImages.retaurentNote}
              /> */}
              <SvgXml style={{marginEnd: 10}} xml={appImagesSvg.phone_} />
              <View>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: fonts.medium,
                    fontSize: RFValue(12),
                    color: '#242424',
                  }}>
                  Rahul Garg, +91-9668236442
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: fonts.medium,
                    fontSize: RFValue(11),
                    color: '#8A8A8A',
                  }}>
                  +91-9668236442
                </Text>
              </View>
            </View>
            <SvgXml xml={appImagesSvg.rightArrow} />
          </View>

          <DotedLine />

          <View
            style={{
              width: wp('84%'),
              flexDirection: 'row',
              alignSelf: 'flex-start',
              justifyContent: 'space-between',

              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsBillDetail(!isBillDetail);
              }}>
              <View
                style={{
                  width: wp('70%'),
                  flexDirection: 'row',
                }}>
                <SvgXml style={{marginEnd: 10}} xml={appImagesSvg.totalBill} />
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.medium,
                        fontSize: RFValue(12),
                        color: '#242424',
                      }}>
                      Total Bill ₹460 ₹450
                    </Text>
                    <Text
                      style={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.medium,
                        fontSize: RFValue(10),
                        color: '#28B056',
                        borderRadius: 10,
                        marginLeft: 10,
                        paddingEnd: 6,
                        paddingStart: 6,
                        paddingTop: 2,
                        paddingBottom: 2,
                        backgroundColor: '#D6FFE4',
                      }}>
                      You saved ₹10
                    </Text>
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: 'flex-start',
                      fontFamily: fonts.medium,
                      fontSize: RFValue(11),
                      color: '#8A8A8A',
                    }}>
                    Incl. taxes and charges
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <SvgXml xml={appImagesSvg.rightArrow} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        bgColor={'white'}
        title={'Coupons'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: userOrgDistance ? '50%' : '40%',
        }}>
        <RecommendedOrderList />
      </ScrollView>

  
    </View>
  );
};

export default CouponsList;

const backBtn = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
<path d="M14.25 9H3.75" stroke="#595959" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 14.25L3.75 9L9 3.75" stroke="#595959" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
