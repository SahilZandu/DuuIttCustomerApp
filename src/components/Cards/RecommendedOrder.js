import React, {useState, useEffect, memo} from 'react';
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
import {fonts} from '../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../theme/colors';
import {currencyFormat} from '../../halpers/currencyFormat';

const RecommendedOrder = ({data, onPress}) => {
  const AddButton = () => {
    return (
      <TouchableOpacity
       activeOpacity={0.8}
       onPress={onPress} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>ADD</Text>
      </TouchableOpacity>
    );
  };

  const renderRecommendedOrderItem = ({item, index}) => {
    return (
      <View style={styles.itemContainer(index)}>
        <Image source={item.imageUrl} resizeMode="cover" style={styles.image} />
        <Text numberOfLines={1} style={styles.name}>
          {item?.name}
        </Text>
        <View style={[styles.viewContainer]}>
          <Text style={styles.priceText}>{currencyFormat(Number(99))}</Text>
          <AddButton />
        </View>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.titleText}>Recommended orders</Text>
      <View style={styles.flatlistView}>
        <FlatList
          data={data}
          renderItem={renderRecommendedOrderItem}
          keyExtractor={item => item?.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
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
});
