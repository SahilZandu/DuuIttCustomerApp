import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg, appImages} from '../../commons/AppImages';
import {fonts} from '../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import {Rating} from 'react-native-rating-element';
import {colors} from '../../theme/colors';
import {currencyFormat} from '../../halpers/currencyFormat';
import Url from '../../api/Url';

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
  // console.log('item--ProductCard',item, restaurant);

  // const {getCart} = rootStore.cartStore;

  const [isExpanded, setIsExpanded] = useState(false);
  // const [quantity, setQuantity] = useState(item?.quantity ? Number(item?.quantity):0);
  const [anotherCart, setAnotherCart] = useState(false);
  const [addRemoveCart, setAddRemoveCart] = useState(false);
  const [isCart, setIsCart] = useState(null);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const calculateTotalQuantity = (cart, productId) => {
    return cart
      ?.filter(item => item?.product_id === productId)
      ?.reduce((total, item) => total + item?.quantity, 0);
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
    return item?.combination && item?.combination?.length > 0 ? true : false;
  };

  const getIsAddons = () => {
    return item?.product_addon_groups && item?.product_addon_groups?.length > 0
      ? true
      : false;
  };

  // useEffect(() => {
  //   getQuan();
  //   // setQuantity(item.quantity)
  // }, [update]);

  const calculateIcon = icon => {
      switch (icon) {
        case 'veg':
          return appImagesSvg?.vegSvg;
        case 'egg':
          return appImagesSvg?.eggSvg;
        case 'non-veg':
          return appImagesSvg?.nonVeg;
        default:
          return appImagesSvg?.vegSvg;
      }
  };

  const Type = () => {
    return (
      <View style={styles.nameView}>
        <Text numberOfLines={2} style={styles.nameText}>
          {item?.name}
        </Text>
      </View>
    );
  };

  const PriceView = () => {
    return (
      <View style={styles.priceView}>
        <Text style={styles.priceText}>{currencyFormat(Number(item?.selling_price))}</Text>
      </View>
    );
  };
  const RatingView = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Rating
          rated={Number(item?.item_review_avg_item_rating)}
          totalCount={5}
          ratingColor={colors.white}
          ratingBackgroundColor={colors.colorF9}
          size={size / 50}
          readonly
          icon="ios-star"
          direction="row"
        />
        <Text
          style={{
            color: colors.color64,
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

    const truncatedText = text?.length > 55 ? text?.slice(0, 55) + '...' : text;

    return (
      <View style={styles.descriptionView}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={isExpanded ? undefined : 2}
          style={styles.descriptiontext}>
          {isExpanded ? item?.description + '  ' : truncatedText}
          {text?.length > 55 && (
            <Text
              onPress={() => setIsExpanded(!isExpanded)}
              style={{color: colors.color64, fontFamily: fonts.medium}}>
              {isExpanded ? 'read less' : 'read more'}
            </Text>
          )}
        </Text>
      </View>
    );
  };

  const BtnContainer = () => {
    return (
      <View style={styles.btnMainView}>
        {item?.in_stock == true ? (
        (  item?.quantity && item?.quantity != 0) ? (
            <View style={styles.addItemAminView}>
              <Pressable
                disabled={!isResOpen}
                onPress={() => {
                  if (getIsVarient() || getIsAddons()) {
                    editVarient();
                  } else {
                    // setQuantity(quantity - 1);
                    onAdd('d', item?.quantity - 1);
                  }
                }}
                style={styles.decreaseView}>
                <Text style={styles.decreaseText}>-</Text>
              </Pressable>
              <Text style={styles.qualityText}>{item?.quantity ? item?.quantity :0}</Text>
              <Pressable
                onPress={() => {
                  if (getIsVarient() || getIsAddons()) {
                    editVarient();
                  } else {
                    // setQuantity( item?.quantity + 1);
                    onAdd('i',item?.quantity + 1);
                    // onDetail();
                  }
                }}
                style={styles.increaseView}>
                <Text style={styles.increaseText}>+</Text>
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
                    // setQuantity(quantity + 1);
                    onAdd('i', item?.quantity + 1);
                    // onDetail();
                  }
                } else {
                  setAddRemoveCart(true);
                  // useToast(
                  //   'e',
                  //   'Other restaurant item is already in your cart. Please remove it.',
                  // );
                }
              }}
              style={[
                styles.addBtnView,
                {
                  backgroundColor: !isResOpen
                    ? colors.colorD9
                    : (item?.quantity && item?.quantity != 0)
                    ? colors.main
                    : colors.colorEC,
                },
              ]}>
              <Text style={styles.addText}>ADD</Text>
            </Pressable>
          )
        ) : (
          <View style={styles.outStockView}>
            <Text style={styles.outStockText}>Out of stock</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      pointerEvents={item?.in_stock == true ? 'auto' : 'none'}
      key={item?._id?.toString()}
      style={styles.container}>
      <Pressable
        // onPress={onDetail}
        style={styles.innerContainer}>
        {item?.in_stock !== true && (
          <View style={styles.stockView}>
            <Text style={styles.availableText}>Available at </Text>
            <Text style={styles.backToOnlineText}>
              {/* {item?.back_to_online
                ? avaliableTimeFormat(item?.back_to_online)
                : getProductAvaliableTime(item?.partial_product_timings)} */}
            </Text>
          </View>
        )}

        <View style={styles.mainInnerView}>
          <View style={styles.typeTagsView}>
            <SvgXml width={17} height={17} xml={calculateIcon(item?.veg_nonveg) } />
            <View style={styles.tagsTextView}>
              <Text style={styles.tagsText}>{item?.tag ? item?.tag :"Best Seller"}</Text>
            </View>
          </View>
          {Type()}
          {PriceView()}
          {Description()}
          {/* {RatingView()} */}
        </View>
        <View style={styles.imageBtnView}>
          <FastImage
            style={[
              styles.itemImage,
              {
                opacity: item?.in_stock == true ? 1 : 0.6,
              },
            ]}
            source={
              item?.image?.length > 0
                ? {
                    uri: Url?.Image_Url + item?.image,
                  }
                 : appImages.foodIMage
              
            }
            resizeMode={FastImage.resizeMode.cover}
          />
          {BtnContainer()}
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: '1%',
  },
  innerContainer: {
    flexDirection: 'row',
    marginTop: '6%',
    marginBottom: '6%',
  },
  stockView: {
    height: hp('14%'),
    width: wp('90%'),
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: 'rgba(100, 100, 100, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  availableText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: RFValue(10),
  },
  backToOnlineText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: RFValue(10),
    textAlign: 'center',
  },
  mainInnerView: {
    width: wp('50%'),
  },
  typeTagsView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagsTextView: {
    borderRadius: 20,
    backgroundColor: colors.colorFD,
    marginStart: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(9),
    color: colors.white,
    paddingEnd: 9,
    paddingStart: 9,
    paddingTop: 2,
    paddingBottom: 3,
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '1%',
  },
  nameText: {
    color: colors.color33,
    fontFamily: fonts.semiBold,
    fontSize: RFValue(13),
    width: wp('50%'),
    textTransform: 'capitalize',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    marginTop: '3%',
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(15),
  },
  descriptionView: {
    marginTop: '3%',
    marginBottom: '1%',
  },
  descriptiontext: {
    color: colors.color8F,
    fontSize: RFValue(10),
    fontFamily: fonts.regular,
  },
  imageBtnView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('50%'),
  },
  itemImage: {
    height: hp('14%'),
    width: wp('30%'),
    borderRadius: 10,
    opacity: 1,
  },
  btnMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp('-2%'),
  },
  addItemAminView: {
    backgroundColor: colors.main,
    height: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 20,
  },
  decreaseView: {
    width: wp('9%'),
    alignItems: 'center',
    marginTop: '-3%',
  },
  decreaseText: {
    color: colors.white,
    fontSize: RFValue(18),
    fontFamily: fonts.medium,
  },
  qualityText: {
    color: colors.white,
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    marginTop: '1%',
  },
  increaseView: {
    width: wp('9%'),
    alignItems: 'center',
    marginTop: '-3%',
  },
  increaseText: {
    color: colors.white,
    fontSize: RFValue(18),
    fontFamily: fonts.medium,
  },
  addBtnView: {
    backgroundColor: colors.colorEC,
    height: hp('3%'),
    paddingHorizontal: '3%',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colors.main,
    borderRadius: 20,
    borderWidth: 1,
  },
  addText: {
    color: colors.main,
    fontFamily: fonts.bold,
    fontSize: RFValue(11),
    paddingEnd: 20,
    paddingStart: 20,
  },
  outStockView: {
    backgroundColor: colors.colorD9,
    height: hp('3%'),
    paddingHorizontal: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  outStockText: {
    color: colors.color8F,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
  },
});
