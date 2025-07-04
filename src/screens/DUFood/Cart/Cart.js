import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {rootStore} from '../../../stores/rootStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages} from '../../../commons/AppImages';
import {currencyFormat} from '../../../halpers/currencyFormat';
import Header from '../../../components/header/Header';
import {usePayment} from '../../../halpers/usePayment';
import CartItems from './CartItems';
import CartCoupanApply from './CartCoupanApply';
import {useFocusEffect} from '@react-navigation/native';
import CartItemUpdate from './CartItemUpdate';
import {colors} from '../../../theme/colors';
import BillSummary from '../Components/BillSummary';
import AddNote from '../Components/AddNote';
import DeliveryInstructions from '../Components/DeliveryInstructions';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import PaymentBtn from '../../../components/cta/PaymentBtn';
import DeliveryCart from './DeliveryCart';
import Url from '../../../api/Url';
import OrderCustomization from '../../../components/OrderCustomization';
import CompleteMealComp from '../../../components/CompleteMealComp';
import IncompletedAppRule from '../../../halpers/IncompletedAppRule';

let itemForEdit = null;
let idForUpdate = null;
let allCompleteMealList = [];
const Cart = ({navigation, route}) => {
  const {restaurant} = route.params;
  const {setCart, getCart, updateCart, selectedAddress} = rootStore.cartStore;
  const {appUser} = rootStore.commonStore;
  const {foodOrder, getCompleteMealItems, mealOrderList} =
    rootStore.foodDashboardStore;
  const {getRestaurantOffers, restaurentOfferCoupan, applyCoupon,} =
    rootStore.dashboardStore;
  const [isPlaying, setIsPLayig] = useState(false);
  const [appCart, setAppCart] = useState({
    cartitems: [],
  });
  const [cartTotal, setCartTotal] = useState(0);
  const [isAudio, setIsAudio] = useState(false);
  const [isTxtInst, setIsTxtInst] = useState(true);
  const [instuctions, setInstuctions] = useState(
    'Add instructions for delivery partner',
  );
  const [instuctionsArray, setInstuctionsArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeOffer, setActiveOffer] = useState({});
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isBillDetail, setIsBillDetail] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(false);
  const [isInstruction, setIsInstruction] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(
     selectedAddress?.address?.length > 0
      ? selectedAddress
      : appUser?.addresses[0] ?? {},
  );
  const [appUserData ,setAppUserData]=useState(appUser ?? {})

  // const [cartBillG, setCartBillG] = useState(null);
  const [cartBillG, setCartBillG] = useState({
    cartTotal: 0,
    platformFree: 0,
    deliveryFree: 0,
    gstRestorentCharges: 0,
    grandTotal: 0,
    couponDiscount: 0,
    topay: 0,
  });
  const [userOrgDistance, setUserOrgDistance] = useState(null);
  const [cartList, setCartList] = useState({});
  const [completeMealAllList, setCompleteMealAllList] = useState(
    mealOrderList ?? [],
  );
  const [completeMealList, setCompleteMealList] = useState(mealOrderList ?? []);
  const [missedSomeList, setMissedSomeList] = useState(mealOrderList ?? []);
  const [mealLoading, setMealLoading] = useState(
    mealOrderList?.length > 0 ? false : true,
  );
  const [addANote, setAddANote] = useState('');
  const [offerList, setOfferList] = useState(restaurentOfferCoupan ?? []);

  console.log('deliveryAddress---', deliveryAddress);

  useFocusEffect(
    useCallback(() => {
      const {appUser} = rootStore.commonStore;
      handleAndroidBackButton(navigation);
      getUserCart();
      // if (restaurant) {
      //   getCompMealList();
      // }
      setDeliveryAddress(
        selectedAddress?.address?.length > 0
          ? selectedAddress
          : appUser?.addresses[0] ?? {},
      );
      allCompleteMealList = mealOrderList;
      setAppUserData(appUser)
    }, [selectedAddress]),
  );

  // console.log("appUser cart --",appUser);

  useEffect(() => {
    if(cartList?._id?.length > 0){
    getRestaurantOffersData();
    }
    if (restaurant) {
      getCompMealList();
    }
  }, [restaurant,cartList]);

  const getRestaurantOffersData = async () => {
    const restaurantCoupans = await getRestaurantOffers(
      cartList,
      handleOffersLoading,
    );
    console.log('restaurantCoupans--', restaurantCoupans);
    if (restaurantCoupans?.length > 0) {
      console.log('restaurantCoupans--', restaurantCoupans);
      setOfferList(restaurantCoupans);
    } else {
      setOfferList([]);
    }
  };

  const handleOffersLoading = v => {
    console.log('v---', v);
  };

  const getCompMealList = async () => {
    const res = await getCompleteMealItems(restaurant, handleMealLoading);
    console.log('res---getCompMealList', res);
    setCompleteMealAllList(res);
    allCompleteMealList = res;
    if (res?.length > 3) {
      const mealList = res || [];
      const middleIndex = Math.ceil(mealList.length / 2);
      // Splitting into two parts
      const firstHalf = mealList.slice(0, middleIndex);
      const secondHalf = mealList.slice(middleIndex);
      // console.log('firstHalf,secondHalf', firstHalf, secondHalf);
      setCompleteMealList(firstHalf);
      setMissedSomeList(secondHalf);
    } else {
      setCompleteMealList(res);
      setMissedSomeList([]);
    }

    // setCompleteMealList(firstHalf);
    // setMissedSomeList(secondHalf);
  };

  const handleMealLoading = v => {
    setMealLoading(v);
  };

  const handleSuccess = data => {
    setCartEmpty();
    navigation.navigate('orderPlaced', {orderData: data});
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const setFoodOrderData = async paymentId => {
    let payload = {
      invoice_no: 'INV123456',
      customer_id: appUser?._id,
      status: 'waiting_for_confirmation',
      item_sub_total_amount: 100.5,
      after_discount_sub_amt: 90.0,
      total_amount: cartBillG?.topay,
      coupon_code: 'DISCOUNT20',
      tax_amount: 10.0,
      coupon_amount: 5.0,
      packing_fee: 5.0,
      payment_method_id: 'credit_card',
      amount_recived: 100.0,
      transaction_id: paymentId,
      order_id: 'ORD98765',
      restaurant_id: cartList?.restaurant_id,
      otp: '123456',
      reason_of_cancellation: 'Customer changed mind',
      delivery_time: '2025-02-15T14:30:00Z',
      notified: 0,
      distance_from_customer: '5.2',
      dilevery_time: '2025-02-15T14:30:00Z',
      cooking_time: '45 minutes',
      verification_code: 'VER12345',
      refund_amt: 0.0,
      refund_status: 'norefund',
      review_skipped: 0,
      remaining_balance_amt: 0.0,
      org_pay_amt: 95.0,
      admin_pay_amt: 90.0,
      cart_items: cartList?.cart_items,
      cart_id: cartList?._id,
      delivery_instructions: {
        audio: instuctions ?? '',
        instructions: instuctionsArray ?? [],
      },
      addon_notes: addANote ?? '',
      delivery_address: deliveryAddress ?? {},
    };

    console.log('payload---', payload);
    // return

    await foodOrder(payload, handleLoading, navigation);
  };

  const onSuccess = data => {
    console.log('onSuccess---', data);
    let paymentId = data?.razorpay_payment_id;

    setFoodOrderData(data?.razorpay_payment_id);

    // navigation.navigate('orderPlaced', {
    //   restaurant: [],
    //   // restaurant: isOtherCart?.orgdata,
    // });
  };

  const onError = () => {
    setLoading(false);
  };

  const handleOrderCreate = async () => {
    // console.log('cartBillG---', cartBillG);

    usePayment(cartBillG, onSuccess, onError);
  };

  const getUserCart = async () => {
    const cart = await getCart();
    // console.log('getUserCart:-cart', cart);
    // console.log('user cart', cart);
    setCartList(cart ?? {});
    if (cart?.food_item?.length > 0) {
      setAppCart({
        cartitems: cart?.food_item,
      });
      setTimeout(() => {
        onCheckMealItem(cart?.food_item);
      }, 500);
      if (
        cart?.grand_total < activeOffer?.discount_price &&
        cart?.offer?._id?.length > 0
      ) {
        // setActiveOffer({});
        onApplyOffer(cart?.offer);
      }
      if (cart?.offer?._id?.length > 0) {
        setActiveOffer(cart?.offer);
      } else {
        setActiveOffer({});
      }
      setCartBillG({
        cartTotal: cart?.grand_total,
        platformFree: 5,
        deliveryFree: 10,
        gstRestorentCharges: 20,
        grandTotal: cart?.grand_total + 5 + 10 + 20,
        couponDiscount: 100,
        topay: cart?.grand_total + 5 + 10 + 20 - 10,
      });
      // getUserOrgDistance(cart?.org_id);
    } else {
      setActiveOffer({});
      onCheckMealItem([]);
      navigation.goBack();
    }
  };

  const handleIsNote = vale => {
    setIsOpenNote(vale);
  };
  // console.log('addANote--', addANote);

  const handleAddRemove = async (item, quan) => {
    // console.log('cartList--', cartList, item, quan);
    let addOnData = {
      food_item_id: item?._id,
      add_on_items: item?.selected_add_on ?? [],
    };

    let updatedCartList = cartList?.cart_items?.map(data => {
      if (data?.food_item_id == item?._id) {
        return {...data, quantity: quan};
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
      cartList,
      addOnData,
    );
    if (resUpdateCart?.statusCode == 200) {
      getUserCart();
    }
  };

  const onSucces = () => {
    getUserCart();
    // if(data){
    //   setActiveOffer(data)
    // }else{
    //   setActiveOffer({})
    // }
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

  const onCheckMealItem = foodItemArray => {
    console.log(
      'foodItemArray--',
      foodItemArray,
      allCompleteMealList,
      completeMealAllList,
    );
    if (foodItemArray?.length > 0 && allCompleteMealList?.length > 0) {
      let mealListData = (allCompleteMealList ?? []).map(item => {
        const exactItem = foodItemArray?.find(
          data => data?._id === item?.food_items?._id,
        );
        return exactItem
          ? {
              ...item,
              food_items: {
                ...item.food_items, // Keep existing properties
                quantity: exactItem?.quantity, // ✅ Update quantity inside `item.food_items`
              },
            }
          : {
              ...item,
              food_items: {
                ...item.food_items, // Keep existing properties
                quantity: 0, // ✅ Update quantity inside `item.food_items`
              },
            };
      });
      // console.log('mealListData--', mealListData);
      // Ensure a state update with a new reference
      if (mealListData?.length > 3) {
        const mealList = mealListData || [];
        const middleIndex = Math.ceil(mealList.length / 2);
        // Splitting into two parts
        const firstHalf = mealList.slice(0, middleIndex);
        const secondHalf = mealList.slice(middleIndex);
        // console.log('firstHalf,secondHalf', firstHalf, secondHalf);
        setCompleteMealList(firstHalf);
        setMissedSomeList(secondHalf);
        setCompleteMealAllList(mealListData);
      } else {
        setCompleteMealList(mealListData);
        setCompleteMealAllList(mealListData);
        setMissedSomeList([]);
      }
    } else {
      getCompMealList();
    }
  };

  // const checkAvailabilityById = getCartList?.food_item?.find(
  //   cartItem => cartItem?._id === item?._id,
  // );
  // console.log('getCartList checkAvailability', checkAvailabilityById,);
  // let addOnData ={
  //   food_item_id: item?._id,
  //   add_on_items: checkAvailabilityById?.selected_add_on ?? []
  // }

  const handleAddDecMeal = async (item, quan) => {
    // console.log('item ,quan---', item, quan, item?.food_items?.restaurant_id);
    // return

    let restaurant = {
      _id: item?.food_items?.restaurant_id,
    };
    let newItem = {
      ...item,
      ...item.food_items,
      quantity: quan,
      food_item_id: item?.food_items?._id,
      food_item_price: item?.food_items?.selling_price,
    };

    // console.log('item,quan,handleAddRemove', item, quan,newItem,item?.restaurant_id || item?.item?.restaurant_id, item?.item?.restaurant_id);
    const getCartList = {...cartList};

    // console.log('getCartList handleAddRemove:-', getCartList, item, restaurant,item?.restaurant_id || item?.item?.restaurant_id,item?.item?.restaurant_id);

    if (getCartList?.cart_items?.length > 0) {
      // const checkAvailabilityById = getCartList?.cart_items?.find(
      //   cartItem => cartItem?.food_item_id === item?.food_items?._id,
      // );
      const checkAvailabilityById = getCartList?.food_item?.find(
        cartItem => cartItem?._id === item?.food_items?._id,
      );
      // console.log('getCartList checkAvailability', checkAvailabilityById);

      let addOnData = {
        food_item_id: item?.food_items?._id,
        add_on_items: checkAvailabilityById?.selected_add_on ?? [],
      };

      let updatedCartList = getCartList?.cart_items;

      if (checkAvailabilityById) {
        updatedCartList = getCartList?.cart_items?.map(data => {
          if (data?.food_item_id == item?.food_items?._id) {
            return {...data, quantity: quan};
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
          getUserCart();
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
          getUserCart();
        }
      }
    } else {
      // console.log('setCart--first', [newItem], appUser, restaurant);
      const resSetCart = await setCart([newItem], appUser, restaurant);
      if (resSetCart?.restaurant_id?.length > 0) {
        getUserCart();
      }
    }
  };

  const renderCartItem = ({item, index}) => {
    // console.log('item---renderCartItem', item);
    return (
      <CompleteMealComp
        item={item}
        index={index}
        handleAddDecMeal={handleAddDecMeal}
      />
    );
  };

  const PlaceOrderBtn = ({}) => {
    return (
      <PaymentBtn
        // onPressPay={() => {
        //   navigation.navigate('trackingFoodOrderList');
        // }}
        payText={'Google Pay'}
        onPressBuyNow={() => {
          handleOrderCreate();
        }}
        buyNowText={'Buy Now'}
      />
    );
  };

  const CompletedMealOrderList = () => {
    return (
      <FlatList
        data={completeMealList}
        renderItem={renderCartItem}
        keyExtractor={item => item?.food_items?._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const MissedSomeThingsList = () => {
    return (
      <FlatList
        data={missedSomeList}
        renderItem={renderCartItem}
        keyExtractor={item => item?.food_items?._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const onApplyOffer = async item => {
    if (activeOffer?._id == item?._id) {
      await applyCoupon(cartList, null, handleLoadingOffer, onSucces);
    } else {
      await applyCoupon(cartList, item, handleLoadingOffer, onSucces);
    }
  };

  const onCoupanSelected = item => {
    onApplyOffer(item);
  };
  // console.log('offerList--', offerList, activeOffer);

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

  const onPressLocation = () => {
    // console.log('onPressLocation---');
    navigation.navigate('myAddress', {screenName: 'cart'});
  };

  const hanldeSelectAddNote = item => {
    setAddANote(item);
  };
  // console.log('setAddANote=--', addANote);

  return (
    <View style={styles.container}>
      <Header
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
          addANote={addANote}
        />

        {/* <CartInstructions
            appCart={appCart}
            onAction={(action, data) => {
              saveInstructions(action, data, appCart?.org_id, onSucces);
            }}
          /> */}
        {completeMealList?.length > 0 && (
          <View style={styles.completeMealWithView}>
            <Text style={styles.titleText}>Complete your meal with</Text>
            <View style={styles.comMealListView}>
              {CompletedMealOrderList()}
            </View>
          </View>
        )}

        {offerList?.length > 0 && (
          <CartCoupanApply
            item={activeOffer?.referral_code ? activeOffer : offerList[0]}
            onApply={item => {
              onApplyOffer(item);
            }}
            applyTitle={activeOffer?.referral_code ? 'Remove' : 'Apply'}
            onMoreCoupan={() => {
              navigation.navigate('couponsList', {
                restaurant: restaurant,
                selectedOffers: activeOffer,
                onCoupanSelected: onCoupanSelected,
                couponList: offerList,
                getCartTotal: cartBillG,
              });
            }}
            btnTitle="View more coupons"
            getCartTotal={cartBillG}
          />
        )}
        {missedSomeList?.length > 0 && (
          <View style={styles.addNowView}>
            <Text style={styles.titleText}>Missed something? Add now</Text>
            <View style={styles.addNewListView}>{MissedSomeThingsList()}</View>
          </View>
        )}

        <View>
          <DeliveryCart
            DeliveryInMint={'Delivery in 30 mins'}
            address={
              deliveryAddress?.title?.length > 0
                ? `Delivery at ${deliveryAddress?.title}`
                : 'Add loaction'
            }
            locationAddress={
              deliveryAddress?.address?.length > 0
                ? deliveryAddress?.address
                : 'Please add delivert loacation first'
            }
            onAddInstruction={() => {
              setIsInstruction(!isInstruction);
            }}
            isTxtInst={isTxtInst}
            instuctions={instuctions}
            txtInstArray={instuctionsArray}
            isAudio={isAudio}
            isPlaying={isPlaying}
            audioInstuctions={'Audio Instuctions'}
            nameWithNumber={`${appUser?.name}, +91-${appUser?.phone}`}
            number={`+91-${deliveryAddress?.phone}`}
            onBillDetails={() => {
              setIsBillDetail(!isBillDetail);
            }}
            totalBill={'Total Bill'}
            cartBillG={cartBillG}
            onPressLocation={onPressLocation}
          />
        </View>

        {/* <CartBill
          appCart={appCart}
          billdetail={bill => {
            setCartTotal(bill.cartTotal);
            setTax(bill.tax);
            setCartBillG(bill);
          }}
          activeOffer={activeOffer}
        /> */}

        <View style={styles.cancelationPolicyView}>
          <Text style={styles.cancellationPilocyText}>
            Cancellation Policy :
          </Text>
          <Text style={styles.aviodCancellationText}>
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
        addNote={addANote}
        onSelectAddNote={hanldeSelectAddNote}
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
            // setIsTxtInst(false);
          } else {
            setIsAudio(false);
            // setIsTxtInst(true);
            setInstuctions('Add instructions for delivery partner');
          }
        }}
        txtInstArray={instuctionsArray}
        txtInstuctions={data => {
          if (data !== null) {
            console.log('data>', data);
            // setIsInstruction(false);
            if (data?.length > 0) {
              setInstuctionsArray(data);
              // const commaSeparatedString = data?.join(', ');
              // console.log(commaSeparatedString);
              // setInstuctions(commaSeparatedString);
              // setIsAudio(false);
              // setIsTxtInst(true);
            } else {
              setInstuctionsArray([]);
            }
          } else {
            setInstuctionsArray([]);
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

      {/* <CartItemUpdate
        visible={isEdit}
        close={() => setIsEdit(false)}
        onUpdate={async (quan, sellAmount, vcId, vcName, addons, iPrice) => {
          // console.log(
          //   'values:--',
          //   quan,
          //   sellAmount,
          //   vcId,
          //   vcName,
          //   addons,
          //   iPrice,
          // );
          setIsEdit(false);
          const resUpdateCart = await updateCartItem(
            itemForEdit?.product,
            quan,
            vcId,
            vcName,
            sellAmount,
            addons,
            iPrice,
            idForUpdate,
          );
          if (resUpdateCart?.statusCode == 200) {
            getUserCart();
          }
        }}
        cartItem={itemForEdit}
        product={itemForEdit?.addon}
      /> */}

      {(appUser?.profile_pic?.length > 0 ||
        appUser?.email?.length > 0 ||
        appUser?.phone?.length > 0) ? 
          null :(
          <IncompletedAppRule
            title={'App Confirmation'}
            message={' Please add your address first.'}
            onHanlde={() => onPressLocation()}
          />
        )}
        
      {(appUserData?.profile_pic == null || 
       appUserData?.profile_pic?.length === 0) && (
        <IncompletedAppRule
          title={'App Confirmation'}
          message={'Please complete your profile first.'}
          onHanlde={() => navigation.navigate('profile',{screenName:'foodRoute'})}
        />
      )}


      {( Object.keys(deliveryAddress)?.length === 0) && (
        <IncompletedAppRule
          title={'App Confirmation'}
          message={'Please add your address first.'}
          onHanlde={() => onPressLocation()}
        />
      )}
      <OrderCustomization
        isResOpen={isEdit}
        appCart={cartList}
        // setFullImage={setFullImage}
        visible={isEdit}
        close={() => setIsEdit(false)}
        item={itemForEdit}
        // imageUrl={imageUrl}
        addToCart={async (quan, sellAmount, vcId, vcName, addons, iPrice) => {
          console.log(
            'modal ckilc data',
            quan,
            sellAmount,
            vcId,
            vcName,
            addons,
            iPrice,
            itemForEdit,
          );
          // setItemModal(false);
          setIsEdit(false);
          let addOnData = {
            food_item_id: itemForEdit?._id,
            add_on_items: addons ?? [],
          };

          const getCartList = {...cartList};
          console.log(
            'getCartList OrderCustomization:-',
            getCartList,
            itemForEdit,
          );

          let updatedCustomizeItem = {
            ...itemForEdit,
            selling_price: sellAmount,
            quantity: quan,
            food_item_id: itemForEdit?._id,
            food_item_price: sellAmount,
            selected_add_on: addons ?? [],
          };

          if (Array?.isArray(getCartList?.cart_items)) {
            const checkAvailabilityById = getCartList?.cart_items?.find(
              cartItem => cartItem?.food_item_id === updatedCustomizeItem?._id,
            );
            // console.log('getCartList checkAvailability', checkAvailabilityById);
            // if (getCartList?.restaurant_id == updatedCustomizeItem?.restaurant_id) {
            let updatedCartList = getCartList?.cart_items;
            if (checkAvailabilityById) {
              updatedCartList = getCartList?.cart_items?.map(data => {
                if (data?.food_item_id == updatedCustomizeItem?._id) {
                  return {...data, quantity: quan, food_item_price: sellAmount};
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
                getUserCart();
              }
            } else {
              // console.log('updateCart--', updatedCartList, appUser, restaurant, [
              //   newItem,
              // ]);
              const resUpdateCart = await updateCart(
                [...updatedCartList, ...[updatedCustomizeItem]],
                appUser,
                restaurant,
                getCartList,
                addOnData,
              );
              if (resUpdateCart?.statusCode == 200) {
                getUserCart();
              }
            }
            //  }
            //  else{
            //   setClickItem(updatedCustomizeItem);
            //   setIsRemoveCart(true);
            // }
          } else {
            console.log('setCart--first', appUser, restaurant, [
              updatedCustomizeItem,
            ]);
            const resSetCart = await setCart(
              [updatedCustomizeItem],
              appUser,
              restaurant,
            );
            if (resSetCart?.restaurant_id?.length > 0) {
              getUserCart();
            }
          }
        }}
      />
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  listContainer: {
    paddingVertical: 10,
    paddingRight: '15%',
  },
  titleText: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '2.5%',
    marginStart: 10,
  },
  completeMealWithView: {
    marginTop: '4%',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 6},
  },
  comMealListView: {
    marginTop: '2%',
    justifyContent: 'center',
  },
  addNowView: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 6},
    marginTop: '4%',
  },
  addNewListView: {
    marginTop: '3%',
    justifyContent: 'center',
  },
  cancelationPolicyView: {
    marginHorizontal: 20,
    marginTop: '5%',
    justifyContent: 'center',
  },
  cancellationPilocyText: {
    color: colors.red,
    fontFamily: fonts.regular,
    fontSize: RFValue(10),
  },
  aviodCancellationText: {
    color: colors.color64,
    fontFamily: fonts.regular,
    fontSize: RFValue(10),
    lineHeight: 18,
  },
});
