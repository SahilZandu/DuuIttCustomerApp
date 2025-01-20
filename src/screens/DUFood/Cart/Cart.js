import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {rootStore} from '../../../stores/rootStore';
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
import {usePayment} from '../../../halpers/usePayment';
import CartItems from './CartItems';
// import CartInstructions from './CartInstructions';
import CartBill from './CartBill';
// import CTA from '../Components/CTA/CTA';
// import PickedOrderModalComponent from '../Components/PickedOrderModalComponent';
// import RazorpayCheckout from 'react-native-razorpay';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import CartCoupanApply from './CartCoupanApply';
import {useFocusEffect} from '@react-navigation/native';
import CartItemUpdate from './CartItemUpdate';
// import Base_Image_Url from '../api/Url';
// import CancellationPolicy from './CancellationPolicy';
// import PerparationNotice from './PerparationNotice';
// import { usePayment } from '../helpers/usePayment';
import DotedLine from '../Components/DotedLine';
import {colors} from '../../../theme/colors';
import BillSummary from '../Components/BillSummary';
import AddNote from '../Components/AddNote';
import DeliveryInstructions from '../Components/DeliveryInstructions';
import {
  Waveform,
  IWaveformRef,
  UpdateFrequency,
  PlayerState,
  FinishMode,
} from '@simform_solutions/react-native-audio-waveform';
let itemForEdit = null;

let idForUpdate = null;

const Cart = ({navigation, route}) => {
  const {restaurant} = route.params;
  const stref = useRef(null);
  const [isPlaying, setIsPLayig] = useState(false);
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

  const {
    //   getCart,
    setCart,
    //   setCartEmpty,
    //   saveInstructions,
    //   updateCartItem,
    //   applyCoupon,
    //   removeApplyCoupon,
    //   getCouponList,
    //   cartOffer,
    //   checkCartIsVaild,
  } = rootStore.cartStore;

  // const {createOrder, getOrgDistance} = rootStore.orderStore;

  // const imageUrl = Base_Image_Url?.Base_Image_UrlProduct;

  // const [appCart, setAppCart] = useState(null);
  const {saveCartItem, loadCartList} = rootStore.cartStore;

  const [appCart, setAppCart] = useState({
    cartitems: [],
  });
  const [cartTotal, setCartTotal] = useState(0);
  const [isAudio, setIsAudio] = useState(false);
  const [isTxtInst, setIsTxtInst] = useState(true);
  const [instuctions, setInstuctions] = useState(
    'Add instructions for delivery partner',
  );

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

  // const [cartBillG, setCartBillG] = useState(null);
  const [cartBillG, setCartBillG] = useState({
    cartTotal: 0,
    platformFree: 0,
    deliveryFree: 0,
    gstRestorentCharges: 0,
    grandTotal:0,
    couponDiscount:0,
    topay:0,
  
  });
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

  const startNewPlayer = async () => {
    // currentPlayingRef = stref;
    if (stref.current?.currentState === PlayerState.paused) {
      await stref.current?.resumePlayer();
    } else {
      console.log('ply>');
      setIsPLayig(!isPlaying);
      await stref.current?.startPlayer({
        finishMode: FinishMode.stop,
      });
    }
  };

  const stopPlayer = async () => {
    if (stref?.current?.currentState === PlayerState.playing) {
      setIsPLayig(false);
      stref?.current?.stopPlayer();
    }
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
        {isTxtInst && (
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: RFValue(11),
              color: '#242424',
            }}>
            {instuctions}
          </Text>
        )}

        {isAudio && (
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: 'row',
              width: '90%',
              backgroundColor: 'white',
              alignItems: 'center',
            }}>
            <SvgXml
              xml={isPlaying ? appImagesSvg.stopRed : appImagesSvg.playRed}
            />
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: RFValue(11),
                color: '#242424',
                marginLeft: 10,
              }}>
              {'Audio Instuctions'}
            </Text>
            {/* <TouchableOpacity
                  onPress={() => {
                    isPlaying ? stopPlayer() : startNewPlayer();
                  }}>
                  <SvgXml
                    xml={
                      isPlaying ? appImagesSvg.stopRed : appImagesSvg.playRed
                    }
                  />
                   
                </TouchableOpacity>
                <View
                  style={{
                    marginLeft: 10,
                    width: '80%',
                    justifyContent: 'center',
                    height: 20,
                    paddingEnd:20
                    
                  }}>
                  <Waveform
                    mode="static"
                    ref={stref}
                    path={instuctions}
                    candleSpace={2}
                    candleWidth={4}
                    scrubColor="#28B056"
                    waveColor="gray"
                    onPlayerStateChange={playerState => {
                      console.log('playerState', playerState);
                      if (playerState === 'stopped') {
                        setIsPLayig(false);
                      }
                    }}
                    onPanStateChange={isMoving => console.log(isMoving)}
                    onCurrentProgressChange={(
                      currentProgress,
                      songDuration,
                    ) => {
                      console.log(
                        `currentProgress ${currentProgress}, songDuration ${songDuration}`,
                      );
                    }}
                  />
                </View> */}
          </View>
        )}
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
    // createOrder(appCart, cartBillG, handleSuccess, handleLoading, paymentId);
    navigation.navigate('orderPlaced', {
      restaurant: [],
      // restaurant: isOtherCart?.orgdata,
    });
  };

  const onError = () => {
    setLoading(false);
  };

  const handleOrderCreate = async () => {
    usePayment(cartBillG, onSuccess, onError);
    // setLoading(true);

    // let checkIsCartValid = await checkCartIsVaild();

    // console.log('get cart is valid:', checkIsCartValid);

    // if (checkIsCartValid) {
    //    usePayment(cartBillG,onSuccess, onError)
    //   //  createOrder(appCart, cartBillG, handleSuccess, handleLoading);
    // } else {
    //   setLoading(false);
    // }
  };

  const getUserCart = async () => {
    const cart = await loadCartList();
    console.log('user cart', cart);
    if (cart) {
      setAppCart({
        cartitems: cart,
      });
      let finalPrice = 0;
      cart.map(
        (item, key) => (finalPrice = finalPrice + item.finalprice),
      );
      let discount = 10;
console.log('finalPrice>',finalPrice);
      // const afterDicountPrice = finalPrice - discount;
      setCartBillG({
        cartTotal: finalPrice,
        platformFree: 5,
        deliveryFree: 10,
        gstRestorentCharges: 20,
        grandTotal:finalPrice+5+10+20,
        couponDiscount:100,
        topay:(finalPrice+5+10+20)-100,
      });
      // getUserOrgDistance(cart?.org_id);
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
    const iPrice = item?.finalprice;

    // quantity: quan,
    // sellingprice: sellAmount,
    // addons: addons,
    // subtotalprice: iPrice,
    // finalprice: iPrice * quan,
    // productname: title,
    // veg_non_veg: veg_non_veg,
    // productdescription: description,
    // productid: prdId,
    // product_id:prdId,
    // itemsUID:prdId,
    console.log('clicked>');
    await setCart(
      item,
      quan,
      vcId,
      vcName,
      vcPrice,
      restaurant,
      addons,
      iPrice,
    );
    setTimeout(() => {
      getUserCart(); 
    }, 800);
   
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
  const PlaceOrderBtn = ({appCart, userOrgDistance}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,

          alignItems: 'center',
          borderTopEndRadius: 10,
          borderTopLeftRadius: 10,

          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 4},
          justifyContent: 'center',

          width: '100%',
          padding: '5%',
        }}>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SvgXml style={{marginEnd: 6}} xml={appImagesSvg.googlePay} />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: RFValue(14),
              color: colors.black,
            }}>
            Google Pay
          </Text>
          <SvgXml
            style={{
              marginLeft: 6,
            }}
            xml={appImagesSvg.greenBottomArrow}
          />
        </View> */}

        <TouchableOpacity
          onPress={() => {
            handleOrderCreate();
          }}>
          <Text
            style={{
              backgroundColor: '#28B056',
              width: wp('90%'),
              borderRadius: 20,
              height: 45,
              fontFamily: fonts.medium,
              fonts: RFValue(20),
              overflow: 'hidden',
              color: colors.white,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
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
    console.log('handleEdit>', item);
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          alignSelf: 'flex-start',
                          fontFamily: fonts.medium,
                          fontSize: RFValue(12),
                          color: '#242424',
                        }}>
                        Total Bill
                      </Text>

                      {/* Line in center */}
                      <View
                        style={{
                          
                          height: 1,
                          backgroundColor: 'gray',
                          marginHorizontal: 5, // Space between text and line
                        }}
                      />

                      {/* cartTotal with gray color and underline */}
                      <Text
                        style={{
                          color: 'gray',
                          textDecorationLine: 'line-through', 
                          fontFamily: fonts.medium,
                          fontSize: RFValue(12),
                        }}>
                          
                        {currencyFormat(cartBillG.cartTotal)}
                      </Text>

                      {/* After Discount Price */}
                     
                    </View>
                    <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: RFValue(12),
                          color: '#242424',
                          marginLeft:4,
                        }}>
                           
                        {currencyFormat(cartBillG.topay)}
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
        title={'Cart'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />

      {/* {appCart && ( */}

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: userOrgDistance ? '50%' : '40%',
        }}>
        {/* <CartHeader appCart={appCart} /> */}
        <CartItems
          isCartScreen={true}
          appCart={appCart}
          handleAddRemove={handleAddRemove}
          onEdit={handleEdit}
          isOpen={isOpenNote}
          handlenoteVisibility={handleIsNote}
        />

        {/* <CartInstructions
            appCart={appCart}
            onAction={(action, data) => {
              saveInstructions(action, data, appCart?.org_id, onSucces);
            }}
          /> */}
        <View
          style={{
            marginTop: '2%',
            backgroundColor: 'white',
            height: 220,

            margin: 20,
            borderRadius: 10,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,

            shadowOffset: {width: 0, height: 6},
          }}>
          <Text style={styles.titleText}>Complete your meal with</Text>
          <View style={{marginTop: 10}}>
            <RecommendedOrderList />
          </View>
        </View>
        {/* {offerCart?.length > 0 && ( */}
        <CartCoupanApply
          item={activeOffer?.coupon_code ? activeOffer : offerCart[0]}
          onApply={() => {
            onApplyOffer(offerCart[0], activeOffer?.coupon_code);
          }}
          applyTitle={activeOffer?.coupon_code ? 'Remove' : 'Apply'}
          onMoreCoupan={() => {
            // navigation.navigate('coupan', {
            //   restaurantOffer: offerCart,
            //   totalPrice: cartTotal,
            // });

            navigation.navigate('couponsList', {
              restaurant: [],
              // restaurant: isOtherCart?.orgdata,
            });
          }}
          btnTitle="View more coupons"
          getCartTotal={cartTotal}
        />

        {/* )} */}

        <View
          style={{
            marginTop: '2%',
            backgroundColor: 'white',
            height: 220,

            margin: 20,
            borderRadius: 10,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,

            shadowOffset: {width: 0, height: 6},
          }}>
          <Text style={styles.titleText}>Missed something? Add now</Text>
          <View style={{marginTop: 10}}>
            <RecommendedOrderList />
          </View>
        </View>

        <Delivery />

        {/* <CartBill
          appCart={appCart}
          billdetail={bill => {
            setCartTotal(bill.cartTotal);
            setTax(bill.tax);
            setCartBillG(bill);
          }}
          activeOffer={activeOffer}
        /> */}

        {/* <CancellationPolicy values={{}} /> */}
        <View style={{margin: 20}}>
          <Text
            style={{
              color: '#E95D5D',
              fontFamily: fonts.regular,
              fontSize: RFValue(10),
            }}>
            Cancellation Policy :
          </Text>
          <Text
            style={{
              color: '#646464',
              fontFamily: fonts.regular,
              fontSize: RFValue(10),
            }}>
            Avoid Cancellation as it leads to food wastage. The amount paid is
            non- refundable after placing the order.
          </Text>
        </View>
      </ScrollView>

      <BillSummary
        // menu={orgMenu}
        visible={isBillDetail}
        cartBillG={cartBillG}
        onClose={() => setIsBillDetail(false)}
        onSelectMenu={key => {
          scrollToGroup_(key);
        }}
      />
      <AddNote
        // menu={orgMenu}
        visible={isOpenNote}
        onClose={() => setIsOpenNote(false)}
        onSelectMenu={key => {
          scrollToGroup_(key);
        }}
      />
      <DeliveryInstructions
        // menu={orgMenu}
        visible={isInstruction}
        onClose={() => setIsInstruction(false)}
        // onSelectMenu={key => {
        //   scrollToGroup_(key);
        // }}
        audioInstruction={data => {
          // setIsInstruction(false);
          if (data !== null) {
            console.log('audioInstruction>', data);
            setInstuctions(data);
            setIsAudio(true);
            setIsTxtInst(false);
          } else {
            setIsAudio(false);
            setIsTxtInst(true);
            setInstuctions('Add instructions for delivery partner');
          }
        }}
        txtInstuctions={data => {
          if (data !== null) {
            console.log('data>', data);
            // setIsInstruction(false);
            if (data.length > 0) {
              const commaSeparatedString = data.join(', ');
              console.log(commaSeparatedString);
              setInstuctions(commaSeparatedString);
              setIsAudio(false);
              setIsTxtInst(true);
            }
          } else {
            setInstuctions('Add instructions for delivery partner');
          }
        }}
      />
      {/* )} */}

      {/* {appCart && ( */}

      <PlaceOrderBtn appCart={appCart} userOrgDistance={userOrgDistance} />

      {/* )} */}

      {/* 
      <PickedOrderModalComponent
        visible={visible}
        setVisible={setVisible}
        title1="Order placed successfully"
        title2="Your order has been successfully placed. We will process your order shortly."
        BtnTitle="Place new Order"
        onPress={() => {
          navigation.navigate('dash');
          setVisible(false);
        }}
      /> */}

      <CartItemUpdate
        visible={isEdit}
        close={() => setIsEdit(false)}
        onUpdate={async (quan, sellAmount, vcId, vcName, addons, iPrice) => {
          console.log(
            'values:--',
            quan,
            sellAmount,
            vcId,
            vcName,
            addons,
            iPrice,
          );
          setIsEdit(false);
          await updateCartItem(
            itemForEdit?.product,
            quan,
            vcId,
            vcName,
            sellAmount,
            addons,
            iPrice,
            idForUpdate,
          );
          getUserCart();
        }}
        cartItem={itemForEdit}
        product={itemForEdit?.addons}
        // product={itemForEdit?.products}
        // imageUrl={imageUrl}
      />
    </View>
  );
};

export default Cart;

const backBtn = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
<path d="M14.25 9H3.75" stroke="#595959" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 14.25L3.75 9L9 3.75" stroke="#595959" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
