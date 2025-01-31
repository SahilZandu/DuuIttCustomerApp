import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  Pressable,
  ProgressBarAndroid,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
// import Base_Image_Url from '../../api/Url';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import CartHeader from '../../Cart/CartHeader';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {colors} from '../../../theme/colors';
import {Rating} from 'react-native-rating-element';
import FastImage from 'react-native-fast-image';
import {SvgXml} from 'react-native-svg';
// import ImageTextComponent from '../../Components/ImageTextComponent';
import moment from 'moment';
// import FullImageView from '../../common/FullImageView';
import Header from '../../../components/header/Header';
import LinearGradient from 'react-native-linear-gradient';
// import {currencyFormat} from '../../helpers/currencyFormat';
// import {rootStore} from '../../stores/rootStore';
// import {APP_IMAGE_BASEURL} from '../../constant';
import OrgReviewCard from '../Components/Cards/OrgReviewCard';
import AppInputScroll from '../../../halpers/AppInputScroll';
import Ratings from '../../../halpers/Ratings';
// import { appImages } from '../../../commons/AppImages';

let asestsArray = [
  {
    item: '',
  },
  {
    item: '',
  },
  {
    item: '',
  },
  {
    item: '',
  },
  {
    item: '',
  },
  {
    item: '',
  },
  {
    item: '',
  },
];

export default function RestaurantDetail({navigation, route}) {
  const day = new Date();
  let today = day.getDay();
  const {restaurantData} = route?.params;
  // console.log('restaurant----',restaurantData);
  // const {getResturantReviews} = rootStore.resturantstore;
  const [fullImage, setFullImage] = useState(false);
  const [imageUriIndex, setImageUriIndex] = useState(0);
  const [orgReviews, setOrgReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(restaurantData ?? {});
  console.log('restaurant----', restaurant, restaurantData);

  const packageMoneyData = [
    {
      id: '0',
      name: 'Taste',
      rate: '3.0',
    },
    {
      id: '1',
      name: 'Packaging',
      rate: '4.5',
    },
    {
      id: '2',
      name: 'Value for money',
      rate: '3.5',
    },
  ];

  // useEffect(() => {
  //   asestsArray = [];
  //   if (restaurant?.assets?.length > 0) {
  //     restaurant?.assets?.map((item, i) => {
  //       let object = {
  //         uri: Base_Image_Url?.Base_Image_Assets_Url + item?.file_name,
  //       };
  //       asestsArray.push(object);
  //     });
  //   }
  // }, [restaurant]);

  useEffect(() => {
    const getReviews = async () => {
      //   const reviews = await getResturantReviews(restaurant?.id);
      //   console.log('get org Reviews:', reviews);
      //   setOrgReviews(reviews && reviews.length > 0 ? reviews : []);
      //
    };

    getReviews();
  }, []);

  const photoList = (item, i) => {
    // console.log('item', item);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setFullImage(true), setImageUriIndex(i);
        }}
        style={styles.assetsImageTouch}
        key={i}>
        <Image
          resizeMode="cover"
          style={styles.assetsImage}
          source={
            appImages.foodIMage
            // uri: Base_Image_Url?.Base_Image_Assets_Url + item?.file_name,
          }
        />
      </TouchableOpacity>
    );
  };

  const TimeFormat = d => {
    if (d) {
      return moment(d, 'HHmmss').format('hh:mm a');
    } else {
      return '';
    }
  };

  const getOpenTiming = data => {
    let dayData = 'Close';
    data?.map((item, i) => {
      if (item?.days_of_week == today) {
        dayData = ` ${TimeFormat(item?.open_times)} - ${TimeFormat(
          item?.close_time,
        )}`;
      }
    });
    return dayData;
  };
  const getProductList = (item, i) => {
    return (
      <>
        <Text
          style={[
            styles.restaurantProductText,
            {marginLeft: i == 0 ? 0 : '1%'},
          ]}>
          {item?.title}{' '}
          {(i + 1) % restaurant?.product?.slice(0, 3)?.length == 0 ? '' : '|'}
        </Text>
      </>
    );
  };

  const onRateWidth = rate => {
    if (rate >= 0 && rate <= 1) {
      return wp('10%');
    } else if (rate > 1 && rate <= 3) {
      return wp('20%');
    } else if (rate > 3 && rate <= 4) {
      return wp('30%');
    } else if (rate > 4 && rate < 5) {
      return wp('40%');
    } else if (rate == 5) {
      return wp('50%');
    } else {
      return wp('10%');
    }
  };

  const ProgressView = ({item, index}) => {
    return (
      <View style={styles.progressView}>
        <Text style={styles.progessName}>{item?.name}</Text>
        <View style={styles.progressFillUnfillView}>
          <View style={styles.unFillView} />
          <View
            style={[
              styles.fillView,
              {
                width: onRateWidth(item?.rate),
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const DisRating = dishes => {
    return (
      <View style={styles.ratingTextView}>
        <View style={styles.ratingView}>
          <Text style={styles.ratingValue}>3.5</Text>
          <Text style={styles.ratingText}>Very Good</Text>
          <Ratings
            mainStyle={styles.starRatingImage}
            rateFormat={Number(3.5)}
            starHeight={20}
          />
        </View>
        <View style={styles.progressMainView}>
          {packageMoneyData?.map((item, index) => {
            return <ProgressView item={item} index={index} />;
          })}
        </View>
      </View>
    );
  };

  const OrgReviewsList = () => {
    return (
      <View style={styles.mainReviewsView}>
        <View style={styles.reviewsView}>
          <Text style={styles.reviewsText}>Reviews</Text>
          {/* {asestsArray?.length > 2 && (
            <Pressable
              onPress={() =>
                navigation.navigate('orgAllReviews', {
                  reviews: orgReviews,
                  restaurant,
                })
              }>
              <Text
                style={{
                  color: '#E95D5D',
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                }}>
                See all
              </Text>
            </Pressable>
          )} */}
        </View>
        <View>
          {/* {orgReviews
            .filter((_, index) => index < 2)
            .map((item, index) => (
              <View key={index}>
                <OrgReviewCard item={item} isDishRating={false} />
              </View>
            ))} */}
          {asestsArray?.map((item, index) => (
            <View key={index}>
              <OrgReviewCard item={item} isDishRating={false} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.conatiner}>
      <Header
        title={restaurant?.name}
        shareSVG={appImagesSvg.share}
        backArrow={true}
        shareIcon={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <AppInputScroll
        Pb={'25%'}
        padding={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.mainInnerView}>
          <View style={styles.backImageTextView}>
            <FastImage
              style={styles.logoImage}
              source={
                // restaurant?.logo
                //   ? {uri: Base_Image_Url?.Base_Image_Url + restaurant?.logo}
                //   : AppImages.orgPlaceholder
                appImages?.mapImg
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text numberOfLines={3} style={styles.addressText}>
              {restaurant?.address}
            </Text>
          </View>

          <View style={styles.innerView}>
            {<DisRating />}

            <View style={styles.assestMainView}>
              {asestsArray?.length > 0 ? (
                <>
                  <Text style={styles.assestPhoto}>Photos</Text>
                  <View style={styles.assetInnerView}>
                    <ScrollView
                      style={styles.assetsScrollView}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      {asestsArray?.length > 0 ? (
                        <View style={styles.scrollViewInnnerView}>
                          {/* {restaurant?.assets?.map((item, i) =>
                          photoList(item, i),
                        )} */}

                          {asestsArray?.map((item, i) => photoList(item, i))}
                        </View>
                      ) : (
                        <>
                          <View style={styles.noDataView}>
                            <Text style={styles.noDataText}>No data Found</Text>
                          </View>
                        </>
                      )}
                    </ScrollView>
                  </View>
                </>
              ) : null}
            </View>

            {asestsArray?.length > 0 && OrgReviewsList()}
          </View>

     {/* <FullImageView
        uri={{}}
        visible={fullImage}
        onRequestClose={() => setFullImage(false)}
        multiImage={asestsArray}
        imageIndex={imageUriIndex}
      /> */}
        </View>
      </AppInputScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  mainInnerView: {
    justifyContent: 'center',
  },
  backImageTextView: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
  },
  logoImage: {
    width: wp('100%'),
    height: hp('12%'),
  },
  addressText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(11),
    width: wp('50%'),
    color: colors.color5A,
    marginStart: wp('3%'),
    position: 'absolute',
    transform: [{translateY: -10}],
  },
  innerView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  ratingTextView: {
    flexDirection: 'row',
    marginTop: '7%',
    alignItems: 'center',
  },
  ratingView: {
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: hp('17%'),
    width: wp('36%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingValue: {
    fontFamily: fonts.medium,
    color: colors.black,
    fontSize: RFValue(40),
  },
  ratingText: {
    fontFamily: fonts.regular,
    color: colors.black,
    fontSize: RFValue(12),
  },
  starRatingImage: {
    borderRadius: 0,
    borderColor: colors.white,
    backgroundColor: colors.white,
    marginTop: '3%',
  },
  progressMainView: {
    flex: 1,
    marginLeft: wp('1%'),
    justifyContent: 'center',
    marginTop: '-4%',
  },
  progressView: {
    marginTop: '8%',
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  progessName: {
    fontFamily: fonts.regular,
    color: colors.black,
    fontSize: RFValue(11),
  },
  progressFillUnfillView: {
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: '4%',
  },
  unFillView: {
    backgroundColor: colors.colorD9,
    borderRadius: 20,
    width: wp('50%'),
    height: hp('1.2%'),
  },
  fillView: {
    backgroundColor: colors.color43,
    borderRadius: 20,
    width: wp('10%'),
    height: hp('1.2%'),
    position: 'absolute',
  },
  assestMainView: {
    marginTop: '6%',
    justifyContent: 'center',
    marginHorizontal: -20,
  },
  assestPhoto: {
    color: colors.black,
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    marginLeft: '6%',
  },
  assetInnerView: {
    flex: 1,
    marginTop: hp('1.5%'),
  },
  assetsScrollView: {
    flex: 1,
  },
  scrollViewInnnerView: {
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  assetsImageTouch: {
    marginRight: hp('1.2%'),
    justifyContent: 'center',
  },
  assetsImage: {
    height: hp('11%'),
    width: wp('26%'),
    borderRadius: 10,
  },
  noDataView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('92%'),
  },
  noDataText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  mainReviewsView: {
    justifyContent: 'center',
  },
  reviewsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '8%',
  },
  reviewsText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
  },
});
