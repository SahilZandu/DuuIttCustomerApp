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
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../theme/colors';
import {appImages} from '../../commons/AppImages';
import Url from '../../api/Url';

const CategoryCard = ({data, onPress, navigation}) => {
  // console.log('data-- CategoryCard,', data);

  const renderProductItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('categoryViseFoodListing', {category: item})
      }>
      <View style={[styles.itemContainer(index)]}>
        <Image
          source={
            item?.image?.length > 0
              ? {uri: Url.Image_Url + item?.image}
              : appImages.burgerImage
          }
          resizeMode="cover"
          style={styles.image}
        />
        <Text
          numberOfLines={2}
          style={[styles.name, {textAlign: 'center', marginTop: '5%'}]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.titleText}>What would you like to have?</Text>
      <View style={styles.flatlistView}>
        <FlatList
          nestedScrollEnabled={true}
          data={data}
          renderItem={renderProductItem}
          keyExtractor={item => item?._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};
export default CategoryCard;

const styles = StyleSheet.create({
  titleText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '3%',
  },
  flatlistView: {
    marginTop: '3%',
    justifyContent: 'center',
  },
  listContainer: {
    paddingRight: '10%',
    justifyContent: 'center',
  },
  itemContainer: index => ({
    marginLeft: index == 0 ? 0 : 3,
    alignItems: 'center',
  }),
  image: {
    width: wp('26%'),
    height: hp('12%'),
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: colors.main,
    // backgroundColor:'red'
  },
  name: {
    marginTop: '4%',
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    width: wp('30%'),
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2%',
    width: wp('30%'),
  },
  rating: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '3%',
  },
  mint: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.color27,
    marginLeft: '3%',
    width: wp('23%'),
  },
  star: {
    position: 'absolute',
    top: 5, // Adjust the distance from the top
    right: 5, // Adjust the distance from the right
    zIndex: 1, // Ensure the star is above the image
  },
});
