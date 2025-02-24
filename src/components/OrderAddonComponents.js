import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {appImagesSvg,} from '../commons/AppImages';
import {colors} from '../theme/colors'

import { fonts} from '../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
// import Spacer from './Spacer';
import {currencyFormat} from '../halpers/currencyFormat';

export default function OrderAddonComponent({
  addonData,
  appCart,
  onSelect,
  isAddons,
  onLimitOver,
  isResOpen
}) {
  const [addons, setaddons] = useState(
    addonData && addonData?.addon ?   addonData?.addon :[]
    // isAddons && isAddons.length > 0 ? isAddons : [],
  );

  let addonId = 0;

  const checkAddonThere = (arr, id) => {
    console.log("arr, id",arr, id);
    return arr?.find(item => (item?._id || item?.addon_prod_id )== id);
  };

  const getGroupLength = (a, gid) => {
    let f = a?.filter(item => item?.addon_group_id === gid);
    return f?.length;
  };

  const onPressVC = (item, value) => {
    let arr = addons;
    
    console.log("item:--",item)
 
    let limit = item?.max_selection ? item?.max_selection : item?.addon?.length

    const obj = {
      addon_prod_id: value._id,
      addon_name: value.name,
      addon_price: value.price,
      addon_group_id: item?._id,
    };

    if (checkAddonThere(arr, value?._id)) {
      let filter = arr?.filter(item => (item?._id ||  item?.addon_prod_id) !== value?._id);
      setaddons(filter);
       onSelect(filter);
    } else {
      if (getGroupLength(arr, value?.group_id) < limit) {
        setaddons([...addons, obj]);
        arr = [...addons, obj];
        console.log('arrrrr', arr);
         onSelect(arr);
      } else {
        onLimitOver(limit);
      }
    }
  };

  const getSelectionLimit = item => {
    let limit = item?.max_selection
      ? item?.max_selection
      : item?.addon?.length;

    return `Select up to ${limit} option` + `${limit > 1 ? 's' : ''}`;
  };

  return (
    <View pointerEvents={isResOpen ?  'auto' : 'none'}  style={{opacity : isResOpen ? 1 :0.6}} >
      {addonData && addonData?.length > 0 && (
        <View>
          {addonData?.map((item, index) => {
            return (
              <View
                style={styles.conatiner}>
                <Text
                  style={styles.titleText}>
                  {item?.group}{' '}
                </Text>
               
                <Text style={styles.selectText}>{getSelectionLimit(item)}</Text>
                <View
                style={{
                  height:2,
                  marginBottom:'2%',
                  marginTop:'3%',
                  backgroundColor:colors.colorD9
                }}/>
                <View style={styles.mainViewRender}>
                  {item?.addon?.map((value, i) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          onPressVC(item, value);
                        }}
                        hitSlop={styles.hitSlotTouch}
                        activeOpacity={0.8}
                        style={styles.touchView}>
                        <View style={styles.addonNameView}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.addonName,
                              {
                                color: checkAddonThere(addons, value?._id)
                                  ? colors.main
                                  :colors.black,
                              },
                            ]}>
                            {value?.name}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.priceText,
                            {
                              color: checkAddonThere(addons, value?._id)
                                ? colors.main
                                : colors.black,
                            },
                          ]}>
                          {currencyFormat(value?.price)}
                        </Text>
                        {addons?.length > 0 &&
                        checkAddonThere(addons, value?._id) ? (
                          <SvgXml xml={check} />
                        ) : (
                          <SvgXml xml={uncheck} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                  {/* <Spacer space={hp('1%')} /> */}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner:{
    backgroundColor: colors.white,
    borderRadius:10,
    shadowOffset:true,
    shadowColor:colors.black,  // Shadow color (black)
    shadowOffset: { width: 0, height: 2 },  // Horizontal and vertical offset
    shadowOpacity: 0.3,  // Opacity of the shadow
    shadowRadius: 5,  // Blur radius of the shadow
    elevation: 5,  // Android shadow (elevation must be set to display shadow on Android)
    shadowRadius:10,
    marginHorizontal:'4%',
    marginTop: '4%',
    paddingHorizontal: '5%',
    paddingBottom:'2%'
  },
  titleText:{
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color:colors.black85,
    marginTop: '4%',
  },
  upperViewMain: {
    backgroundColor: colors.white,
    marginTop: hp('0.1%'),
    justifyContent: 'center',
  },
  uprerTextView: {
    marginHorizontal: 16,
    marginTop: '3%',
    marginBottom: '2%',
  },
  baseText: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  selectText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.color64,
    marginTop: hp('0.5%'),
  },

  mainViewRender: {
    backgroundColor: colors.white,
    marginTop: '0.9%',
  },
  hitSlotTouch: {
    top: 10,
    bottom: 10,
    left: 15,
    right: 15,
  },
  touchView: {
    flexDirection: 'row',
    marginTop: '2%',
    marginBottom: '1.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addonNameView: {
    flex: 1,
    justifyContent: 'center',
  },
  addonName: {
    fontFamily: fonts.regular,
    fontSize: RFValue(13),
    width: wp('70%'),
  },
  priceText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(13),
    right: 10,
  },
});

const uncheck = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#D9D9D9"/>
<rect x="3" y="3" width="10" height="10" rx="5" fill="white"/>
</svg>`;

const check = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#28B056"/>
<rect x="3" y="3" width="10" height="10" rx="5" fill="#28B056"/>
</svg>`;
