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

// import Spacer from '../../Components/Spacer';
// import {MenuItems} from './MenuItems';
// import {PopularDishes} from './PopularDishes';
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
import {ProgressBar} from 'react-native-paper';
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
];

export default function RestaurantDetail(props) {
  const day = new Date();
  let today = day.getDay();
  const {navigation} = props;
  const {restaurant, isResOpen, isResOpenSoon} = props.route.params;
  console.log('restaurant----', restaurant, props.route);

  // const {getResturantReviews} = rootStore.resturantstore;

  const [fullImage, setFullImage] = useState(false);
  const [imageUriIndex, setImageUriIndex] = useState(0);
  const [orgReviews, setOrgReviews] = useState([]);

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
    console.log('item', item);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setFullImage(true), setImageUriIndex(i);
        }}
        style={{marginRight: hp('1.2%')}}
        key={i}>
        <Image
          resizeMode="cover"
          style={{height: hp('18%'), width: wp('50%'), borderRadius: 10}}
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
  const ProgressView = () => {
    return (
      <View
        style={{
          margin: 10,
        }}>
        <Text
          style={{
            fontFamily: fonts.regular,
            color: colors.black,
            fontSize: RFValue(14),
          }}>
          Taste
        </Text>
        <View
          style={{
            width: '90%',
            height: 10,

            borderRadius: 20,
          }}>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: 20,
              width: '100%',
              height: 10,
            }}
          />
          <View
            style={{
              backgroundColor: '#43BA6B',
              borderRadius: 20,
              width: '70%',
              height: 10,
              position: 'absolute',
              top: 0,
            }}
          />
        </View>
      </View>
    );
  };
  const DisRating = dishes => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 5,
            padding: 20,

            width: wp('40%'),
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              color: colors.black,
              fontSize: RFValue(40),
            }}>
            4.5
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              color: colors.black,
              fontSize: RFValue(12),
            }}>
            Very Good
          </Text>
          <View style={{flexDirection: 'row'}}>
            {asestsArray.map((item, index) => (
              <View key={index}>
                <SvgXml xml={appImagesSvg.startM} />
              </View>
            ))}
          </View>
        </View>
        <View
          style={{
            width: wp('55%'),
            marginStart:wp('2%')
          }}>
          <ProgressView />
          <ProgressView />
          <ProgressView />
        </View>
      </View>
    );
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

  const OrgReviewsList = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '8%',
          }}>
          <Text
            style={{
              color: '#000000',
              fontFamily: fonts.bold,
              fontSize: RFValue(16),
            }}>
            Reviews
          </Text>
          {asestsArray?.length > 2 && (
            <Pressable
              onPress={() =>
                navigation.navigate('orgAllReviews', {
                  reviews: orgReviews,
                  restaurant,
                })
              }>
              {/* <Text
                style={{
                  color: '#E95D5D',
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                }}>
                See all({`${orgReviews.length}`})
              </Text> */}
            </Pressable>
          )}
        </View>
        <View>
          {/* {orgReviews
            .filter((_, index) => index < 2)
            .map((item, index) => (
              <View key={index}>
                <OrgReviewCard item={item} isDishRating={false} />
              </View>
            ))} */}
          {asestsArray.map((item, index) => (
            <View key={index}>
              <OrgReviewCard item={item} isDishRating={false} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.restaurantConatiner}>
       <Header 
       bgColor={'white'}
      title={'Surya Fastfood'}
      shareSVG={appImagesSvg.share}
      backArrow={true}
      shareIcon={true}
      onPress={() => {
        navigation.goBack();
      }}/>
     
    
    <ScrollView
          style={{flex: 0}}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '10%'}}>
    <View >
      
      <View
    style={{justifyContent:'center',
    alignItems:'flex-start',
    position: 'relative',}} >
        
        <FastImage
          style={styles.logoImage}
          source={
            // restaurant?.logo
            //   ? {uri: Base_Image_Url?.Base_Image_Url + restaurant?.logo}
            //   : AppImages.orgPlaceholder
            appImages.mapImg
          }
          resizeMode={FastImage.resizeMode.stretch}
        />
     <Text
     numberOfLines={2}
        style={{
          fontFamily:fonts.regular,
          fontSize:RFValue(10),
          width:wp('50%'),
          color:'black',
          marginStart:wp('3%'),
        position:'absolute',
        left: 0, 
        transform: [{ translateY: -10 }],
        }}>
        Phase 5, Sector 59, Sahibzada Ajit Singh Nagar, Punjab 160059
        </Text>

        
      </View>

      <View style={styles.upperSpaceView}>
        {/* <Spacer space={hp('2%')} /> */}
        
          <View style={{
            paddingBottom: '10%',marginHorizontal: 20}}>
            <View style={styles.nameRatingView}>
              <Text numberOfLines={1} style={styles.restaurantName}>
                {restaurant?.name}
              </Text>
             
            </View>
            <DisRating />
            {/* <CardView /> */}
            {/* <View style={{flexDirection: 'row'}}>
              {restaurant?.product
                ?.slice(0, 3)
                .map((item, i) => getProductList(item, i))}
            </View> */}

            <Text style={styles.restaurantAddress}>{restaurant?.address}</Text>

         

            {/* "Asseta image" */}
            {asestsArray?.length > 0 ? (
              <>
                {/* <Spacer space={hp('3%')} /> */}
                <Text style={styles.assestPhoto}>Photos</Text>
                <View style={{flex: 1, marginTop: hp('1.5%')}}>
                  <ScrollView
                    style={{flex: 1}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {asestsArray?.length > 0 ? (
                      <>
                        {/* {restaurant?.assets?.map((item, i) =>
                          photoList(item, i),
                        )} */}

                        {asestsArray?.map((item, i) => photoList(item, i))}
                      </>
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
            {/* reviews data */}

            {asestsArray?.length > 0 && OrgReviewsList()}

            
          </View>
        
      </View>
      {/* <FullImageView
        uri={{}}
        visible={fullImage}
        onRequestClose={() => setFullImage(false)}
        multiImage={asestsArray}
        imageIndex={imageUriIndex}
      /> */}
    </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 20,
    margin: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBody: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'right',
  },

  restaurantConatiner: {
    flex: 1,
    backgroundColor: 'white',
  },
  assestPhoto: {
    color: colors.black,
    fontSize: RFValue(16),
    fontFamily: fonts.bold,
    marginLeft: '0.5%',
  },
  logoImage: {
    width: wp('100%'),
    height: hp('14%'),
  },
  gradientView: {
    position: 'absolute',
    height: '25%',
    width: '100%',
  },
  headerView: {
    position: 'absolute',
    marginHorizontal: 20,
  },
  upperSpaceView: {
    flex: 1,
    // borderRadius: 20,
    marginTop: '-5%',
    backgroundColor: 'white',
  },
  nameRatingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '1%',
    alignItems: 'center',
  },
  restaurantName: {
    flex: 1,
    fontSize: RFValue(24),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  ratingView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: wp('15%'),
  },
  restaurantAddress: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
    marginTop: '2%',
  },
  openTickView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2%',
  },
  openNowText: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginLeft: '1%',
  },
  openTiming: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  closeTimingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2%',
  },
  closeNowText: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    marginLeft: '1%',
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
  reviewView: {
    flexDirection: 'row',
    marginTop: '10%',
    alignItems: 'center',
    marginBottom: '2%',
  },
  reviewsText: {
    flex: 1,
    fontSize: RFValue(16),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  leaveReviewText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: '#E95D5D',
  },
  reviewsBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1B951C20',
  },
  boxInnerText: {
    paddingHorizontal: 10,
    marginTop: '2%',
    marginBottom: '2%',
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
  },
  reviewerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '3%',
    marginBottom: '3%',
    marginHorizontal: 10,
  },
  reviewerTextDate: {
    flexDirection: 'column',
    marginLeft: '3%',
    flex: 1,
  },
  reviewerText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  reviewerDate: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: '#8F8F8F',
  },
  reviwerRatingView: {
    backgroundColor: 'green',
    flexDirection: 'row',
    width: wp('14%'),
    height: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  reviewerRating: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  aboutRestaurantText: {
    fontSize: RFValue(16),
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: '2%',
  },
  aboutRestaurantBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F9BD00',
  },
  menuView: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: '4%',
  },
  renderMenuViewText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('76%'),
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: '3%',
    marginTop: '0.3%',
  },
  renderMenuText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: '#333333',
    marginRight: '1%',
  },
  facilitiesView: {
    marginHorizontal: 15,
    marginTop: '4%',
    marginBottom: '2%',
  },
  facilitiesText: {
    fontSize: RFValue(16),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  renderFacilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('82%'),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  renderFacilitiesText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: '#333333',
    marginTop: '3%',
  },
  orderNowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('5.5%'),
    borderRadius: 10,
    backgroundColor: 'rgba(27, 149, 28, 0.1)',
    borderWidth: 1,
    marginTop: '3%',
    borderColor: '#1B951C',
  },
  orderNowText: {
    marginLeft: '6%',
    width: wp('72%'),
    fontSize: RFValue(14),
    fontFamily: fonts.bold,
    color: '#1B951C',
  },
  restaurantProductText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
    marginLeft: '1%',
    color: colors.black,
  },
});
