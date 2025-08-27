import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  Platform,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fonts } from '../theme/fonts/fonts';
import { appImagesSvg, appImages } from '../commons/AppImages';
import Action from '../components/Action';
import { RFValue } from 'react-native-responsive-fontsize';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { currencyFormat } from '../halpers/currencyFormat';
import OrderVarientsComponent from '../components/OrderVarientsComponent';
import OrderAddonComponent from '../components/OrderAddonComponents';
import { useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import { colors } from '../theme/colors';
import DotedLine from '../screens/DUFood/Components/DotedLine';
import Ratings from '../halpers/Ratings';
import Url from '../api/Url';
import OtpVerify from 'react-native-otp-verify';

const size = Dimensions.get('window').height;

export default function OrderCustomization(props) {
  const {
    visible,
    close,
    onPress,
    orderImage,
    vegItem,
    tag,
    title,
    description,
    data,
    renderItem,
    keyExtractor,
    Quantity,
    DecrementQuantity,
    IncrementQuantity,
    price,
    addToCart,
    checkOpacity,
    setFullImage,
    item,
    imageUrl,
    appCart,
    isResOpen,
  } = props;
  const inputRef = useRef(null);
  let textInput = '';
  // console.log('OrderCustomization item:--', item, appCart);
  const [quan, setQuan] = useState(item?.quantity >= 1 ? item?.quantity : 1);
  const [sellAmount, setSellAmount] = useState(item?.selling_price);
  const [vcId, setVcId] = useState(null);
  const [vcName, setVcName] = useState(null);
  const [update, setUpdate] = useState(false);
  const [addons, setAddons] = useState([]);

  const [textInputt, setTextInput] = useState('');
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);
  const onDismissSnackBar = () => setVisibleSnack(false);

  // console.log('item cart', appCart);

  // console.log('quan--', quan);

  const handleQuanAction = action => {
    if (action == 'd' && quan == 1) {
      close();
    } else {
      setQuan(action == 'a' ? quan + 1 : quan - 1);
    }
  };

  const onInputText = text => {
    setTextInput(text);
  };

  const getIsVarient = () => {
    return item?.combinations && item?.combinations.length > 0 ? true : false;
  };

  const getIsAddons = () => {
    return item?.addon && item?.addon.length > 0 ? true : false;
  };

  const refreshItem = () => {
    setSellAmount(item?.selling_price);
    setQuan(item?.quantity >= 1 ? item?.quantity : 1);
    setVcId(null);
    setVcName(null);
    setAddons([]);
    if (item?.combinations && item?.combinations.length > 0) {
      setVcId(item?.combinations[0]?.price);
      setSellAmount(item?.combinations[0]?.price);
      let vName = item?.combinations[0]?.second_gp
        ? item?.combinations[0]?.first_gp +
        ' - ' +
        item?.combinations[0]?.second_gp
        : item?.combinations[0]?.first_gp;

      setVcName(vName);
    }
    setUpdate(!update);
  };

  useFocusEffect(
    useCallback(() => {
      refreshItem();
    }, [visible]),
  );

  useEffect(() => {
    if (!appCart?.cart_items || !item) return;
    // const selectedFoodItem = appCart?.food_item?.find(
    //   data => item?._id === data?._id,
    // );
    // console.log(
    //   'selectedFoodItem?.selected_add_on--',
    //   selectedFoodItem,
    //   selectedFoodItem?.selected_add_on,
    // );
    setAddons([])
    const selectedFoodItem = appCart?.cart_items?.find(
      data => item?._id === data?.food_item_id,
    );
    // console.log(
    //   'selectedFoodItem?.selected_add_on--',
    //   selectedFoodItem,
    //   selectedFoodItem?.selected_add_on,
    //   item,
    //   appCart
    // );
    setSellAmount((selectedFoodItem?.varient_price || selectedFoodItem?.food_item_price) ?? item?.selling_price);
    setAddons(selectedFoodItem?.selected_add_on ?? []);
  }, [item, appCart, visible]);

  const calculateIcon = icon => {
    switch (icon) {
      case 'veg':
        return appImagesSvg?.vegSvg;
      case 'egg':
        return appImagesSvg?.eggSvg;
      case 'non-veg':
        return appImagesSvg?.nonVeg;
      default:
        return appImagesSvg?.vegSvg; // Default Image
    }
  };

  const getIPrice = () => {
    if (addons && addons.length > 0) {
      let addonsTotalPrice = addons.reduce((total, item) => {
        return total + item.addon_price;
      }, 0);
      return parseInt(sellAmount) * quan + parseInt(addonsTotalPrice);
    } else {
      return sellAmount;
    }
  };

  const getTotalPrice = () => {
    if (addons && addons?.length > 0) {
      // let addonsTotalPrice = addons?.reduce((total, item) => {
      //   console.log("total,item", total, item);
      //   return item?.addon_price
      //     ? total + item?.addon_price ?? 0
      //     : total + item?.price ?? 0;
      // }, 0);
      let addonsTotalPrice = addons?.reduce((total, item) => {
        // console.log("total,item", total, item);
        return total + (item?.addon_price ?? item?.price ?? 0);
    }, 0);
      console.log('getTotal', addonsTotalPrice, addons);
      return currencyFormat(
        parseInt(sellAmount) * quan + parseInt(addonsTotalPrice),
      );
    } else {
      return currencyFormat(sellAmount * quan);
    }
    // return currencyFormat(sellAmount * quan);
  };

  const checkUID = (cart, nItem) => {
    // console.log('check UIIDDDDD', nItem, cart);
    if (cart?.cartitems?.find(i => i.itemsUID === nItem)) {
      return true;
    } else {
      false;
    }
  };

  const generateUID = (id, vcId, addons) => {
    let isVcID = vcId ? true : false;
    let isAddons = addons && addons?.length > 0 ? true : false;
    let getaddonId = isAddons
      ? addons.reduce((total, item) => {
        return total + item.addon_prod_id;
      }, 0)
      : null;
    let addonId = getaddonId && getaddonId > 0 ? getaddonId : null;

    // console.log(
    //   'is varient and is addons',
    //   isVcID,
    //   isAddons,
    //   getaddonId,
    //   addonId,
    // );

    if (isVcID && isAddons) {
      return `${id}${vcId}${addonId}`;
    } else if (isVcID && !isAddons) {
      return `${id}${vcId}`;
    } else if (!vcId && isAddons) {
      return `${id}${addonId}`;
    } else {
      return `${id}`;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={close}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.orderConatiner}>
          <TouchableOpacity onPress={close} style={styles.crossConatiner}>
            <Image
              resizeMode="contain"
              style={{ height: 45, width: 45 }}
              source={appImages.crossClose} // Your icon image
            />
          </TouchableOpacity>

          <View style={styles.conatiner}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContain}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              <View style={styles.orderCustomizationConatiner}>
                <Pressable
                  style={styles.imageView}
                // onPress={() => {
                //   close(),
                //     setTimeout(() => {
                //       setFullImage(true);
                //     }, 1);
                // }}
                >
                  <Image
                    resizeMode={'cover'}
                    style={styles.coverImage}
                    source={
                      // appImages.foodIMage
                      item?.image?.length > 0
                        ? { uri: Url?.Image_Url + item?.image }
                        : appImages.foodIMage
                      // appImages.noImage
                    }
                  />
                </Pressable>
                <View style={styles.nameTypeView}>
                  <Text numberOfLines={1} style={styles.orderTitle}>
                    {item?.name}
                  </Text>

                  <SvgXml
                    style={styles.typeIcon}
                    xml={calculateIcon(item?.veg_nonveg)}
                  />
                </View>

                <Text style={styles.orderDescription}>{item?.description}</Text>
                <View style={styles.orderDescriptionContainer}>
                  <View style={styles.ratingTagView}>
                    <View style={styles.innerRatingTagView}>
                      <SvgXml xml={start} />
                      {/* <Ratings rateFormat={4.0} starHeight={14} /> */}
                      <Text style={styles.ratingCount}>
                        {' '}
                        {item?.rating ? item?.rating : 0}
                      </Text>
                    </View>
                    <View style={styles.restaurantBestConatiner}>
                      <Text style={styles.restauranttypeText}>
                        {item?.tag?.length > 0 ? item?.tag : 'Bestseller'}
                      </Text>
                    </View>
                  </View>
                </View>
                <DotedLine />
                {/* <Spacer space={hp('1%')} /> */}
              </View>

              {getIsVarient() && (
                <OrderVarientsComponent
                  isResOpen={isResOpen}
                  id={sellAmount ?? vcId}
                  onSelectId={(id, price, name) => {
                    setVcId(id);
                    setSellAmount(price);
                    setVcName(name);
                  }}
                  combination={item?.combinations}
                  varientGroup={item?.variants}
                />
              )}

              {getIsAddons() && (
                <OrderAddonComponent
                  isAddons={addons}
                  item={item}
                  isResOpen={isResOpen}
                  addonData={item?.addon}
                  appCart={appCart}
                  onSelect={data => {
                    console.log('data>', data);
                    if (data?.length > 0) {
                      setAddons([...data]);
                    } else {
                      setAddons([])
                    }
                  }}
                  onLimitOver={limit => {
                    console.log('press');
                    setSnackMessage(
                      `You can only select up to ${limit} option${limit > 1 ? 's' : ''
                      } `,
                    );
                    setVisibleSnack(true);
                  }}
                />
              )}

              {/* <AddCookingRequest /> */}

              <View style={styles.inputTextMainView}>
                <View style={styles.addCookingView}>
                  <Text style={styles.addCookingText}>
                    Add a cooking request (optional)
                  </Text>
                  <SvgXml xml={appImagesSvg.info} />
                </View>
                <View style={styles.bottomLineView} />
                <TextInput
                  ref={inputRef}
                  underlineColor="transparent"
                  underlineColorAndroid={'transparent'}
                  placeholder="e.g. Don’t make it too spicy"
                  placeholderTextColor={colors.colorAF}
                  maxLength={100}
                  numberOfLines={5}
                  multiline
                  value={textInputt} // Bind the input value to state
                  onChangeText={text => {
                    onInputText(text);
                  }}
                  style={styles.inputText}></TextInput>
                <Text style={styles.inputTextLength}>
                  {textInputt?.length}/100
                </Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.bottomBtnMainView}>
            <View style={styles.bottomBtnInnerView}>
              <View
                pointerEvents={isResOpen ? 'auto' : 'none'}
                style={[
                  styles.inDecView,
                  {
                    opacity: isResOpen ? 1 : 0.6,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.decresaeTouch}
                  onPress={() => {
                    handleQuanAction('d');
                  }}>
                  <Text style={styles.decreaseText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qunatityText}>{quan}</Text>
                <TouchableOpacity
                  style={styles.increaseTouch}
                  onPress={() => handleQuanAction('a')}>
                  <Text style={styles.increaseText}>+</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Action
                  disabled={isResOpen ? (quan > 0 ? false : true) : true}
                  onPress={() => {
                    let iPrice = getIPrice();
                    if (
                      appCart &&
                      checkUID(appCart, generateUID(item?._id, vcId, addons))
                    ) {
                      let q = appCart?.cartitems.filter(
                        i =>
                          i.itemsUID === generateUID(item?._id, vcId, addons),
                      );

                      let qua = q[0]?.quantity;

                      addToCart(
                        quan + qua,
                        sellAmount,
                        vcId,
                        vcName,
                        addons,
                        iPrice,
                      );
                    } else {
                      addToCart(quan, sellAmount, vcId, vcName, addons, iPrice);
                    }
                  }}
                  activiOpacity={checkOpacity}
                  height={hp('5%')}
                  width={wp('55%')}
                  title={`Add item ${getTotalPrice()}`}
                  background={isResOpen ? colors.main : colors.colorD9}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  crossConatiner: {
    marginBottom: hp('1%'),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  nameTypeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  orderTitle: {
    flex: 1,
    color: colors.black,
    fontSize: RFValue(18),
    fontFamily: fonts.medium,
    marginRight: '2%',
  },
  typeIcon: {
    marginRight: '4%',
  },
  orderDescription: {
    color: colors.color8F,
    marginTop: hp('1%'),
    fontSize: RFValue(13),
    fontFamily: fonts.regular,
  },
  orderDescriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  orderConatiner: {
    width: wp('100%'),
    height: hp('100%'),
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  conatiner: {
    width: wp('100%'),
    height: hp('70%'),
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  scrollView: {
    flex: 1,
    marginTop: '2%',
    borderRadius: 10,
  },
  scrollViewContain: {
    paddingBottom: '10%',
    justifyContent: 'center',
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCustomizationConatiner: {
    paddingHorizontal: hp('2%'),
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantBestConatiner: {
    borderRadius: 4,
    marginLeft: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restauranttypeText: {
    fontSize: RFValue(12),
    color: colors.main,
    fontFamily: fonts.regular,
  },
  coverImage: {
    marginTop: hp('0.2%'),
    height: hp('24%'),
    width: wp('93%'),
    borderRadius: 10,
  },
  ratingTagView: {
    flexDirection: 'row',
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerRatingTagView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCount: {
    color: colors.colorF9,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    marginTop: '1%',
  },
  inputTextMainView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.black, // Shadow color (black)
    shadowOffset: { width: 0, height: 2 }, // Horizontal and vertical offset
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 5, // Blur radius of the shadow
    elevation: 5, // Android shadow (elevation must be set to display shadow on Android)
    marginHorizontal: '4%',
    paddingHorizontal: '4%',
    marginTop: '4%',
    paddingBottom: '2%',
  },
  addCookingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '4%',
    justifyContent: 'space-between',
  },
  addCookingText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black85,
  },
  bottomLineView: {
    height: 2,
    marginBottom: '2%',
    marginTop: '3%',
    backgroundColor: colors.colorD9,
  },
  inputText: {
    padding: 10,
    color: colors.black,
    backgroundColor: colors.colorF5,
    borderRadius: 20,
    textAlign: 'left', // Aligns the text horizontally to the left
    textAlignVertical: Platform.OS === 'android' ? 'top' : 'center', // Vertically align to the top for Android, center for iOS
    // shadowColor: colors.black, // Shadow color (black)
    // shadowOffset: {width: 0, height: 2}, // Horizontal and vertical offset
    // shadowOpacity: 0.3, // Opacity of the shadow
    // shadowRadius: 5, // Blur radius of the shadow
    // elevation: 5, // Android shadow (elevation must be set to display shadow on Android)
    marginBottom: '2%',
    marginTop: '2%',
    height: hp('18%'),
  },
  inputTextLength: {
    fontFamily: fonts.semiBold,
    color: colors.black,
    position: 'absolute',
    bottom: 10,
    right: 10,
    marginEnd: wp('5%'),
    paddingBottom: wp('2%'),
  },
  bottomBtnMainView: {
    backgroundColor: colors.white,
    paddingVertical: hp('2.5%'),
    paddingHorizontal: '5%',
    justifyContent: 'center',
  },
  bottomBtnInnerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: '3%',
  },
  inDecView: {
    flexDirection: 'row',
    width: wp('30%'),
    height: hp('5%'),
    borderRadius: 20,
    borderColor: colors.main,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  decresaeTouch: {
    paddingHorizontal: '10%',
    justifyContent: 'center',
    marginTop: '-2%',
  },
  decreaseText: {
    color: colors.main,
    fontFamily: fonts.bold,
    fontSize: RFValue(20),
    textAlign: 'center',
  },
  qunatityText: {
    color: colors.main,
    fontFamily: fonts.bold,
    fontSize: RFValue(16),
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
  },
  increaseTouch: {
    paddingHorizontal: '10%',
    justifyContent: 'center',
    marginTop: '-4%',
  },
  increaseText: {
    color: colors.main,
    fontFamily: fonts.bold,
    fontSize: RFValue(20),
    textAlign: 'center',
  },
});

const start = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
<path d="M7 0L9.26297 3.88528L13.6574 4.83688L10.6616 8.18972L11.1145 12.6631L7 10.85L2.8855 12.6631L3.33843 8.18972L0.342604 4.83688L4.73703 3.88528L7 0Z" fill="#F9BD00"/>
</svg>`;
