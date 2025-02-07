import React, {useEffect, useState, useRef, useCallback} from 'react';
import {FlatList, Text, View, Image} from 'react-native';
import {styles} from './styles';
import Header from '../../../../components/header/Header';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useFocusEffect} from '@react-navigation/native';
import {rootStore} from '../../../../stores/rootStore';
import {appImages, appImagesSvg} from '../../../../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import DotedLine from '../../../DUFood/Components/DotedLine';
import FastImage from 'react-native-fast-image';
import Url from '../../../../api/Url';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../../theme/fonts/fonts';
import {colors} from '../../../../theme/colors';
import Spacer from '../../../../halpers/Spacer';

export default function FavoriteRestaurant({navigation}) {
  const {restaurantLikedByCustomer} = rootStore.foodDashboardStore;
  const [loading, setLoading] = useState(false);
  const [likeRestaurant, setLikeRestaurant] = useState([]);

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

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          marginHorizontal: 25,
          marginTop: '4%',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FastImage
            style={[
              styles.cover,
              {
                width: wp('25%'),
                height: hp('11%'),
                borderRadius: 10,
              },
            ]}
            source={
              item?.restaurant?.logo
                ? {uri: Url?.Image_Url + item?.restaurant?.logo}
                : appImages.foodIMage
            }
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{flex: 1, flexDirection: 'column', marginLeft: '3%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                numberOfLines={2}
                style={{
                  flex: 1,
                  fontSize: RFValue(15),
                  fontFamily: fonts.medium,
                  color: colors.black,
                }}>
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
              style={{
                flexDirection: 'row',
                marginTop: '4%',
                alignItems: 'center',
              }}>
              <SvgXml width={15} height={15} xml={appImagesSvg.yellowStar} />
              <Text
                style={{
                  marginLeft: '2%',
                  fontSize: RFValue(13),
                  fontFamily: fonts.medium,
                  color: colors.black,
                }}>
                {'3.9'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '4%',
                alignItems: 'center',
              }}>
              <SvgXml xml={appImagesSvg.yellowLocation} />
              <Text
                style={{
                  marginLeft: '2%',
                  fontSize: RFValue(13),
                  fontFamily: fonts.medium,
                  color: colors.color83,
                }}>
                {'5 KM'}
              </Text>

              <SvgXml
                style={{marginLeft: '3%'}}
                xml={appImagesSvg.yellowTimer}
              />
              <Text
                style={{
                  marginLeft: '2%',
                  fontSize: RFValue(13),
                  fontFamily: fonts.medium,
                  color: colors.color83,
                }}>
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

      <View style={{flex: 1, justifyContent: 'center'}}>
        {likeRestaurant?.length > 0 ? (
          <FlatList
            data={likeRestaurant}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        ) : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>No Data Found</Text>
          </View>
        )}
      </View>
    </View>
  );
}
