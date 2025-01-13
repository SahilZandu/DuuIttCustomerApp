import React, {useState, useEffect, useRef} from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import {categoryStyles} from '../screens/DUFood/Category/styles';
import {restuarantStyles} from '../screens/DUFood/Menu/styles';
// import Icon1 from 'react-native-vector-icons/Entypo';
import {SvgXml} from 'react-native-svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../theme/fonts/fonts';
import {appImagesSvg, appImages} from '../commons/AppImages';
import Action from '../components/Action';
import {RFValue} from 'react-native-responsive-fontsize';
// import Ratings from './Ratings';
// import Spacer from './Spacer';
// import FullImageView from '../common/FullImageView';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {currencyFormat} from '../halpers/currencyFormat';
import OrderVarientsComponent from '../components/OrderVarientsComponent';
import OrderAddonComponent from '../components/OrderAddonComponents';
import {useFocusEffect} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';
import {colors} from '../theme/colors';
import DotedLine from '../screens/DUFood/Components/DotedLine';

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
  console.log('detaul item:--', item);
  const [quan, setQuan] = useState(1);
  const [sellAmount, setSellAmount] = useState(item?.selling_price);
  const [vcId, setVcId] = useState(null);
  const [vcName, setVcName] = useState(null);
  const [update, setUpdate] = useState(false);
  const [addons, setAddons] = useState([]);
  let textInput = '';
  const [textInputt, setTextInput] = useState('');
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);
  const onDismissSnackBar = () => setVisibleSnack(false);

  console.log('item cart', appCart);

  const handleQuanAction = action => {
    if (action == 'd' && quan == 1) {
      close();
    } else {
      setQuan(action == 'a' ? quan + 1 : quan - 1);
    }
  };

  const ssdsd = text => {
    setTextInput(text);
  };

  const getIsVarient = () => {
    return item?.combination && item?.combination.length > 0 ? true : false;
  };

  const getIsAddons = () => {
    return item?.product_addon_groups && item?.product_addon_groups.length > 0
      ? true
      : false;
  };

  const refreshItem = () => {
    setSellAmount(item?.selling_price);
    setQuan(1);
    setVcId(null);
    setVcName(null);
    setAddons(null);
    if (item?.combination && item?.combination.length > 0) {
      setVcId(item?.combination[0]?.id);
      setSellAmount(item?.combination[0]?.price);
      let vName = item?.combination[0]?.second_gp?.name
        ? item?.combination[0]?.first_gp?.name +
          ' - ' +
          item?.combination[0]?.second_gp?.name
        : item?.combination[0]?.first_gp?.name;

      setVcName(vName);
    }

    setUpdate(!update);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshItem();
    }, [visible == true]),
  );

  const calculateIcon = icon => {
    // Check if the icon exists and has a non-zero length
    if (icon && icon.length > 0) {
      // Use switch statement based on the value of icon
      switch (icon) {
        case 'simple':
        case 'veg':
          return appImagesSvg?.veg;
        case 'egg':
          return appImagesSvg?.nonVeg;
        case 'non-veg':
          return appImagesSvg?.nonVeg;
        default:
          return appImagesSvg?.vegIcon; // Default Image
      }
    } else {
      return appImagesSvg?.vegIcon; // Default Image if icon is not provided
    }
  };

  const getIPrice = () => {
    if (addons && addons.length > 0) {
      let addonsTotalPrice = addons.reduce((total, item) => {
        return total + item.addon_price;
      }, 0);
      return parseInt(sellAmount) + parseInt(addonsTotalPrice);
    } else {
      return sellAmount;
    }
  };

  const getTotalPrice = () => {
    if (addons && addons.length > 0) {
      let addonsTotalPrice = addons.reduce((total, item) => {
        return total + item.addon_price;
      }, 0);
      console.log('getTotal', addonsTotalPrice);
      return currencyFormat((parseInt(sellAmount) + parseInt(addonsTotalPrice)) * quan);
    } else {
      return currencyFormat(sellAmount * quan);
    }

    // return currencyFormat(sellAmount * quan);
  };

  const checkUID = (cart, nItem) => {
    console.log('check UIIDDDDD', nItem, cart);
    if (cart?.cartitems?.find(i => i.itemsUID === nItem)) {
      return true;
    } else {
      false;
    }
  };

  const generateUID = (id, vcId, addons) => {
    let isVcID = vcId ? true : false;
    let isAddons = addons && addons.length > 0 ? true : false;
    let getaddonId = isAddons
      ? addons.reduce((total, item) => {
          return total + item.addon_prod_id;
        }, 0)
      : null;
    let addonId = getaddonId && getaddonId > 0 ? getaddonId : null;

    console.log('is varient and is addons', isVcID, isAddons);

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
      <KeyboardAwareScrollView>
        <View style={restuarantStyles.orderConatiner}>
          <TouchableOpacity
            onPress={close}
            style={categoryStyles.crossConatiner}>
            {/* <Icon1
            name="cross"
            size={size / 30}
            color={'white'}
            style={{alignSelf: 'center'}}
          /> */}
            <SvgXml xml={appImagesSvg.CROSS} />
          </TouchableOpacity>

          <View style={[restuarantStyles.orderConatinerr, {height: hp('70%')}]}>
            <ScrollView
              contentContainerStyle={{paddingBottom: '10%'}}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}>
              <View style={restuarantStyles.orderCustomizationConatiner}>
                <Pressable
                  style={{justifyContent: 'center', alignItems: 'center'}}
                  // onPress={() => {
                  //   close(),
                  //     setTimeout(() => {
                  //       setFullImage(true);
                  //     }, 1);
                  // }}
                >
                  <Image
                    resizeMode={item?.product_pic ? 'stretch' : 'cover'}
                    style={{
                      marginTop: hp('0.2%'),
                      height: hp('28%'),
                      width: wp('93%'),
                      borderRadius: 16,
                    }}
                    source={
                      appImages.foodIMage
                      // item?.product_pic
                      //   ? {uri: imageUrl + item?.product_pic}
                      //   : AppImages.noImage
                    }
                  />
                </Pressable>
                <View
                  style={{
                    marginRight: wp('4%'),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={categoryStyles.orderTitle}>{item?.title}</Text>

                  <SvgXml xml={calculateIcon(item?.veg_non_veg)} />
                </View>

                <Text style={categoryStyles.orderDescription}>
                  {item?.description}
                </Text>
                <View style={categoryStyles.orderDescriptionContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: wp('90%'),
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <SvgXml xml={start} />
                      <Text
                        style={{
                          color: '#000000',
                          fontSize: RFValue(11),
                          fontFamily: fonts.medium,
                          marginTop: '1%',
                        }}>
                        {' '}
                        {item?.item_review_avg_item_rating
                          ? item?.item_review_avg_item_rating
                          : 0}
                      </Text>
                    </View>
                    {item?.tag?.length > 0 && (
                      <View
                        style={[
                          restuarantStyles.restaurantBestConatiner,
                          {
                            backgroundColor: '#ffffff',
                            // paddingHorizontal: '3%',
                            // paddingVertical: '0.5%',
                            // borderRadius: 6,
                          },
                        ]}>
                        <Text
                          style={[
                            restuarantStyles.restauranttypeText,
                            {color: '#28B056', fontFamily: fonts.semiBold},
                          ]}>
                          {item?.tag == 'bestseller'
                            ? 'Bestseller'
                            : 'Must try'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <DotedLine />
                {/* <Spacer space={hp('1%')} /> */}
              </View>

              {
             getIsVarient() && 
            (
              <OrderVarientsComponent
                isResOpen={isResOpen}
                id={vcId}
                onSelectId={(id, price, name) => {
                  setVcId(id);
                  setSellAmount(price);
                  setVcName(name);
                }}
                combination={item?.combination}
                varientGroup={item?.product_varient_group}
              />
            )} 

              {
                 getIsAddons() &&
                <OrderAddonComponent
                  isResOpen={isResOpen}
                  addonData={item?.product_addon_groups}
                  appCart={appCart}
                  onSelect={data => {
                    console.log('data>',data);
                    setAddons(data);
                  }}
                  onLimitOver={limit => {
                    console.log('press');
                    setSnackMessage(
                      `You can only select up to ${limit} option${
                        limit > 1 ? 's' : ''
                      } `,
                    );
                    setVisibleSnack(true);
                  }}
                />
              }
              {/* <AddCookingRequest /> */}

              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  shadowColor: '#000', // Shadow color (black)
                  shadowOffset: {width: 0, height: 2}, // Horizontal and vertical offset
                  shadowOpacity: 0.3, // Opacity of the shadow
                  shadowRadius: 5, // Blur radius of the shadow
                  elevation: 5, // Android shadow (elevation must be set to display shadow on Android)
                  margin: wp('5%'),
                  paddingHorizontal: wp('4%'),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: '4%',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      color: 'black',
                    }}>
                    Add a cooking request (optional)
                  </Text>
                  <SvgXml xml={appImagesSvg.info} />
                </View>
                <View
                  style={{
                    height: 2,

                    marginBottom: 10,
                    marginTop: 10,
                    backgroundColor: '#D9D9D9',
                  }}
                />
                <TextInput
                  ref={inputRef}
                  underlineColor="transparent"
                  underlineColorAndroid={'transparent'}
                  placeholder="e.g. Don’t make it too spicy"
                  placeholderTextColor={'#AFAFAF'}
                  maxLength={100}
                  numberOfLines={5}
                  multiline
                  value={textInputt} // Bind the input value to state
                  onChangeText={ssdsd}
                  // onChangeText={(text) => {
                  //   // textInput=text;
                  //   ssdsd(text);
                  //   }}
                  style={{
                    padding: 10,
                    color:colors.black,
                    
                    backgroundColor: '#F5F5F5',
                    borderRadius: 20,
                    textAlign: 'left', // Aligns the text horizontally to the left
                    textAlignVertical:
                      Platform.OS === 'android' ? 'top' : 'center', // Vertically align to the top for Android, center for iOS

                    shadowColor: '#000', // Shadow color (black)
                    shadowOffset: {width: 0, height: 2}, // Horizontal and vertical offset
                    shadowOpacity: 0.3, // Opacity of the shadow
                    shadowRadius: 5, // Blur radius of the shadow
                    elevation: 5, // Android shadow (elevation must be set to display shadow on Android)

                    marginBottom: 10,
                    marginTop: 10,

                    height: hp('24%'),
                  }}></TextInput>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    color: 'black',
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    marginEnd: wp('5%'),
                    paddingBottom: wp('2%'),
                  }}>
                  {textInputt.length}/100
                </Text>
              </View>
            </ScrollView>
          </View>

          <View
            style={{
              backgroundColor: '#FFFFFF',
              padding: hp('2%'),
              justifyContent: 'center',
            }}>
            <Snackbar
              wrapperStyle={{alignSelf: 'center'}}
              style={{
                backgroundColor: 'black',
                width: wp('75%'),
                alignSelf: 'center',
                marginTop: '-35%',
              }}
              visible={visibleSnack}
              onDismiss={onDismissSnackBar}
              duration={2000}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: fonts.semiBold,
                  fontSize: RFValue(12),
                  textAlign: 'center',
                }}>
                {snackMessage}
              </Text>
            </Snackbar>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                bottom: 10,
              }}>
              <View
                pointerEvents={isResOpen ? 'auto' : 'none'}
                style={{
                  flexDirection: 'row',
                  width: wp('30%'),
                  height: hp('6%'),
                  borderRadius: 22,
                  borderColor: '#28B056',
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isResOpen ? 1 : 0.6,
                }}>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: '10%',
                  }}
                  onPress={() => handleQuanAction('d')}>
                  <Text
                    style={{
                      color: '#28B056',
                      fontFamily: fonts.bold,
                      fontSize: RFValue(20),
                    }}>
                    -
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#28B056',
                    fontFamily: fonts.bold,
                    fontSize: RFValue(16),
                    marginLeft: hp('1%'),
                    marginRight: hp('1%'),
                  }}>
                  {quan}
                </Text>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: '10%',
                  }}
                  onPress={() => handleQuanAction('a')}>
                  <Text
                    style={{
                      color: '#28B056',
                      fontFamily: fonts.bold,
                      fontSize: RFValue(20),
                    }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 5}}>
                <Action
                  disabled={isResOpen ? (quan > 0 ? false : true) : true}
                  onPress={() => {
                    // addToCart(
                    //   22,
                    //   200,
                    //   vcId,
                    //   vcName,
                    //   addons,
                    //   300,
                    // );
                    let iPrice = getIPrice();
                    if (
                      appCart &&
                      checkUID(appCart, generateUID(item.id, vcId, addons))
                    ) {
                      let q = appCart.cartitems.filter(
                        i => i.itemsUID === generateUID(item.id, vcId, addons),
                      );

                      let qua = q[0].quantity;

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
                  height={hp('6%')}
                  width={wp('55%')}
                  title={`Add item ${getTotalPrice()}`}
                  background={isResOpen ? '#28B056' : '#D9D9D9'}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}



const start = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
<path d="M7 0L9.26297 3.88528L13.6574 4.83688L10.6616 8.18972L11.1145 12.6631L7 10.85L2.8855 12.6631L3.33843 8.18972L0.342604 4.83688L4.73703 3.88528L7 0Z" fill="#F9BD00"/>
</svg>`;
