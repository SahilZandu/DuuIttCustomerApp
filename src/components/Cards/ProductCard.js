import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
// import Ratings from '../../../Components/Ratings';
// import Base_Image_Url from '../../../api/Url';
import {appImagesSvg, appImages} from '../../commons/AppImages';

import {fonts} from '../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
// import {currencyFormat} from '../../../helpers/currencyFormat';
// import {rootStore} from '../../../stores/rootStore';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
// import {useToast} from '../../../helpers/useToast';
// import PopUpModal from '../../../Components/PopUpModal';
// import {avaliableTimeFormat} from '../../../helpers/avaliableTimeFormat';
// import {getProductAvaliableTime} from '../../../helpers/getProductAvaliableTime';
import {Rating} from 'react-native-rating-element';
import {colors} from '../../theme/colors';

// const imageUrl = Base_Image_Url?.Base_Image_UrlProduct;
const imageUrl = 'Base_Image_Url?.Base_Image_UrlProduct;';
const size = Dimensions.get('window').height;

const ProductCard = ({
  item,
  index,
  onDetail,
  onMoreDes,
  editVarient,
  onAdd,
  update,
  restaurant,
  removeCart,
  isResOpen,
}) => {
  //  console.log('item--ProductCard', restaurant);

  // const {getCart} = rootStore.cartStore;

  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(Number(0));
  const [anotherCart, setAnotherCart] = useState(false);
  const [addRemoveCart, setAddRemoveCart] = useState(false);
  const [isCart, setIsCart] = useState(null);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const calculateTotalQuantity = (cart, productId) => {
    return cart
      .filter(item => item.product_id === productId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     async function getQuan() {
  //       const cart = await getCart();
  //       if (cart && cart?.cartitems && cart?.cartitems?.length > 0) {
  //         setQuantity(calculateTotalQuantity(cart?.cartitems, item?.id));
  //         setIsCart(cart);
  //         if (cart?.org_id != item?.org_id) {
  //           setAnotherCart(true);
  //         } else {
  //           setAnotherCart(false);
  //         }
  //       } else {
  //         setQuantity(0);
  //         setAnotherCart(false);
  //         setIsCart(null);
  //       }
  //     }
  //     getQuan();
  //   }, [update]),
  // );

  const getIsVarient = () => {
    return item?.combination && item?.combination.length > 0 ? true : false;
  };

  const getIsAddons = () => {
    return item?.product_addon_groups && item?.product_addon_groups.length > 0
      ? true
      : false;
  };

  // useEffect(() => {
  //   getQuan();
  //   // setQuantity(item.quantity)
  // }, [update]);

  const calculateIcon = icon => {
    if (icon && icon?.length > 0) {
      switch (icon) {
        case 'simple':
        case 'veg':
          return appImagesSvg?.typeVeg;
        case 'egg':
          return appImagesSvg?.typeVeg;
        case 'non-veg':
          return appImagesSvg?.typeVeg;
        default:
          return appImagesSvg?.typeVeg;
      }
    } else {
      return appImagesSvg?.typeVeg;
    }
  };

  const Type = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: '1%',
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: '#333333',
            fontFamily: fonts.semiBold,
            fontSize: RFValue(12),
            marginTop: '1%',
            // width: '90%',
            width: wp('50%'),
            textTransform: 'capitalize',
          }}>
          {item?.title}
        </Text>
        {/* <SvgXml xml={calculateIcon(item?.veg_non_veg)} /> */}
        {/* <View style={{paddingVertical: '1%'}}>
         
        </View> */}
        {/* {item?.tag && (
          <View
            style={{
              backgroundColor: '#F07300',
              marginLeft: '3%',
              borderRadius: 6,
              paddingHorizontal: '4%',
              paddingVertical: '1%',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: Fonts.medium,
                fontSize: RFValue(9),
              }}>
              {item.tag == 'bestseller' ? 'Bestseller' : 'Must try'}
            </Text>
          </View>
        )} */}
      </View>
    );
  };

  const PriceView = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            marginTop: 10,
            color: colors.black,
            fontFamily: fonts.medium,
            fontSize: RFValue(16),
          }}>
          180
        </Text>
      </View>
    );
  };
  const RatingView = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* {item?.tag?.length > 0 && (
          <View
            style={{
              backgroundColor: '#F07300',
              //marginLeft: '3%',
              borderRadius: 6,
              paddingHorizontal: '4%',
              paddingVertical: '1%',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: Fonts.medium,
                fontSize: RFValue(9),
              }}>
              {item?.tag == 'bestseller' ? 'Bestseller' : 'Must try'}
            </Text>
          </View>
        )} */}

        <Rating
          rated={Number(item?.item_review_avg_item_rating)}
          totalCount={5}
          ratingColor="#F9BD00"
          ratingBackgroundColor="#d4d4d4"
          size={size / 50}
          readonly
          icon="ios-star"
          direction="row"
        />
        <Text
          style={{
            color: '#646464',
            marginTop: '1%',
            fontFamily: fonts.medium,
            fontSize: RFValue(10),
          }}>
          {'  '}
          {item?.item_review_count} Reviews
        </Text>
      </View>
    );
  };

  const Description = () => {
    const text = item?.description;

    const truncatedText = text.length > 55 ? text.slice(0, 55) + '...' : text;

    return (
      <View style={{marginTop: '2%', marginBottom: '1%'}}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={isExpanded ? undefined : 2}
          style={{
            color: '#8F8F8F',
            fontSize: RFValue(10),
            fontFamily: fonts.regular,
          }}>
          {isExpanded ? item?.description + '  ' : truncatedText}
          {text?.length > 55 && (
            <Text
              onPress={() => setIsExpanded(!isExpanded)}
              style={{color: '#646464', fontFamily: fonts.medium}}>
              {isExpanded ? 'read less' : 'read more'}
            </Text>
          )}
        </Text>
      </View>
    );
  };

  const Price = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: hp('-2%'),
        }}>
        {/* <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: RFValue(16),
            color: 'black',
          }}>
            180
        
        </Text> */}

        {item.in_stock == 1 ? (
          quantity != 0 ? (
            <View
              style={{
                backgroundColor: '#28B056',
                height: 32,
                // paddingHorizontal: '5%',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 20,
              }}>
              <Pressable
                disabled={!isResOpen}
                onPress={() => {
                  if (getIsVarient() || getIsAddons()) {
                    editVarient();
                  } else {
                    setQuantity(quantity - 1);
                    onAdd('d', quantity - 1);
                  }
                }}
                style={{
                  width: wp('10%'),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: RFValue(18),
                    fontFamily: fonts.medium,
                  }}>
                  -
                </Text>
              </Pressable>
              <Text
                style={{
                  color: 'white',
                  fontSize: RFValue(14),
                  fontFamily: fonts.medium,
                }}>
                {quantity}
              </Text>
              <Pressable
                onPress={() => {
                  if (getIsVarient() || getIsAddons()) {
                    editVarient();
                  } else {
                    setQuantity(quantity + 1);
                    onAdd('i', quantity + 1);
                  }
                }}
                style={{
                  width: wp('10%'),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: RFValue(18),
                    fontFamily: fonts.medium,
                  }}>
                  +
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              disabled={!isResOpen}
              onPress={() => {
                if (!anotherCart) {
                  if (getIsVarient() || getIsAddons()) {
                    onDetail();
                  } else {
                    setQuantity(quantity + 1);
                    onAdd('i', quantity + 1);
                  }
                } else {
                  setAddRemoveCart(true);
                  // useToast(
                  //   'e',
                  //   'Other restaurant item is already in your cart. Please remove it.',
                  // );
                }
              }}
              style={{
                backgroundColor: !isResOpen
                  ? '#D9D9D9'
                  : quantity != 0
                  ? '#28B056'
                  : '#ECFFF3',
                height: 32,
                paddingHorizontal: '5%',
                alignItems: 'center',
                flexDirection: 'row',
                borderColor: '#28B056',
                borderRadius: 20,
                borderWidth: 1,
              }}>
              {/* <Text
                style={{
                  color: 'white',
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                }}>
                +{' '}
              </Text> */}
              <Text
                style={{
                  color: '#28B056',
                  fontFamily: fonts.medium,
                  fontSize: RFValue(12),
                  paddingEnd: 20,
                  paddingStart: 20,
                }}>
                ADD
              </Text>
            </Pressable>
          )
        ) : (
          <View
            style={{
              backgroundColor: '#D9D9D9',
              height: 32,
              paddingHorizontal: '5%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}>
            <Text
              style={{
                color: '#8F8F8F',
                fontFamily: fonts.medium,
                fontSize: RFValue(11),
              }}>
              Out of stock
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      pointerEvents={item.in_stock == 1 ? 'auto' : 'none'}
      key={index}
      style={{}}>
      <Pressable
        onPress={onDetail}
        style={{flexDirection: 'row', marginTop: '6%', marginBottom: '6%'}}>
        {item.in_stock !== 1 && (
          <View
            style={{
              height: hp('14%'),
              width: wp('30%'),
              borderRadius: 10,
              position: 'absolute',
              backgroundColor: 'rgba(100, 100, 100, 0.6)',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: '5%',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: fonts.bold,
                fontSize: RFValue(10),
              }}>
              Available at{' '}
            </Text>
            <Text
              style={{
                color: 'white',
                fontFamily: fonts.bold,
                fontSize: RFValue(10),
                textAlign: 'center',
              }}>
              {/* {item?.back_to_online
                ? avaliableTimeFormat(item?.back_to_online)
                : getProductAvaliableTime(item.partial_product_timings)} */}
            </Text>
          </View>
        )}

        <View
          style={{
            // marginLeft: '3%',
            width: wp('50%'),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <SvgXml xml={appImagesSvg.veg} />
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#FDB714',
                marginStart: 5,
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(8),
                  color: 'white',

                  paddingEnd: 6,
                  paddingStart: 6,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}>
                Best Seller
              </Text>
            </View>
          </View>
          {Type()}
          {PriceView()}
          {Description()}
        </View>

        <View
          style={{
            // marginLeft: '3%',
            justifyContent: 'center',
            alignItems: 'center',
            width: wp('50%'),
          }}>
          <FastImage
            style={{
              height: hp('14%'),
              width: wp('30%'),
              borderRadius: 10,
              opacity: item.in_stock == 1 ? 1 : 0.6,
            }}
            source={
              // item?.product_pic
              //   ? {
              //       uri: imageUrl + item?.product_pic,
              //     }
              //   : appImages.noImage
              appImages.foodIMage
            }
            resizeMode={FastImage.resizeMode.cover}
          />
          {Price()}
        </View>
      </Pressable>
      {/* <PopUpModal
        visible={addRemoveCart}
        onDelete={async () => {
          await removeCart(isCart?.org_id);
          await setAddRemoveCart(false);
          if (getIsVarient() || getIsAddons()) {
            setTimeout(() => {
              onDetail();
            }, 300);
          } else {
            setQuantity(quantity + 1);
            onAdd('i', quantity + 1);
          }
        }}
        type={'warning'}
        text={`Would you like to discard your ${isCart?.orgdata?.name}  order and add items ${restaurant?.name} instead?`}
        title={'Replace Cart Item?'}
        onClose={() => setAddRemoveCart(false)}
        titleBtn={'Continue'}
      /> */}
    </View>
  );
};
export default ProductCard;
