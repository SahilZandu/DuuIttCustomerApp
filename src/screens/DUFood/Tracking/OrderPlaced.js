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

export default function OrderPlaced(props) {
  const day = new Date();
  let today = day.getDay();
  const {navigation} = props;
  // const {restaurant, isResOpen, isResOpenSoon} = props.route.params;
  // console.log('restaurant----', restaurant, props.route);

  // const {getResturantReviews} = rootStore.resturantstore;

  const [fullImage, setFullImage] = useState(false);
  const [imageUriIndex, setImageUriIndex] = useState(0);
  const [orgReviews, setOrgReviews] = useState([]);
  const [sliderItems, setSliderItems] = useState(silderArrayOrder);

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

  return (
    <View style={styles.restaurantConatiner}>
      <ScrollView
        style={{flex: 0, margin: 10}}
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
                padding: wp('2%'),
              },
            ]}>
            <Image
              style={{width: 100, height: 100, marginTop: hp('20%')}}
              source={appImages.orderPlaced}
            />
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: RFValue(18),
                marginTop: 20,
                color: colors.black,
              }}>
              Order Placed
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: RFValue(12),
                marginTop: 20,
                color: colors.black,
              }}>
              Your order has been successfully placed and your items are on the
              way to you
            </Text>
            <TouchableOpacity
             onPress={() => {
              navigation.navigate('trackOrderPreparing')
            }
          }
            
              style={{
                borderRadius: 20,
                backgroundColor: '#28B056',
                width: '100%',
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: RFValue(12),
                  color: colors.white,
                }}>
                TRACK YOUR ORDER
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: RFValue(12),
                marginTop: 20,
                color: colors.black,
                textDecorationLine: 'underline',
              }}>
              Back to home
            </Text>
          </View>
          <View
            style={{
              marginTop: hp('10%'),
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
