import React from 'react';
import {Text, View, Image, Pressable, TouchableOpacity} from 'react-native';
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
    if (icon && icon?.length > 0) {
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
    } else {
      return appImagesSvg?.veg;
    }
  };

  const getIsVarient = item => {
    return item?.varient_id ? true : false;
  };

  const getIsAddons = item => {
    // return item.addon_item && item.addon_item.length > 0 ? true : false;
    return item.addons && item.addons.length > 0 ? true : false;
  };

  const EditBtn = ({item}) => {
    if (getIsVarient(item) || getIsAddons(item)) {
      return (
        <Pressable
          onPress={() => onEdit(item)}
          style={{
            marginLeft: wp('5.5%'),
            marginTop: '1%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#1D721E',
              fontSize: RFValue(11),
              fontFamily: fonts.medium,
            }}>
            Edit{' '}
          </Text>
          <SvgXml xml={editIcon} />
        </Pressable>
      );
    } else {
      return null;
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 10,
        alignItems: 'center',
        margin: 20,
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        paddingHorizontal: wp('6%'),
        shadowOffset: {width: 0, height: 6},
      }}>
      {appCart.cartitems.map((item, key) => (
        <View key={key} style={{marginTop: '5%'}}>
          <View style={{marginHorizontal: '4%'}}>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: item?.varient_name ? 'flex-start' : 'center',
              }}>
              <View style={{width: wp('5.5%')}}>
                <SvgXml xml={getType(item.product.veg_non_veg)} />
              </View>
              <View>
                
                {item?.varient_name && (
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: fonts.regular,

                      fontSize: RFValue(10),
                    }}>
                    {item?.varient_name}
                  </Text>
                )}
              </View>
              
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '2%',
                justifyContent: 'space-between',
                marginLeft: wp('5.5%'),
              }}>
              <Text
                style={{
                  color: 'rgba(51, 51, 51, 1)',
                  fontFamily: fonts.regular,

                  fontSize: RFValue(14),
                }}>
                {currencyFormat(item?.sub_total)}
              </Text>
              <Text
                style={{
                  color: 'rgba(51, 51, 51, 1)',
                  fontFamily: fonts.regular,

                  fontSize: RFValue(14),
                }}>
                {currencyFormat(item.grand_total)}
              </Text>
            </View> */}

            <View
              style={{
                paddingEnd: 20,
                paddingStart: 20,
                flexDirection: 'row',
                width: wp('90%'),
                justifyContent: 'space-between',
              }}>
              <View>
                <Image
                  style={{borderRadius: 10, height: 60, width: 60}}
                  source={appImages.foodIMage}
                />
              </View>
              <View
                style={{
                  width: wp('40%'),
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: 'black',
                    fontFamily: fonts.regular,
                    fontSize: RFValue(14),
                    width: wp('62%'),
                    marginTop: item?.varient_name ? '-2%' : 0,
                  }}>
                  {item.productname}
                </Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      height: hp('4%'),
                      paddingHorizontal: '2%',
                      width: wp('24%'),
                      backgroundColor: '#28B056',
                      borderColor: '#28B056',
                      borderRadius: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Pressable
                      onPress={() => {
                        console.log('clcik');
                        handleAddRemove(item, Number(item.quantity) - 1);
                      }}
                      style={{
                        height: hp('4%'),
                        width: wp('7%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: fonts.semiBold,
                          fontSize: RFValue(14),
                        }}>
                        -
                      </Text>
                    </Pressable>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fonts.semiBold,
                        fontSize: RFValue(12),
                        width: wp('6%'),
                        textAlign: 'center',
                      }}>
                      {item.quantity}
                    </Text>
                    <Pressable
                      onPress={() =>
                        handleAddRemove(item, Number(item.quantity) + 1)
                      }
                      style={{
                        height: hp('4%'),
                        width: wp('7%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: fonts.semiBold,
                          fontSize: RFValue(14),
                        }}>
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    color: 'rgba(51, 51, 51, 1)',
                    fontFamily: fonts.regular,
                    fontSize: RFValue(14),
                  }}>
                  {currencyFormat(item.finalprice)}
                </Text>
              </View>
            </View>

            {item?.varient_name && (
              <View
                style={{
                  flexWrap: 'wrap',
                  marginTop: '2%',
                  marginLeft: wp('5.5%'),
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: fonts.regular,

                    fontSize: RFValue(10),
                  }}>
                  {item?.varient_name}
                </Text>
              </View>
            )}

            <View>
              {/* {item?.addon_item && item?.addon_item.length > 0 && ( */}
              {item?.addons && item?.addons.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                    marginEnd:wp('5.5%'),
                    marginTop: '2%',
                    marginLeft: wp('5.5%'),
                  }}>
                  {/* {item.addon_item.map((i, key) => ( */}

                  {item.addons.map((i, key) => (
                    <Text
                      style={{
                        color: '#646464',
                        fontFamily: fonts.medium,
                        fontSize: RFValue(11),
                      }}
                      key={key}>
                      {/* {i.addon_name} */}
                      {i.addon_name}
                      {/* {key == item?.addon_item.length - 1 ? '' : ', '} */}
                      {key == item?.addons.length - 1 ? '' : ', '}
                    </Text>
                  ))}
                  <EditBtn item={item} />
                </View>
              )}
            </View>
            
          </View>
          {key !== appCart.cartitems.length - 1 && (
            <View style={{marginEnd: 30, marginStart: 30}}>
              <DotedLine />
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        onPress={() => {
          // isOpenNote=!isOpenNote
          handlenoteVisibility(true);
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
            fontSize: RFValue(10),
            color: '#242424',
          }}>
          Add a note for the restaurant
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartItems;

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
<path d="M5.99999 10.0001H10.5M1.5 10.0001H2.33727C2.58186 10.0001 2.70416 10.0001 2.81925 9.97248C2.92128 9.94799 3.01883 9.90758 3.1083 9.85275C3.20921 9.79091 3.29569 9.70444 3.46864 9.53148L9.75001 3.25011C10.1642 2.8359 10.1642 2.16433 9.75001 1.75011C9.3358 1.3359 8.66423 1.3359 8.25001 1.75011L1.96863 8.03148C1.79568 8.20444 1.7092 8.29091 1.64736 8.39183C1.59253 8.4813 1.55213 8.57885 1.52763 8.68088C1.5 8.79597 1.5 8.91826 1.5 9.16286V10.0001Z" stroke="#1D721E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
