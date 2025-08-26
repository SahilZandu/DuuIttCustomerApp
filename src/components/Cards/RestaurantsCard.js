import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { appImages, appImagesSvg } from '../../commons/AppImages';
import { fonts } from '../../theme/fonts/fonts';
import { SvgXml } from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import { colors } from '../../theme/colors';
import Url from '../../api/Url';

function NumToTime(num) {
  var hours = Math.floor(num / 60);
  var minutes = num % 60;
  if (minutes + ''.length < 2) {
    minutes = '0' + minutes;
  }
  return hours + ':' + minutes;
}

function calculateTime(distance, speed) {
  if (distance) {
    let timeInSeconds = (distance / speed) * 3600;
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds % 3600) / 60);
    let seconds = Math.round(timeInSeconds % 60);

    if (hours == 0 && minutes == 0) {
      return seconds + ' sec';
    } else if (hours == 0) {
      return minutes + ' min';
    } else {
      return hours + ' h' + ' ' + minutes + ' min';
    }
  } else {
    return '0 sec';
  }
}

const RestaurantsCard = ({ item, navigation, isHorizontal, onLike }) => {
  const distnace = item?.distance && item?.distance?.toFixed(1) + ' ' + 'KM';
  console.log('item>>', item);
  const [like, setLike] = useState(
    item?.likedRestaurant == true ? true : false,
  );

  const [isResOpen, setIsResOpen] = useState(
    true,
    // item?.restaurant?.is_online ? true : false
  );

  useEffect(() => {
    setLike(item?.likedRestaurant == true ? true : false);
  }, [item?.likedRestaurant]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        // disabled={!item?.is_online}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('resturantProducts', {
            item: item,
          })
        }
        style={[
          styles.logoImageView,
          {
            opacity: isResOpen ? 1 : 0.5,

            width: isHorizontal ? wp('87%') : wp('92%'),
          },
        ]}>
        <View
          style={{
            width: isHorizontal ? wp('87%') : wp('92%'),
            alignSelf: 'center',
          }}>
          <FastImage
            style={[
              styles.cover,
              {
                width: isHorizontal ? wp('87%') : wp('92%'),
                height: isHorizontal ? hp('20%') : hp('25%'),
              },
            ]}
            source={
              item?.banner?.length > 0
                ? { uri: Url?.Image_Url + item?.banner }
                : appImages.foodIMage
            }
            resizeMode={FastImage.resizeMode.cover}
          />

          <View style={styles.ratingKmView}>
            <View style={styles.ratingMainView}>
              <SvgXml
                fill={isResOpen ? colors.white : colors.black75}
                xml={startIcon}
              />
              <Text
                style={[
                  styles.ratingText,
                  {
                    color: isResOpen ? colors.white : colors.black75,
                  },
                ]}>
                {item?.food_rating_avg ?? 0.0}
              </Text>
            </View>
            <View style={styles.mintMainView}>
              <Text
                style={[
                  styles.mintText,
                  {
                    color: isResOpen ? colors.color27 : colors.black75,
                  },
                ]}>
                {/* 25-30  */}
                {item?.minimum_order_preparation_time > 5 ? item?.minimum_order_preparation_time - 5 : 0} - {item?.minimum_order_preparation_time ?? 0} Min
              </Text>
            </View>
            <View style={styles.kmMainView}>
              <Text
                style={[
                  styles.kmText,
                  {
                    color: isResOpen ? colors.color27 : colors.black75,
                  },
                ]}>
                {(item?.distanceInKm).toFixed(1)} KM
              </Text>
            </View>
          </View>

          {/* <View style={{position: 'absolute', right: 0, top: 0}}>
            <SvgXml xml={likebgbtn} />

            <TouchableOpacity
            activeOpacity={0.8}
              onPress={() => setLike(!like)}
              style={{position: 'absolute', top: 10, right: 10}}>

              </TouchableOpacity>
          </View> */}

          {item?.veg_non_veg == 'veg' && (
            <View style={styles.pureVegView}>
              <View style={styles.pureVegInnerView}>
                <SvgXml
                  fill={isResOpen ? colors.main : colors.black75}
                  xml={pureVeg}
                />
                <Text
                  style={[
                    styles.pureVegText,
                    {
                      color: isResOpen ? colors.main : colors.black75,
                    },
                  ]}>
                  {'  '}Pure Veg
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.restaurantView}>
          <Text
            numberOfLines={isHorizontal ? 1 : 2}
            style={[
              styles.restaurantText,
              {
                color: isResOpen ? colors.black : colors.black75,
                maxWidth: isHorizontal ? wp('60%') : wp('72%'),
              },
            ]}>
            {item?.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onLike(item);
            }}
            activeOpacity={0.5}
            style={styles.likeTouchView}>
            <SvgXml
              xml={
                like == true
                  ? appImagesSvg.likeRedIcon
                  : appImagesSvg.unLikeIcon
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.aboutView}>
          <Text numberOfLines={2} style={styles.aboutText}>
            {item?.about}
          </Text>
        </View>

        {!isResOpen && (
          <Text style={styles.currentlyText}>
            Currently not accepting orders.
          </Text>
        )}
      </TouchableOpacity>

      {item?.offers?.length > 0 &&
        <View
          style={[
            styles.flatOffView,
            {
              zIndex: 1,
              opacity: isResOpen ? 1 : 0.4,
            },
          ]}>
          <View style={styles.flatOffInnerView}>
            <SvgXml xml={isResOpen ? flat : flatOfline} />
            <Text
              style={[
                styles.flatOffText,
                {
                  color: isResOpen ? colors.redBold : colors.black75,
                },
              ]}>
              Flat 125 OFF above 319
            </Text>
          </View>
        </View>
        }
    </View>
  );
};

export default RestaurantsCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    alignSelf: 'center',
  },
  logoImageView: {
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    elevation: 2,
    borderColor: colors.colorD9,
    zIndex: 2,
    shadowColor: colors.colorD9,
    shadowOffset: { width: -1, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cover: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  ratingKmView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    marginTop: '-6%',
    borderRadius: 20,
    marginLeft: wp('4%'),
    height: hp('4.5%'),
    width: wp('56%'),
    elevation: 2,
    shadowOffset: { width: -1, height: 6 },
  },
  ratingMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.main,
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
    height: hp('4.5%'),
    width: wp('16%'),
  },
  ratingText: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    marginLeft: '2%'
  },
  mintMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorF1,
    height: hp('4.5%'),
    width: wp('24%'),
  },
  mintText: {
    color: colors.color27,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
  },
  kmMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderBottomEndRadius: 20,
    borderTopEndRadius: 20,
    height: hp('4.5%'),
    width: wp('16%'),
  },
  kmText: {
    color: colors.color27,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
  },
  pureVegView: {
    marginTop: '7%',
    position: 'absolute',
    top: 0, // Align to top
    right: 0, // Align to right
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('26%'),
    height: hp('3.5%'),
    backgroundColor: colors.white, // White background
    borderTopLeftRadius: 20, // Rounded top-left corner
    borderBottomLeftRadius: 20, // Rounded bottom-left corner
    zIndex: 1, // Ensure the element is above others if needed
  },
  pureVegInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },
  pureVegText: {
    color: colors.main,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
  },
  restaurantView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: wp('4%'),
  },
  restaurantText: {
    fontSize: RFValue(16),
    fontFamily: fonts.semiBold,
    color: colors.black,
    maxWidth: wp('60%'),
    textTransform: 'capitalize',
    marginTop: '4.5%',
  },
  likeTouchView: {
    height: hp('5%'),
    width: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeImage: {
    width: wp('7%'),
    height: hp('3%'),
    marginTop: '3%',
  },
  aboutView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2%',
    paddingHorizontal: wp('4%'),
    marginBottom: wp('3%'),
  },
  aboutText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.color64,
    marginTop: '-2.5%',
    lineHeight: 18,
  },
  currentlyText: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    color: colors.red,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  flatOffView: {
    opacity: 1,
    backgroundColor: colors.colorFE,
    height: hp('5.5%'),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 90,
    width: wp('60%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingTop: '2%',
    zIndex: 1, // Lower zIndex than logoImageView
    elevation: 1, // Android shadow
    marginTop: '-2%',
  },
  flatOffInnerView: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 10,
  },
  flatOffText: {
    color: colors.redBold,
    fontFamily: fonts.medium,
    marginStart: 10,
    fontSize: RFValue(11),
  },
});

const startIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" >
<path d="M7 0L9.26297 3.88528L13.6574 4.83688L10.6616 8.18972L11.1145 12.6631L7 10.85L2.8855 12.6631L3.33843 8.18972L0.342604 4.83688L4.73703 3.88528L7 0Z" />
</svg>`;

const flat = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="6.5" cy="6.5" r="6.5" fill="#ED0826"/>
<path d="M8.14469 3.76746L9.02015 4.64293L4.64281 9.02028L3.76734 8.14476L8.14469 3.76746ZM5.29942 5.2995C4.93677 5.66213 4.34884 5.66213 3.98621 5.2995C3.62358 4.93692 3.62358 4.34896 3.98621 3.98633C4.34884 3.6237 4.93677 3.6237 5.29942 3.98633C5.66206 4.34896 5.66206 4.93692 5.29942 5.2995ZM7.48807 8.80139C7.12543 8.43875 7.12543 7.85084 7.48807 7.4882C7.8507 7.12556 8.43861 7.12556 8.80125 7.4882C9.16389 7.85084 9.16389 8.43875 8.80125 8.80139C8.43861 9.16402 7.8507 9.16402 7.48807 8.80139Z" fill="white"/>
</svg>`;
const flatOfline = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="6.5" cy="6.5" r="6.5" fill="#D3D3D3"/>
<path d="M8.14469 3.76746L9.02015 4.64293L4.64281 9.02028L3.76734 8.14476L8.14469 3.76746ZM5.29942 5.2995C4.93677 5.66213 4.34884 5.66213 3.98621 5.2995C3.62358 4.93692 3.62358 4.34896 3.98621 3.98633C4.34884 3.6237 4.93677 3.6237 5.29942 3.98633C5.66206 4.34896 5.66206 4.93692 5.29942 5.2995ZM7.48807 8.80139C7.12543 8.43875 7.12543 7.85084 7.48807 7.4882C7.8507 7.12556 8.43861 7.12556 8.80125 7.4882C9.16389 7.85084 9.16389 8.43875 8.80125 8.80139C8.43861 9.16402 7.8507 9.16402 7.48807 8.80139Z" fill="white"/>
</svg>`;

const likebgbtn = `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="80" viewBox="0 0 90 80" fill="none">
<path d="M0 0H80C85.5228 0 90 4.47715 90 10V80H0V0Z" fill="url(#paint0_linear_7567_5008)"/>
<defs>
<linearGradient id="paint0_linear_7567_5008" x1="105.581" y1="-19.1816" x2="52.2439" y2="48.6935" gradientUnits="userSpaceOnUse">
<stop offset="0.176707"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>`;

const pureVeg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" >
<path d="M3.0733 5.64216C3.9883 8.15618 4.77893 10.6791 4.68121 13.4374C4.50354 13.3841 4.3614 13.353 4.23259 13.2997C2.72684 12.6512 1.82517 11.4875 1.35879 9.95065C1.10561 9.1156 1.12782 8.2539 1.15002 7.39664C1.17667 6.49497 1.21665 5.5933 1.22553 4.69162C1.23442 3.91876 1.11449 3.17255 0.679199 2.47964C0.892403 2.55959 1.11005 2.63954 1.31881 2.72393C2.7224 3.3058 4.0416 4.0298 5.16092 5.07361C6.14698 5.99305 6.87099 7.06795 7.13305 8.41824C7.35958 9.58642 7.16414 10.6969 6.63557 11.754C6.34686 12.3314 5.9782 12.8555 5.53402 13.3264C5.48072 13.3841 5.41854 13.4596 5.4141 13.5307C5.37856 14.2058 5.35191 14.8854 5.32082 15.6094C5.71613 15.4362 6.08924 15.2852 6.45346 15.1119C7.97254 14.3791 9.40722 13.5129 10.6598 12.3758C11.5259 11.5941 12.2721 10.7013 12.9606 9.76409C13.6491 8.83133 14.2754 7.8497 14.9239 6.89029C14.9727 6.81478 15.0083 6.73038 15.0305 6.63711C12.9917 9.35545 10.8419 11.9539 7.87482 13.7172C7.84373 13.7084 7.81264 13.6995 7.78599 13.695C7.71936 13.282 7.61276 12.8733 7.59055 12.4602C7.50171 10.799 8.03917 9.33769 9.05188 8.03181C9.65152 7.25895 10.4199 6.68596 11.2417 6.17961C12.4187 5.4556 13.6136 4.75381 14.7817 4.01648C15.4391 3.59895 16.0432 3.10592 16.4563 2.42633C16.5718 2.23978 16.665 2.0399 16.7894 1.80005C16.856 2.13318 16.9226 2.43078 16.9804 2.73281C17.2513 4.17638 17.389 5.63327 17.2869 7.10349C17.1669 8.84465 16.7627 10.4925 15.7278 11.9361C14.5552 13.5707 12.9384 14.4501 10.9485 14.6589C10.1046 14.7477 9.26509 14.7122 8.43004 14.5478C8.35009 14.5301 8.24793 14.5789 8.16798 14.6234C7.25742 15.1297 6.34686 15.6361 5.4363 16.1469C5.2764 16.2357 5.15203 16.2091 5.01434 16.098C4.8722 15.9825 4.84999 15.8582 4.88109 15.6894C5.12094 14.3657 5.20089 13.0332 5.08097 11.6918C4.99213 10.6969 4.73451 9.74188 4.39249 8.80912C4.03271 7.81861 3.61075 6.85919 3.21099 5.88645C3.17546 5.80206 3.12216 5.72211 3.0733 5.64216Z" />
</svg>`;
