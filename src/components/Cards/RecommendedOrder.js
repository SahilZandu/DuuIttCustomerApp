import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fonts } from '../../theme/fonts/fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../theme/colors';
import { currencyFormat } from '../../halpers/currencyFormat';
import { appImages } from '../../commons/AppImages';
import Url from '../../api/Url';

const RecommendedOrder = ({ data, onPress,onAddDec }) => {
  
  const renderRecommendedOrderItem = ({ item, index }) => {
    // console.log('renderRecommendedOrderItem--', item, index);

    return (
      <View style={styles.itemContainer(index)}>
        <Image source={item?.item?.image?.length > 0 ? 
        { uri: Url?.Image_Url + item?.item?.image } 
        : appImages.foodIMage}
          resizeMode="cover" style={styles.image} />
        <Text numberOfLines={1} style={styles.name}>
          {item?.item?.name}
        </Text>
        <View style={[styles.viewContainer]}>
          <Text style={styles.priceText}>
            {currencyFormat(Number(item?.item?.selling_price))}</Text>
          {/* <AddButton item={item} /> */}
          <>
      {item?.item?.quantity > 0 ? 
      <View
        style={{flexDirection:'row',
           paddingVertical: 3,
          width: wp('15%'),
          backgroundColor: colors.main, // Filled color (green in this case)
          borderWidth: 2,
          borderColor: colors.main, // Border color (slightly darker green)
          borderRadius: 20, // Rounded corners
          alignItems: 'center',
          justifyContent:'space-evenly',
          }}>
          <TouchableOpacity
          onPress={()=>{onAddDec(item , 
            Number(item?.item?.quantity) - 1
            )
            }}
          activeOpacity={0.8} 
          hitSlop={styles.hitSlot}>
        <Text style={styles.addDecBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.addDecText}>{item?.item?.quantity}</Text>
        <TouchableOpacity
         onPress={()=>{onAddDec(item ,
           Number(item?.item?.quantity) + 1
        )}}
        activeOpacity={0.8} 
         hitSlop={styles.hitSlot}>
        <Text style={styles.addDecBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      :
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>{onAddDec(item ,
          Number(item?.item?.quantity) + 1
        )}}
         style={styles.buttonContainer}>
        <Text style={styles.buttonText}>ADD</Text>
      </TouchableOpacity>}
      </>
        </View>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.titleText}>Recommended orders</Text>
      {data?.length > 0 ? <View style={styles.flatlistView}>
        <FlatList
          data={data}
          renderItem={renderRecommendedOrderItem}
          keyExtractor={item => item?._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View> :
        <View style={styles.noDataView}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>}
    </View>
  );
};
export default RecommendedOrder;

const styles = StyleSheet.create({
  flatlistView: {
    marginTop: '4%',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '2.5%',
  },
  listContainer: {
    paddingRight: '10%',
    justifyContent: 'center',
  },
  itemContainer: index => ({
    marginLeft: index == 0 ? 0 : 15,
    alignItems: 'center',
  }),
  image: {
    width: wp('30%'),
    height: hp('15%'),
    borderRadius: 10,
  },
  name: {
    marginTop: '3%',
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    width: wp('30%'),
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '3%',
    width: wp('30%'),
  },
  priceText: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '3%',
  },
  buttonContainer: {
    paddingVertical: 3,
    // paddingHorizontal: 15,
    width: wp('15%'),
    backgroundColor: colors.colorEC, // Filled color (green in this case)
    borderWidth: 2,
    borderColor: colors.main, // Border color (slightly darker green)
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.main, // Text color
    fontSize: RFValue(10),
    fontWeight: fonts.bold,
  },
  addDecText: {
    color: colors.white, // Text color
    fontSize: RFValue(11),
    fontWeight: fonts.bold,
  },
  addDecBtnText: {
    color: colors.white, // Text color
    fontSize: RFValue(13),
    fontWeight: fonts.bold,
  },
  hitSlot:{
    top:10,bottom:10,left:10,right:10
  },
  noDataView: {
    justifyContent: 'center', marginTop: '3%', marginLeft: '5%'
  },
  noDataText: {
    fontSize: RFValue(12), fontFamily: fonts.medium, color: colors.black
  }
});
