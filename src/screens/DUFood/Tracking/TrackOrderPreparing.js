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
import FoodSlider from '../../../components/slider/foodSlider';
import {homeRideCS, silderArrayOrder} from '../../../stores/DummyData/Home';

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

export default function TrackOrderPreparing(navigation) {
  const day = new Date();
  let today = day.getDay();
  // const {navigation} = props;
  // const {restaurant, isResOpen, isResOpenSoon} = props.route.params;
  // console.log('restaurant----', restaurant, props.route);

  // const {getResturantReviews} = rootStore.resturantstore;

  const [fullImage, setFullImage] = useState(false);
  const [imageUriIndex, setImageUriIndex] = useState(0);
  const [orgReviews, setOrgReviews] = useState([]);
  const [sliderItems, setSliderItems] = useState(silderArrayOrder);
  const [orderStep, setOrderStep] = useState(0);

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
    setTimeout(() => {
      console.log('setOrderStep cooking 30 second.');
      setOrderStep(1);

      setTimeout(() => {
        console.log('setOrderStep prepared 30 second.');
        setOrderStep(2);
      }, 30000);
    }, 30000);

    const getReviews = async () => {
      //   const reviews = await getResturantReviews(restaurant?.id);
      //   console.log('get org Reviews:', reviews);
      //   setOrgReviews(reviews && reviews.length > 0 ? reviews : []);
      //
    };

    getReviews();
  }, []);

  return (
    <View style={styles.restaurantConatiner}>
      <ScrollView
        style={{flex: 0}}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: '10%'}}>
        <View>
          <View
            style={[
              styles.restaurantConatiner,
              {
                justifyContent: 'center',
                alignItems: 'center',
                // padding: wp('2%'),
              },
            ]}>
            <FastImage
              style={[
                {
                  // width: isHorizontal ? wp('79%') : wp('89%'),
                  width: wp('100%'),
                  height: hp('40%'),
                  // opacity: isResOpen ? 1 : 0.6,
                },
              ]}
              source={
                orderStep === 1
                  ? appImages.cookingFood
                  : orderStep === 2
                  ? appImages.preparedFood
                  : appImages.preparingFood
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <View
              style={{
                width: wp('100%'),

                backgroundColor: '#D6FFE4',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                marginTop: hp('-3%'),
                flexDirection: 'row',
              }}>
              <View style={{padding: wp('6%'), width: wp('64%')}}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    color: colors.black,
                    fontSize: RFValue(14),
                  }}>
                  {orderStep === 1
                    ? 'Chef is cooking the food'
                    : orderStep === 2
                    ? 'Chef prepared the food'
                    : 'Chef is preparing the food'}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: fonts.regular,
                    color: '#515151',
                    fontSize: RFValue(11),
                  }}>
                  {orderStep === 1
                    ? 'Making the best quality food for you'
                    : orderStep === 2
                    ? 'Waiting for the delivery partner for pickup'
                    : 'Making the best quality food for you'}
                </Text>
              </View>
              <View
                style={{
                  marginTop: hp('-4%'),
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#28B056',
                    alignSelf: 'flex-start',
                    borderRadius: 10,
                    elevation: 2,
                    padding: wp('6%'),

                    shadowOffset: {width: -1, height: 6},
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      color: colors.white,
                      fontSize: RFValue(16),
                    }}>
                    Arival in
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      color: colors.white,
                      fontSize: RFValue(11),
                    }}>
                    25 - 30 min
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    color: '#28B056',
                    backgroundColor: colors.white,
                    borderRadius: 16,
                    padding: 5,
                    elevation: 2,
                    overflow: 'hidden',
                    fontSize: RFValue(12),
                    marginTop: hp('-2%'),
                    marginLeft: 20,
                    marginEnd: 20,
                  }}>
                  On time
                </Text>
              </View>
            </View>
          </View>

          {orderStep !== 2 && (
            <View
              style={{
                backgroundColor: 'white',

                flexDirection: 'row',
                alignItems: 'center',

                margin: 20,
                borderRadius: 10,
                elevation: 4,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 8,
                paddingHorizontal: wp('6%'),

                shadowOffset: {width: 0, height: 6},
              }}>
              <SvgXml xml={appImagesSvg.bikeSvg} />
              <View
                style={{paddingStart: 10, paddingEnd: 10, width: wp('50%')}}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    color: colors.black,
                    fontSize: RFValue(12),
                  }}>
                  You’ll get a driver when food’s almost ready
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    color: '#5E5D5D',
                    fontSize: RFValue(11),
                  }}>
                  Deliver the food to you on time
                </Text>
              </View>
              <Image
                resizeMode="cover"
                style={{width: 60, height: 80, marginTop: 10, marginBottom: 10}}
                source={appImages.trackBikeMap}
              />
            </View>
          )}
          {orderStep === 2 && 
            <View
              style={{
                backgroundColor: 'white',

                flexDirection: 'row',
                alignItems: 'center',

                margin: 20,
                padding:10,
                borderRadius: 10,
                elevation: 4,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 8,
                paddingHorizontal: wp('6%'),

                shadowOffset: {width: 0, height: 6},
              }}>
              <Image
                source={appImages.avtarImage}
                style={{borderRadius: 30, width: 60, height: 60}}
              />
              <View
                style={{paddingStart: 10, paddingEnd: 10, width: wp('40%')}}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    color: colors.black,
                    fontSize: RFValue(12),
                  }}>
                  Felicia Cudmore
                </Text>
                <View
                  style={{
                    marginTop:4,
                    alignItems:'center',
                    justifyContent:'space-between',
                    borderRadius:20,
                    width:wp('13%'),
                    flexDirection: 'row',
                    backgroundColor: '#FAA61A',
                    paddingStart:6,paddingEnd:6,
                    paddingTop:4,
                    paddingBottom:4
                  }}>
                  <SvgXml xml={appImagesSvg.whiteStar} />
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      color: colors.white,
                      fontSize: RFValue(12),
                    }}>
                    4.5
                  </Text>
                </View>
              </View>
              <View
              style={{flex:1,justifyContent:'space-between',
              
              flexDirection:'row'}}>
                
              {/* <SvgXml xml={appImagesSvg.chat}/> */}
              <Image 
              style={{width:34,height:34}}
              source={appImages.chat}
              />
              <SvgXml xml={appImagesSvg.phone}/>
              </View>
            </View>
          }
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                alignContent: 'center',
              }}>
              <FoodSlider
                data={sliderItems}
                oneCard={true}
                imageWidth={wp('90%')}
                imageHeight={hp('18%')}
              />
            </View>
          </View>
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
