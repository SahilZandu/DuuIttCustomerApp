import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FlatList, Text, View, Image } from 'react-native';
import { styles } from './styles';
import Header from '../../../../components/header/Header';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { rootStore } from '../../../../stores/rootStore';
import { appImages, appImagesSvg } from '../../../../commons/AppImages';
import { SvgXml } from 'react-native-svg';
import DotedLine from '../../../DUFood/Components/DotedLine';
import FastImage from 'react-native-fast-image';
import Url from '../../../../api/Url';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../../theme/fonts/fonts';
import { colors } from '../../../../theme/colors';
import Spacer from '../../../../halpers/Spacer';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';

export default function FavoriteRestaurant({ navigation }) {
  const { restaurantLikedByCustomer,favoriteRestaurantList } = rootStore.foodDashboardStore;
  const [loading, setLoading] = useState(favoriteRestaurantList?.length > 0 ? false :true);
  const [likeRestaurant, setLikeRestaurant] = useState(favoriteRestaurantList  ?? []);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  useEffect(() => {
    getLikeRest();
  }, []);

  const getLikeRest = async () => {
    const resLikeList = await restaurantLikedByCustomer(handleLoading);
    console.log('resLikeList--', resLikeList);
    setLikeRestaurant(resLikeList);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={styles.mainRenderView}>
        <View style={styles.imageTextMainView}>
          <FastImage
            style={
              styles.restImage
            }
            source={
              item?.restaurant?.logo
                ? { uri: Url?.Image_Url + item?.restaurant?.logo }
                : appImages.foodIMage
            }
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.innerMainView}>
            <View style={styles.restLikeIconView}>
              <Text
                numberOfLines={2}
                style={styles.restName}>
                {item?.restaurant?.name}
              </Text>
              <SvgXml
                xml={
                  item?.restaurant?.likedRestaurant == true
                    ? appImagesSvg.likeRedIcon
                    : appImagesSvg.unLikeIcon
                }
              />
            </View>
            <View
              style={styles.ratingView}>
              <SvgXml width={15} height={15} xml={appImagesSvg.yellowStar} />
              <Text
                style={styles.ratingText}>
                {'3.9'}
              </Text>
            </View>

            <View
              style={styles.kmMinView}>
              <SvgXml xml={appImagesSvg.yellowLocation} />
              <Text
                style={styles.kmText}>
                {'5 KM'}
              </Text>

              <SvgXml
                style={{ marginLeft: '3%' }}
                xml={appImagesSvg.yellowTimer}
              />
              <Text
                style={styles.minText}>
                {'33 min'}
              </Text>
            </View>
          </View>
        </View>

        <DotedLine />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
        title={'Favourites'}
        backArrow={true}
      />
      {(loading == true && likeRestaurant?.length == 0) ?
        <AnimatedLoader type={'favoriteRestaurantLoader'} /> :
        <View style={styles.flatListView}>
          {likeRestaurant?.length > 0 ? (
            <FlatList
              data={likeRestaurant}
              renderItem={renderItem}
              keyExtractor={item => item._id}
            />
          ) : (
            <View style={styles.noDataView}>
              <Text style={styles.noDataText}>No Data Found</Text>
            </View>
          )}
        </View>}
    </View>
  );
}
