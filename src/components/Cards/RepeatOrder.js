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

const RepeatOrder = ({data, onPress}) => {
  const renderRepeatOrderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <View style={styles.itemContainer(index)}>
          <SvgXml style={styles.star} xml={item?.like == 1 ? like : unlike} />
          <Image
            source={item.imageUrl}
            resizeMode="cover"
            style={styles.image}
          />

          <Text numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          <View style={styles.viewContainer}>
            <SvgXml xml={star} />
            <Text numberOfLines={1} style={styles.rating}>
              3.9
            </Text>
            <Text numberOfLines={1} style={styles.mint}>
              25-30 mins
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={styles.titleText}>Repeat order</Text>
      <View style={styles.flatlistView}>
        <FlatList
          data={data}
          renderItem={renderRepeatOrderItem}
          keyExtractor={item => item?.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};
export default RepeatOrder;

const styles = StyleSheet.create({
    titleText: {
        fontSize: RFValue(13),
        fontFamily: fonts.semiBold,
        color: colors.black,
        marginTop: '2.5%',
      },
    flatlistView:{
        marginTop: '4%', justifyContent: 'center'
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
const unlike = `<svg width="19" height="19" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.99726 1.83832C4.19752 0.920871 2.8639 0.674081 1.86188 1.51419C0.859858 2.35429 0.718787 3.7589 1.50568 4.7525C2.15993 5.57861 4.13991 7.32093 4.78884 7.88485C4.86144 7.94795 4.89774 7.97949 4.94009 7.99189C4.97704 8.0027 5.01748 8.0027 5.05444 7.99189C5.09678 7.97949 5.13308 7.94795 5.20568 7.88485C5.85461 7.32093 7.83459 5.57861 8.48884 4.7525C9.27573 3.7589 9.15189 2.34545 8.13264 1.51419C7.1134 0.682918 5.797 0.920871 4.99726 1.83832Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const like = `<svg width="19" height="19" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.99726 1.83832C4.19752 0.920871 2.8639 0.674081 1.86188 1.51419C0.859858 2.35429 0.718787 3.7589 1.50568 4.7525C2.15993 5.57861 4.13991 7.32093 4.78884 7.88485C4.86144 7.94795 4.89774 7.97949 4.94009 7.99189C4.97704 8.0027 5.01748 8.0027 5.05444 7.99189C5.09678 7.97949 5.13308 7.94795 5.20568 7.88485C5.85461 7.32093 7.83459 5.57861 8.48884 4.7525C9.27573 3.7589 9.15189 2.34545 8.13264 1.51419C7.1134 0.682918 5.797 0.920871 4.99726 1.83832Z" fill="#E10A0A" stroke="#E10A0A" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const star = `<svg width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 0L5.29313 2.22016L7.80423 2.76393L6.09232 4.67984L6.35114 7.23607L4 6.2L1.64886 7.23607L1.90768 4.67984L0.195774 2.76393L2.70687 2.22016L4 0Z" fill="#F9BD00"/>
</svg>`;
