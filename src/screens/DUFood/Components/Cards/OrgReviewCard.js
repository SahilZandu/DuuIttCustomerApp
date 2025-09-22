import React, {useState} from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import {Rating} from 'react-native-rating-element';
import {colors} from '../../../../theme/colors';
import moment from 'moment';
import Ratings from '../../../../halpers/Ratings';
import Url from '../../../../api/Url';
import Spacer from '../../../../halpers/Spacer';

const OrgReviewCard = ({item, index, isDishRating}) => {
  console.log('item---OrgReviewCard', item);
  function getDateMonthsAgo(dateString) {
    const formatAgo = moment(dateString);
    const formattedDate = formatAgo.fromNow(); // Example: "in 5 months" or "5 months ago"
    return formattedDate;
  }

  const rateWithDishes = () => {
    return (
      <View key={index} style={styles.mainImageName}>
        <Image
          resizeMode="cover"
          style={styles.logoImage}
          source={
            item?.customer?.profile_pic
              ? {uri:item?.customer?.profile_pic}
              : appImages.foodIMage
            // appImages.foodIMage
          }
        />
        <View style={styles.nameDateView}>
          <Text numberOfLines={1} style={styles.nameText}>
            {item?.customer?.name ?? 'No Name Added'}
          </Text>
          <Text style={styles.dateText}>
            {getDateMonthsAgo(item?.createdAt)}
          </Text>
        </View>
        <View style={styles.shareLikeImageView}>
          <SvgXml xml={appImagesSvg.share} />
          <SvgXml style={{marginStart: 10}} xml={appImagesSvg.thumsUp} />
        </View>
      </View>
    );
  };

  const rating = () => {
    return (
      <View style={{marginTop: '-1%', marginHorizontal: 10}}>
        <Ratings
          mainStyle={styles.starRatingImage}
          rateFormat={Number(item?.food_rating)}
          starHeight={18}
        />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.touchImageView}
        key={index}>
        <Image
          style={styles.imageItem}
          resizeMode="cover"
          source={
            item?.image
              ? {uri:item?.image}
              : appImages.foodIMage
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {rateWithDishes()}
      {rating()}
      <Text style={styles.descriptionText}>{item?.food_review}</Text>
      <Spacer space={'3%'} />
      {item?.dish_items?.length > 0 && (
        <FlatList
          contentContainerStyle={{paddingRight: '10%'}}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          horizontal={true}
          data={item?.dish_items}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      )}
    </View>
  );
};

export default OrgReviewCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.appBackground,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginTop: '5%',
    padding: 12,
  },
  mainImageName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    height: hp('5.5%'),
    width: wp('12%'),
    borderRadius: 100,
  },
  nameDateView: {
    flex: 1,
    marginLeft: '3%',
  },
  nameText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    maxWidth: wp('53%'),
  },
  dateText: {
    color: colors.color8F,
    fontFamily: fonts.regular,
    fontSize: RFValue(11),
    marginTop: '2%',
  },
  shareLikeImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRatingImage: {
    borderRadius: 0,
    borderColor: colors.white,
    backgroundColor: colors.white,
    marginTop: '3%',
  },
  descriptionText: {
    marginTop: '1.5%',
    color: colors.color33,
    fontFamily: fonts.regular,
    fontSize: RFValue(11),
    marginHorizontal: 5,
    lineHeight: 18,
  },
  touchImageView: {
    marginHorizontal: 5,
    marginTop: '2%',
  },
  imageItem: {
    height: hp('6.5%'),
    width: wp('14%'),
    borderRadius: 6,
  },
});
