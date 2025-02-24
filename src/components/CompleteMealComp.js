import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Url from '../api/Url';
import {currencyFormat} from '../halpers/currencyFormat';

const CompleteMealComp = ({item, index, handleAddDecMeal}) => {
  const AddButton = ({item}) => {
    return (
      <>
        {item?.food_items?.quantity > 0 ? (
          <View style={styles.mealQuantityView}>
            <TouchableOpacity
              onPress={() => {
                handleAddDecMeal(item, Number(item?.food_items?.quantity) - 1);
              }}
              activeOpacity={0.8}
              hitSlop={styles.hitSlot}>
              <Text style={styles.addDecBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.addDecText}>
              {item?.food_items?.quantity ?? 0}
            </Text>
            <TouchableOpacity
              onPress={() => {
                handleAddDecMeal(item, Number(item?.food_items?.quantity) + 1);
              }}
              activeOpacity={0.8}
              hitSlop={styles.hitSlot}>
              <Text style={styles.addDecBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              handleAddDecMeal(item, Number(item?.food_items?.quantity) + 1);
            }}
            style={styles.buttonContainer}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };
  return (
    <View style={styles.itemContainer}>
      <Image
        source={
          item?.food_items?.image?.length > 0
            ? {uri: Url?.Image_Url + item?.food_items?.image}
            : appImages.foodIMage
        }
        resizeMode="cover"
        style={styles.image}
      />

      <Text numberOfLines={2} style={styles.name}>
        {item?.food_items?.name}
      </Text>
      <View style={[styles.viewContainer]}>
        <Text numberOfLines={1} style={styles.rating}>
          {currencyFormat(item?.food_items?.selling_price)}
        </Text>
        <AddButton item={item} />
      </View>
    </View>
  );
};

export default CompleteMealComp;

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    marginTop: 8,
    fontSize: RFValue(11),
    fontFamily: fonts.semiBold,
    color: colors.black,
    width: wp('25%'),
    // textAlign: 'center',
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
    width: wp('10%'),
  },
  listContainer: {
    paddingVertical: 10,
  },

  mealQuantityView: {
    flexDirection: 'row',
    paddingVertical: 3,
    width: wp('15%'),
    backgroundColor: colors.main, // Filled color (green in this case)
    borderWidth: 2,
    borderColor: colors.main, // Border color (slightly darker green)
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  addDecText: {
    color: colors.white,
    fontSize: RFValue(11),
    fontFamily: fonts.semiBold,
  },
  addDecBtnText: {
    color: colors.white, 
    fontSize: RFValue(13),
    fontWfontFamilyeight: fonts.bold,
  },
  buttonText: {
    color: colors.main,
    fontSize: RFValue(11),
    fontFamily: fonts.semiBold,
  },
  hitSlot: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
});
