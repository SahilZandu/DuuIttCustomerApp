import React, {useState, useRef,useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import {colors} from '../../../theme/colors';
import {categoryStyles} from '../../../screens/DUFood/Category/styles';
import {restuarantStyles} from '../../../screens/DUFood/Menu/styles';
import Icon1 from 'react-native-vector-icons/Entypo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fonts} from '../../../theme/fonts/fonts';
import {appImagesSvg, appImages} from '../../../commons/AppImages';
import DotedLine from '../../../screens/DUFood/Components/DotedLine';

import Action from '../../../components/Action';

import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
// import Ratings from './Ratings';
// import Spacer from './Spacer';
// import FullImageView from '../common/FullImageView';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {currencyFormat} from '../../../halpers/currencyFormat';
import OrderVarientsComponent from '../../../components/OrderVarientsComponent';
import OrderAddonComponent from '../../../components/OrderAddonComponents';
import {useFocusEffect} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';

const size = Dimensions.get('window').height;

export default function CartItemUpdate({
  visible,
  close,
  cartItem,
  products,
  onUpdate,
  imageUrl,
  isResOpen,
}) {
  const [quan, setQuan] = useState(cartItem?.quantity);
  // const [sellAmount, setSellAmount] = useState(products?.selling_price);
  const [sellAmount, setSellAmount] = useState(cartItem?.sellingprice);

  const [vcId, setVcId] = useState(null);
  const [vcName, setVcName] = useState(null);
  const [update, setUpdate] = useState(false);
  const [addons, setAddons] = useState([]);
  const inputRef = useRef(null);
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [textInputt, setTextInput] = useState('');

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);
  const onDismissSnackBar = () => setVisibleSnack(false);

  const handleQuanAction = action => {
    if (action == 'd' && quan == 1) {
      close();
    } else {
      setQuan(action == 'a' ? quan + 1 : quan - 1);
    }
  };

  const getIsVarient = () => {
    return cartItem?.combination && cartItem?.combination.length > 0
      ? true
      : false;
  };

  const getIsAddons = () => {
    // return products?.product_addon_groups &&
    // products?.product_addon_groups.length > 0
    //   ? true
    //   : false;
    return cartItem?.addons &&
    cartItem?.addons.length > 0
      ? true
      : false;
  };

  const refreshItem = () => {
    // setSellAmount(products?.selling_price);
    setSellAmount(cartItem?.sellingprice);

    setQuan(cartItem?.quantity);
    setVcId(null);
    setVcName(null);
    setAddons(null);
    if (cartItem?.combination && cartItem?.combination.length > 0) {
      setVcId(
        cartItem.varient_id ? cartItem.varient_id : cartItem?.combination[0]?.id,
      );
      // setSellAmount(
      //   cartItem.varient_price
      //     ? cartItem.varient_price
      //     : products?.combination[0]?.price,
      // );
      let vName = cartItem?.combination[0]?.second_gp?.name
        ? cartItem?.combination[0]?.first_gp?.name +
          ' - ' +
          cartItem?.combination[0]?.second_gp?.name
        : cartItem?.combination[0]?.first_gp?.name;

      setVcName(cartItem?.varient_name ? cartItem?.varient_name : vName);
    }
    // if (cartItem?.addon_item && cartItem?.addon_item.length > 0) {
    //   setAddons(cartItem?.addon_item);
    // }
    if (cartItem?.addons && cartItem?.addons.length > 0) {
      setAddons(cartItem?.addons);
      console.log('refresh>');
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
          return appImagesSvg?.veg; // Default Image
      }
    } else {
      return appImagesSvg?.veg; // Default Image if icon is not provided
    }
  };

  const getIPrice = () => {
    if (addons && addons.length > 0) {
      let addonsTotalPrice = addons.reduce((total, item) => {
        return total + item.addon_price;
      }, 0);
      return sellAmount + addonsTotalPrice;
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
      return currencyFormat((sellAmount + addonsTotalPrice) * quan);
    } else {
      return currencyFormat(sellAmount * quan);
    }

    // return currencyFormat(sellAmount * quan);
  };

  const checkUID = (cart, nItem) => {
    console.log('check UIIDDDDD', nItem, cart);
    if (cart.cartitems.find(i => i.itemsUID === nItem)) {
      return true;
    } else {
      false;
    }
  };

  const ssdsd = text => {
    setTextInput(text);
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
      <View 
      style={restuarantStyles.orderConatiner}
      >
        <TouchableOpacity onPress={close} 
        style={categoryStyles.crossConatiner}
        >
          <Icon1
            name="cross"
            size={size / 30}
            color={'white'}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>

        <View 
        style={[
          restuarantStyles.orderConatinerr,
         {height: hp('70%')}]}>
          <ScrollView
            contentContainerStyle={{paddingBottom: '10%'}}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            <View 
            style={restuarantStyles.orderCustomizationConatiner}
            >
              <Pressable
                style={{justifyContent: 'center', alignItems: 'center'}}
                //     onPress={() => {
                //       close(),
                //         setTimeout(() => {
                //           setFullImage(true);
                //         }, 1);
                //     }}
              >
                <Image
                  resizeMode={products?.product_pic ? 'stretch' : 'contain'}
                  style={{
                    marginTop: hp('0.2%'),
                    height: hp('28%'),
                    width: wp('93%'),
                    borderRadius: 16,
                  }}
                  source={
                    products?.product_pic
                      ? {uri: imageUrl + products?.product_pic}
                      : appImages.foodImage
                  }
                />
              </Pressable>
              <View 
              style={categoryStyles.orderDescriptionContainer}
              >
             
              </View>
              <View
                  style={{
                    flexDirection: 'row',

                    width: wp('90%'),
                    alignItems: 'center',
                    justifyContent:'space-between'
                  }}>
                    <Text 
              style={categoryStyles.orderTitle}
              >
                {/* {products?.title} */}
                {cartItem?.productname}
                </Text>
                  <SvgXml xml={calculateIcon(cartItem?.veg_non_veg)} />
                  
              
                </View>
              <Text 
              style={categoryStyles.orderDescription}
              >
                {/* {products?.description} */}
                {cartItem?.productdescription}
              </Text>
              {/* <Spacer space={hp('1%')} /> */}
              {/* <Ratings rateFormat={0} starHeight={14} /> */}
            </View>
            <View
                  style={{
                    flexDirection: 'row',
                    alignSelf:'center',
                    width: wp('90%'),
                    alignItems: 'center',
                    justifyContent:'space-between',
                    marginBottom: '1%',
                  }}>
                  {/* <SvgXml xml={calculateIcon(products?.veg_non_veg)} /> */}
                  {/* {products?.tag?.length > 0 && ( */}
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    
                    }}>
                    <SvgXml xml={start} />
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: RFValue(11),
                        fontFamily: fonts.medium,
                       
                      }}>
                      {' '}
                      {products?.item_review_avg_item_rating ? products?.item_review_avg_item_rating : 0}
                    </Text>
                  </View>
                    <View
                      style={[
                        restuarantStyles.restaurantBestConatiner,
                        {
                          
                          backgroundColor: '#ffffff',
                          paddingHorizontal: '3%',
                          paddingVertical: '0.5%',
                          // borderRadius: 6,
                        },
                      ]}>
                      <Text
                        style={[
                          restuarantStyles.restauranttypeText,
                        {color:'#28B056'},
                          {fontFamily: fonts.semiBold},
                        ]}>
                        {products?.tag == 'bestseller'
                          ? 'Bestseller'
                          : 'Must try'}
                      </Text>
                    </View>
                   {/* )} */}
                
                </View>
                <View
                  style={{
                    alignSelf:'center',
                    width: wp('90%'),
                  
                    marginBottom: '4%',
                  }}>
                <DotedLine />
                </View>
            {getIsVarient() && (
              <OrderVarientsComponent
                isResOpen={true}
                id={vcId}
                onSelectId={(id, price, name) => {
                  setVcId(id);
                  setSellAmount(price);
                  setVcName(name);
                }}
                combination={cartItem?.combination}
                varientGroup={cartItem?.product_varient_group}
              />
            )}

            {getIsAddons() && (
              <OrderAddonComponent
                isResOpen={true}
                addonData={cartItem?.product_addon_groups}

                // addonData={products?.product_addon_groups}
                isAddons={cartItem?.addons}
                appCart={[]}
                onSelect={data => {
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
            )}

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
              style={{
                flexDirection: 'row',
                width: wp('30%'),
                height: hp('6%'),
            
                borderRadius: 22,
                borderColor: '#28B056',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
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
                disabled={quan > 0 ? false : true}
                onPress={() => {
                  let iPrice = getIPrice();
                  console.log('click>>',
                  iPrice +" "+quan+" "+
                  sellAmount+" "+vcId+" "+ vcName+" "
                  + addons)
                  onUpdate(quan, sellAmount, vcId, vcName, addons, iPrice);
                }}
                height={hp('6%')}
                width={wp('55%')}
                title={`Update item ${getTotalPrice()}`}
                background={'#28B056'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}



const start = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
<path d="M7 0L9.26297 3.88528L13.6574 4.83688L10.6616 8.18972L11.1145 12.6631L7 10.85L2.8855 12.6631L3.33843 8.18972L0.342604 4.83688L4.73703 3.88528L7 0Z" fill="#F9BD00"/>
</svg>`;
