import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {rootStore} from '../../../stores/rootStore';
import {SvgXml} from 'react-native-svg';
// import {styles} from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
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
let itemForEdit = null;

let idForUpdate = null;

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

const Cart = ({navigation, route}) => {
  const {restaurant} = route.params;
  const {setCart, getCart, updateCart} = rootStore.cartStore;
  const {appUser} = rootStore.commonStore;
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
    grandTotal: 0,
    couponDiscount: 0,
    topay: 0,
  });
  const [userOrgDistance, setUserOrgDistance] = useState(null);
  const [cartList, setCartList] = useState({});

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      getUserCart();
    }, []),
  );

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
  };

  const getUserCart = async () => {
    const cart = await getCart();
    console.log('getUserCart:-cart', cart);
    console.log('user cart', cart);
    setCartList(cart ?? {});
    if (cart?.food_item?.length > 0) {
      setAppCart({
        cartitems: cart?.food_item,
      });
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
      navigation.goBack();
    }
  };

  const handleIsNote = vale => {
    setIsOpenNote(vale);
  };
  const handleAddRemove = async (item, quan) => {
    console.log('cartList--', cartList, item, quan);
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
    await updateCart(updatedCartList, appUser, restaurant, cartList);
    setTimeout(() => {
      getUserCart();
    }, 500);
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
  const renderCartItem = ({item}) => {
    // console.log('item---renderCartItem', item);
    return (
      <View style={styles.itemContainer}>
        <Image
          source={
            item?.image?.length > 0
              ? {uri: Url?.Image_Url + item?.image}
              : appImages.foodIMage
          }
          resizeMode="cover"
          style={styles.image}
        />

        <Text numberOfLines={2} style={[styles.name, {fontSize: 14}]}>
          {item?.name}
        </Text>
        <View style={[styles.viewContainer]}>
          <Text style={styles.rating}>
            {currencyFormat(item?.selling_price)}
          </Text>
          <AddButton />
        </View>
      </View>
    );
  };

  const PlaceOrderBtn = ({}) => {
    return (
      <PaymentBtn
        onPressPay={() => {}}
        payText={'Google Pay'}
        onPressBuyNow={() => {
          handleOrderCreate();
        }}
        buyNowText={'Buy Now'}
      />
    );
  };

  const RecommendedOrderList = () => {
    return (
      <FlatList
        data={appCart?.cartitems}
        renderItem={renderCartItem}
        keyExtractor={item => item?.id}
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
        />

        {/* <CartInstructions
            appCart={appCart}
            onAction={(action, data) => {
              saveInstructions(action, data, appCart?.org_id, onSucces);
            }}
          /> */}
        <View style={styles.completeMealWithView}>
          <Text style={styles.titleText}>Complete your meal with</Text>
          <View style={styles.comMealListView}>{RecommendedOrderList()}</View>
        </View>
        {/* {offerCart?.length > 0 && ( */}
        <CartCoupanApply
          item={activeOffer?.coupon_code ? activeOffer : offerCart[0]}
          onApply={() => {
            onApplyOffer(offerCart[0], activeOffer?.coupon_code);
          }}
          applyTitle={activeOffer?.coupon_code ? 'Remove' : 'Apply'}
          onMoreCoupan={() => {
            navigation.navigate('couponsList', {
              restaurant: [],
            });
          }}
          btnTitle="View more coupons"
          getCartTotal={cartTotal}
        />

        {/* )} */}

        <View style={styles.addNowView}>
          <Text style={styles.titleText}>Missed something? Add now</Text>
          <View style={styles.addNewListView}>{RecommendedOrderList()}</View>
        </View>

        <View>
          <DeliveryCart
            DeliveryInMint={'Delivery in 30 mins'}
            address={'Delivery at Home'}
            locationAddress={'11, 1 Floor, Tower tdi, Narayana E Techno Sc...'}
            onAddInstruction={() => {
              setIsInstruction(!isInstruction);
            }}
            isTxtInst={isTxtInst}
            instuctions={instuctions}
            isAudio={isAudio}
            isPlaying={isPlaying}
            audioInstuctions={'Audio Instuctions'}
            nameWithNumber={'Rahul Garg, +91-9668236442'}
            number={'+91-9668236442'}
            onBillDetails={() => {
              setIsBillDetail(!isBillDetail);
            }}
            totalBill={'Total Bill'}
            cartBillG={cartBillG}
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
  buttonContainer: {
    paddingHorizontal: 15,
    backgroundColor: colors.colorEC, // Filled color (green in this case)
    borderWidth: 1,
    borderColor: colors.main, // Border color (slightly darker green)
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('3%'),
  },
  buttonText: {
    color: colors.main, // Text color
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    marginTop: 8,
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
    // textAlign: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '6%',
  },
  rating: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  listContainer: {
    paddingVertical: 10,
  },
  titleText: {
    fontSize: RFValue(16),
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
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,

    shadowOffset: {width: 0, height: 6},
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
