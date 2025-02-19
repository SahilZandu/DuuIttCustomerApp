import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {colors} from '../../../theme/colors';
import FoodSlider from '../../../components/slider/foodSlider';
import {silderArrayOrder} from '../../../stores/DummyData/Home';
import FastImage from 'react-native-fast-image';
import {SvgXml} from 'react-native-svg';
import AppInputScroll from '../../../halpers/AppInputScroll';
import MapRoute from '../../../components/MapRoute';
import ReviewsRatingComp from '../../../components/ReviewsRatingComp';

export default function TrackOrderPreparing({navigation,route}) {
  const {item}=route.params
  const [sliderItems, setSliderItems] = useState(silderArrayOrder);
  const [orderStep, setOrderStep] = useState(0);
  const [origin, setOrigin] = useState({});
  const [isReviewRider, setIsReviewRider] = useState(false);
  const [isReviewStar, setIsReviewStar] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      console.log('setOrderStep cooking 30 second.');
      setOrderStep(1);
      setTimeout(() => {
        console.log('setOrderStep prepared 30 second.');
        setTimeout(()=>{
          setIsReviewRider(true)
        },5000)
        setOrderStep(2);
      }, 10000);
    }, 10000);
  }, []);

  // useEffect(() => {
  //   if (!isReviewRider) {
  //     setTimeout(() => {
  //       setIsReviewStar(true);
  //       alert("yes")
  //     },500);
  //   }
  // }, [isReviewRider]); 

  return (
    <View style={styles.container}>
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View>
          <View style={styles.restaurantConatiner}>
            {orderStep == 2 ? (
              <MapRoute
                origin={origin}
                destination={{}}
                mapContainerView={{height: hp('45%')}}
              />
            ) : (
              <FastImage
                style={styles.topImage}
                source={
                  orderStep === 1
                    ? appImages.cookingFood
                    : // : orderStep === 2
                      // ? appImages.preparedFood
                      appImages.preparingFood
                }
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
            <View style={styles.upperLightGreenView}>
              <View style={styles.chefTextView}>
                <Text style={styles.chefText}>
                  {orderStep === 1
                    ? 'Chef is cooking the food'
                    : orderStep === 2
                    ? 'Chef prepared the food'
                    : 'Chef is preparing the food'}
                </Text>
                <Text numberOfLines={2} style={styles.waitingForText}>
                  {orderStep === 1
                    ? 'Making the best quality food for you'
                    : orderStep === 2
                    ? 'Waiting for the delivery partner for pickup'
                    : 'Making the best quality food for you'}
                </Text>
              </View>
              <View style={styles.arivalInMainView}>
                <View style={styles.arivalInView}>
                  <Text style={styles.arriveInText}>Arival in</Text>
                  <Text style={styles.mintText}>25 - 30 min</Text>
                </View>
                <Text style={styles.onTimeView}>On time</Text>
              </View>
            </View>
          </View>

          {orderStep === 2 ? (
            <View style={styles.riderMainView}>
              <Image
                resizeMode="cover"
                source={appImages.avtarImage}
                style={styles.riderImage}
              />
              <View style={styles.nameRateView}>
                <Text style={styles.riderName}>Felicia Cudmore</Text>
                <View style={styles.ratingView}>
                  <SvgXml xml={appImagesSvg.whiteStar} />
                  <Text style={styles.ratingText}>4.5</Text>
                </View>
              </View>
              <View style={styles.phoneMsgImage}>
                <TouchableOpacity activeOpacity={0.8}>
                  <Image
                    resizeMode="contain"
                    style={{width: 34, height: 34}}
                    source={appImages.chat}
                  />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                  <SvgXml xml={appImagesSvg.phone} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.getDriverView}>
              <SvgXml xml={appImagesSvg.bikeSvg} />
              <View style={styles.getDriverInnerView}>
                <Text style={styles.getDriverText}>
                  You’ll get a driver when food’s almost ready
                </Text>
                <Text style={styles.youOnTimeText}>
                  Deliver the food to you on time
                </Text>
              </View>
              <Image
                resizeMode="cover"
                style={styles.trackedBikeImage}
                source={appImages.trackBikeMap}
              />
            </View>
          )}

          <View style={styles.sliderMainView}>
            <View style={styles.sliderInnerView}>
              <FoodSlider
                data={sliderItems}
                oneCard={true}
                imageWidth={wp('90%')}
                imageHeight={hp('18%')}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.8}
            style={styles.backBtnView}>
            <SvgXml
              xml={
                orderStep === 2
                  ? appImagesSvg.backArrow
                  : appImagesSvg.whitebackArrow
              }
            />
          </TouchableOpacity>
        </View>
      </AppInputScroll>
      <ReviewsRatingComp
       data={item}
      type={'RIDE'}
      title={'How was your delivery experience?'}
      isVisible={isReviewRider}
      onClose={()=>{
        setIsReviewRider(false),
        setTimeout(() => {
          setIsReviewStar(true);
          // alert("yes")
        },500);
      }}
      loading={loadingRating}
      onHandleLoading={(v)=>{
        setLoadingRating(v)
      }}
      />
      <ReviewsRatingComp
       data={item}
       type={'FOOD'}
      title={'Did you enjoy your meal?'}
      isVisible={isReviewStar}
      onClose={()=>{setIsReviewStar(false)}}
      loading={loadingRating}
      onHandleLoading={(v)=>{setLoadingRating(v)}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  restaurantConatiner: {
    flex: 1,
    backgroundColor: colors.appBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: wp('100%'),
    height: hp('40%'),
  },
  upperLightGreenView: {
    width: wp('100%'),
    backgroundColor: colors.colorD6,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: hp('-3%'),
    flexDirection: 'row',
  },
  chefTextView: {
    padding: wp('6%'),
    width: wp('64%'),
  },
  chefText: {
    fontFamily: fonts.bold,
    color: colors.black,
    fontSize: RFValue(14),
  },
  waitingForText: {
    fontFamily: fonts.regular,
    color: colors.color51,
    fontSize: RFValue(11),
  },
  arivalInMainView: {
    marginTop: hp('-3%'),
    alignItems: 'center',
    alignContent: 'center',
  },
  arivalInView: {
    alignItems: 'center',
    backgroundColor: colors.main,
    alignSelf: 'flex-start',
    borderRadius: 10,
    elevation: 2,
    padding: wp('5%'),
    shadowOffset: {width: -1, height: 6},
  },
  arriveInText: {
    fontFamily: fonts.bold,
    color: colors.white,
    fontSize: RFValue(16),
  },
  mintText: {
    fontFamily: fonts.bold,
    color: colors.white,
    fontSize: RFValue(11),
  },
  onTimeView: {
    fontFamily: fonts.bold,
    color: colors.main,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 5,
    paddingHorizontal: '2%',
    elevation: 2,
    overflow: 'hidden',
    fontSize: RFValue(12),
    marginTop: hp('-2%'),
    marginLeft: 20,
    marginEnd: 20,
  },
  riderMainView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingHorizontal: wp('6%'),
    shadowOffset: {width: 0, height: 6},
  },
  riderImage: {
    borderRadius: 100,
    width: 60,
    height: 60,
  },
  nameRateView: {
    paddingStart: 10,
    paddingEnd: 10,
    width: wp('40%'),
  },
  riderName: {
    fontFamily: fonts.bold,
    color: colors.black,
    fontSize: RFValue(12),
  },
  ratingView: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    width: wp('13%'),
    flexDirection: 'row',
    backgroundColor: colors.colorFA,
    paddingStart: 6,
    paddingEnd: 6,
    paddingTop: 4,
    paddingBottom: 4,
  },
  ratingText: {
    fontFamily: fonts.medium,
    color: colors.white,
    fontSize: RFValue(12),
  },
  phoneMsgImage: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  getDriverView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingHorizontal: wp('6%'),
    shadowOffset: {width: 0, height: 6},
  },
  getDriverInnerView: {
    paddingStart: 10,
    paddingEnd: 10,
    width: wp('50%'),
  },
  getDriverText: {
    fontFamily: fonts.bold,
    color: colors.black,
    fontSize: RFValue(12),
  },
  youOnTimeText: {
    fontFamily: fonts.medium,
    color: colors.color5E,
    fontSize: RFValue(11),
  },
  trackedBikeImage: {
    width: 60,
    height: 80,
    marginTop: 10,
    marginBottom: 10,
  },
  sliderMainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderInnerView: {
    alignContent: 'center',
  },
  backBtnView: {
    position: 'absolute',
    backgroundColor: colors.color3D10,
    top: '1%',
    left: '3%',
    padding: '1%',
    borderRadius: 10,
  },
});
