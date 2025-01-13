import React, {useState} from 'react';
import {Text, View, Pressable, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../../theme/fonts/fonts';
import {fontsDmSan} from '../../../../theme/fonts/fontsDmSan';
import {appImages, appImagesSvg} from '../../../../commons/AppImages';

// import Base_Image_Url from '../../api/Url';
import {SvgXml} from 'react-native-svg';
// import Spacer from '../Spacer';
// import FastImage from 'react-native-fast-image';
import {Rating} from 'react-native-rating-element';
import { colors } from '../../../../theme/colors';

const OrgReviewCard = ({item, isDishRating}) => {
  // const imageUrl = Base_Image_Url?.Base_Image_UrlProfile;

  const getIcon = vegNonVeg => {
    switch (vegNonVeg) {
      case 'veg':
        return appImagesSvg.vegSvg;
      case 'simple':
        return appImagesSvg.vegSvg;
      case 'non-veg':
        return appImagesSvg.nonVegIcon;
      case 'egg':
        return appImagesSvg.nonVegIcon;
      default:
        return appImagesSvg.vegSvg;
    }
  };



  const share = rating => {
    return (
      <View
        style={{
          // backgroundColor: '#1B951C',
          // borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 'auto',
          paddingHorizontal: '3%',
          paddingVertical: '1%',
          justifyContent: 'space-between',
        }}>
        <SvgXml xml={appImagesSvg.share} />
        <SvgXml
        style={{marginStart:10}} xml={appImagesSvg.thumsUp} />
      </View>
    );
  };

  const rateWithDishes = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // borderBottomWidth: 1,
            
            borderColor: 'black',
            paddingBottom: '3%',
          }}>
          <Image
            resizeMode="cover"
            style={{height: 40, width: 40, borderRadius: 20}}
            source={
              // item?.user?.profile_picture
              //   ? {uri: imageUrl + item?.user?.profile_picture}
              //   : appImages.foodIMage
              appImages.foodIMage
            }
          />
          <View style={{marginLeft: '3%'}}>
            <Text
              numberOfLines={1}
              style={{
                color: '#000000',
                fontFamily: fontsDmSan.extraBold,
                fontSize: RFValue(12),
                maxWidth: wp('55%'),
              }}>
              {/* {item?.user?.name} */}
              Preeti Thakur
            </Text>
            <Text
              style={{
                color: '#8F8F8F',
                fontFamily: fonts.regular,
                fontSize: RFValue(10),
              }}>
              {/* {item?.created_at ? item?.created_at.split(',')[0] : ''} */}5
              monts ago
            </Text>
          </View>
          {share(item?.rating)}
        </View>

        {/* {isDishRating &&
          item?.orderitemreview_with_product &&
          item?.orderitemreview_with_product.length > 0 &&
          disRating(item?.orderitemreview_with_product)} */}
      </View>
    );
  };
  const asestsArray = [{item: ''}, {item: ''}, {item: ''}, {item: ''}];
  const rating = () => {
    return (
      <View style={{marginBottom:6,flexDirection: 'row'}}>
        {asestsArray.map((item, index) => (
          <View key={index}>
            <SvgXml xml={appImagesSvg.startM} />
          </View>
        ))}
      </View>
    );
  };

  const ratingImages = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        {asestsArray.map((item, index) => (
          <View key={index}>
            <Image
              style={{height: 40, width: 45, margin: 4, borderRadius: 6}}
              resizeMode="cover"
              source={appImages.foodIMage}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor:colors.appBackground,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
        marginTop: '5%',
        padding: 16,
      }}>
      {rateWithDishes()}
      {rating()}

      <Text
        style={{
          marginBottom:6,
          color: '#333333',
          fontFamily: fontsDmSan.regular,
          fontSize: RFValue(10),
        }}>
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
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: '2%',
  },
  cover: {
    borderRadius: 10,
  },
});

const star = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
<path d="M7 0L9.26297 3.88528L13.6574 4.83688L10.6616 8.18972L11.1145 12.6631L7 10.85L2.8855 12.6631L3.33843 8.18972L0.342604 4.83688L4.73703 3.88528L7 0Z" fill="white"/>
</svg>`;
