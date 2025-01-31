import React from 'react';
import {
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {currencyFormat} from '../../../halpers/currencyFormat';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DotedLine from '../Components/DotedLine';
// import Base_Image_Url from '../api/Url';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {colors} from '../../../theme/colors';
import Url from '../../../api/Url';

// const imageUrl = Base_Image_Url?.Base_Image_UrlProduct;
const isOpenNote = false;

const CartItems = ({
  appCart,
  isOpen,
  handleAddRemove,
  handlenoteVisibility,
  isCartScreen,
  onEdit,
}) => {
  // isOpenNote=isOpen
  const getType = icon => {
    switch (icon) {
      case 'simple':
      case 'veg':
        return appImagesSvg?.veg;
      case 'egg':
        return appImagesSvg?.nonVeg;
      case 'non-veg':
        return appImagesSvg?.nonVeg;
      default:
        return appImagesSvg?.veg;
    }
  };

  const getIsVarient = item => {
    return item?.varient_id ? true : false;
  };

  const getIsAddons = item => {
    // return item.addon_item && item.addon_item.length > 0 ? true : false;
    return item?.addons && item?.addons?.length > 0 ? true : false;
  };

  const EditBtn = ({item}) => {
    if (getIsVarient(item) || getIsAddons(item)) {
      return (
        <Pressable onPress={() => onEdit(item)} style={styles.editBtnView}>
          <Text style={styles.editBtnText}>Edit </Text>
          <SvgXml xml={editIcon} />
        </Pressable>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {appCart?.cartitems?.map((item, key) => {
        console.log('item--CartItem', item, key);
        return (
          <View key={key} style={styles.cartItemView}>
            <View style={styles.cartItemPriceView}>
              <View>
                <Image
                  style={styles.cartImage}
                  source={
                    item?.image?.length > 0
                      ? {uri: Url?.Image_Url + item?.image}
                      : appImages.foodIMage
                  }
                />
                <View style={styles.cartTypeItem}>
                  <SvgXml
                    width={20}
                    height={20}
                    xml={getType(item?.veg_nonveg ?? 'veg')}
                  />
                </View>
              </View>
              <View style={styles.cartItenNamePriceView}>
                <Text numberOfLines={2} style={styles.cartProductName}>
                  {item?.name}
                </Text>
                <View style={styles.btnPriceMainView}>
                  <View style={styles.btnMainView}>
                    <Pressable
                      onPress={() => {
                        handleAddRemove(item, Number(item?.quantity) - 1);
                      }}
                      style={styles.decreaseTouch}>
                      <Text style={styles.decreaseText}>-</Text>
                    </Pressable>
                    <Text style={styles.qunitityText}>{item?.quantity ?? 0}</Text>
                    <Pressable
                      onPress={() =>
                        handleAddRemove(item, Number(item?.quantity ?? 0) + 1)
                      }
                      style={styles.increaseTouch}>
                      <Text style={styles.increaseText}>+</Text>
                    </Pressable>
                  </View>
                  <Text style={{flex: 1}} />
                  <Text style={styles.priceText}>
                    {currencyFormat(
                      item?.quantity >= 1
                        ? Number(item?.selling_price * item?.quantity)
                        : Number(item?.selling_price),
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {item?.varient_name && (
              <View style={styles.varientView}>
                <Text style={styles.varientText}>{item?.varient_name}</Text>
              </View>
            )}

            <View>
              {/* {item?.addon_item && item?.addon_item.length > 0 && ( */}
              {item?.addons && item?.addons?.length > 0 && (
                <View style={styles.addonsView}>
                  {/* {item.addon_item.map((i, key) => ( */}

                  {item?.addons?.map((i, key) => (
                    <Text style={styles.addonsText} key={key}>
                      {i?.addon_name}
                      {key == item?.addons?.length - 1 ? '' : ', '}
                    </Text>
                  ))}
                  <EditBtn item={item} />
                </View>
              )}
            </View>

            {key !== appCart?.cartitems?.length - 1 && <DotedLine />}
          </View>
        );
      })}

      <TouchableOpacity
        onPress={() => {
          // isOpenNote=!isOpenNote
          handlenoteVisibility(true);
        }}
        style={styles.addNoteView}>
        <Image style={styles.noteImage} source={appImages.retaurentNote} />
        <Text style={styles.noteText}>Add a note for the restaurant</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartItems;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingBottom: '4%',
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 6},
  },
  cartItemView: {
    marginTop: '5%',
    marginHorizontal: '5%',
  },
  cartItemPriceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartImage: {
    borderRadius: 10,
    height: hp('9%'),
    width: wp('20%'),
  },
  cartTypeItem: {
    position: 'absolute',
    bottom: 0.1,
    right: 0.1,
  },
  cartItenNamePriceView: {
    marginLeft: '3%',
    justifyContent: 'center',
  },
  cartProductName: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    width: wp('60%'),
    lineHeight: 20,
    marginTop: '1%',
  },
  btnPriceMainView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: '2%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  btnMainView: {
    borderWidth: 1,
    height: hp('3.5%'),
    paddingHorizontal: '2%',
    width: wp('22%'),
    backgroundColor: colors.main,
    borderColor: colors.main,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseTouch: {
    height: hp('4%'),
    width: wp('7%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: RFValue(14),
  },
  qunitityText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: RFValue(12),
    width: wp('6%'),
    textAlign: 'center',
  },
  increaseTouch: {
    height: hp('4%'),
    width: wp('7%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  increaseText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: RFValue(14),
  },
  priceText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(14),
    marginRight: '5%',
    textAlign: 'center',
    top: '-3%',
  },
  varientView: {
    flexWrap: 'wrap',
    marginTop: '2%',
    marginLeft: wp('5.5%'),
  },
  varientText: {
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: RFValue(10),
  },
  addonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginEnd: wp('5.5%'),
    marginTop: '2%',
    marginLeft: wp('5.5%'),
  },
  addonsText: {
    color: colors.color64,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
  },
  addNoteView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.colorCA,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
    marginLeft: wp('3%'),
  },
  noteImage: {
    width: wp('4%'),
    height: hp('2%'),
  },
  noteText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(10),
    color: colors.color24,
    marginLeft: '2%',
  },
  editBtnView: {
    marginLeft: wp('5.5%'),
    marginTop: '1%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtnText: {
    color: colors.main,
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
  },
});

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
<path d="M5.99999 10.0001H10.5M1.5 10.0001H2.33727C2.58186 10.0001 2.70416 10.0001 2.81925 9.97248C2.92128 9.94799 3.01883 9.90758 3.1083 9.85275C3.20921 9.79091 3.29569 9.70444 3.46864 9.53148L9.75001 3.25011C10.1642 2.8359 10.1642 2.16433 9.75001 1.75011C9.3358 1.3359 8.66423 1.3359 8.25001 1.75011L1.96863 8.03148C1.79568 8.20444 1.7092 8.29091 1.64736 8.39183C1.59253 8.4813 1.55213 8.57885 1.52763 8.68088C1.5 8.79597 1.5 8.91826 1.5 9.16286V10.0001Z" stroke="#1D721E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
