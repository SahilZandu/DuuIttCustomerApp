import React, {useState} from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../../commons/AppImages';
// import Base_Image_Url from '../../api/Url';
import {SvgXml} from 'react-native-svg';
// import Spacer from '../Spacer';
// import FastImage from 'react-native-fast-image';
import {Rating} from 'react-native-rating-element';
import {colors} from '../../../../theme/colors';
import moment from 'moment';
import Ratings from '../../../../halpers/Ratings';

const OrgReviewCard = ({item, isDishRating}) => {
  // const imageUrl = Base_Image_Url?.Base_Image_UrlProfile;

  const asestsArray = [
    {item: ''},
    {item: ''},
    {item: ''},
    {item: ''},
    {item: ''},
    {item: ''},
    {item: ''},
    {item: ''},
  ];

  function getDateMonthsAgo(dateString) {
    const formatAgo = moment(dateString);
    const formattedDate = formatAgo.fromNow(); // Example: "in 5 months" or "5 months ago"
    return formattedDate;
  }

  const rateWithDishes = () => {
    return (
      <View style={styles.mainImageName}>
        <Image
          resizeMode="cover"
          style={styles.logoImage}
          source={
            // item?.user?.profile_picture
            //   ? {uri: imageUrl + item?.user?.profile_picture}
            //   : appImages.foodIMage
            appImages.foodIMage
          }
        />
        <View style={styles.nameDateView}>
          <Text numberOfLines={1} style={styles.nameText}>
            {/* {item?.user?.name} */}
            Preeti Thakur
          </Text>
          <Text style={styles.dateText}>
            {/* {item?.created_at ? item?.created_at.split(',')[0] : ''} */}
            {getDateMonthsAgo('2025-01-16T12:43:20.781Z')}
            {/*5 monts ago */}
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
          rateFormat={Number(3.5)}
          starHeight={18}
        />
      </View>
    );
  };

  const ratingImages = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.scrollViewInnnerView}>
          <View style={styles.mainReviewData}>
            {asestsArray?.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchImageView}
                key={index}>
                <Image
                  style={styles.imageItem}
                  resizeMode="cover"
                  source={appImages.foodIMage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {rateWithDishes()}
      {rating()}
      <Text style={styles.descriptionText}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's.
      </Text>
      {ratingImages()}
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
    lineHeight:18
  },
  scrollView: {
    flex: 1,
  },
  scrollViewInnnerView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainReviewData: {
    flexDirection: 'row',
    alignItems: 'center',
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
