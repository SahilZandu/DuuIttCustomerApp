import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {colors} from '../../../theme/colors';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import Header from '../../../components/header/Header';
import OrgReviewCard from '../Components/Cards/OrgReviewCard';
import Ratings from '../../../halpers/Ratings';
import {rootStore} from '../../../stores/rootStore';
import {ActivityIndicator} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';

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

let perPage = 10;
export default function RestaurantDetail({navigation, route}) {
  const day = new Date();
  let today = day.getDay();
  const {restaurantData} = route?.params;
  // console.log('restaurant----', restaurantData);
  const {getRestaurantReview} = rootStore.dashboardStore;
  const [fullImage, setFullImage] = useState(false);
  const [imageUriIndex, setImageUriIndex] = useState(0);
  const [orgReviews, setOrgReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(restaurantData ?? {});
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
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
  useFocusEffect(
    useCallback(()=>{
     handleAndroidBackButton(navigation)
     perPage = 10;
    },[])
  )

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    const reviews = await getRestaurantReview(
      restaurant,
      perPage,
      handleLoading,
    );
    console.log('get org Reviews:', reviews);
    if (reviews?.length > 0) {
      setOrgReviews(reviews);
      setLoadingMore(false);
    } else {
      setOrgReviews([]);
      setLoadingMore(false);
    }
  };

  const handleLoading = v => {
    console.log('v---', v);
    setLoading(v);
  };

  const loadMoredata = () => {
    console.log('load more');
    if (!loadingMore && orgReviews?.length >= perPage) {
      perPage = perPage + 10;
      setLoadingMore(true);
      getReviews();
    }
  };
  console.log('orgReviews--', orgReviews);

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
        </View>
        <View>
          {orgReviews?.map((item, index) => (
            <View key={index}>
              <OrgReviewCard item={item} isDishRating={false} />
            </View>
          ))}
        </View>
      </View>
    );
  };
  const renderFooter = () => {
    return loadingMore ? (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    ) : null;
  };

  const renderHaider = () => {
    return (
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

          {/* <FullImageView
      uri={{}}
      visible={fullImage}
      onRequestClose={() => setFullImage(false)}
      multiImage={asestsArray}
      imageIndex={imageUriIndex}
    />  */}
        </View>
        <View style={styles.reviewsView}>
          <Text style={styles.reviewsText}>Reviews</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{marginHorizontal: 20, justifyContent: 'center'}}>
        <OrgReviewCard item={item} index={index} isDishRating={false} />
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
       {loading ? <AnimatedLoader type={'restaurantReviewsLoader'} />
         :
      <View style={styles.listMainView}>
        {orgReviews?.length > 0 ? (
          <FlatList
            contentContainerStyle={{paddingBottom: '20%'}}
            showsVerticalScrollIndicator={false}
            data={orgReviews}
            renderItem={renderItem}
            keyExtractor={item => item?._id}
            onEndReached={loadMoredata}
            onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% from the bottom
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHaider}
          />
        ) : (
          <View style={styles.NoDataViewReviews}>
            <Text style={styles.NoDataTextReviews}>No Record Found</Text>
          </View>
        )}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  listMainView: {
    flex: 1,
    justifyContent: 'center',
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
    marginHorizontal: 20,
  },
  reviewsText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
  },
  NoDataViewReviews: {
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  NoDataTextReviews: {
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
