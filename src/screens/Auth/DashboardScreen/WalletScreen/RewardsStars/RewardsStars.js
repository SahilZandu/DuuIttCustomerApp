import React, {useCallback,} from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import Header from '../../../../../components/header/Header';
import {useFocusEffect} from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import {colors} from '../../../../../theme/colors';
import {appImages, appImagesSvg} from '../../../../../commons/AppImages';
import NumberBoxComponent from '../../../../../components/NumberBoxComp';
import Spacer from '../../../../../halpers/Spacer';

const RewardsStars = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  let rewardStarList = [
    {
      id: '1',
      status: 'available',
      availableCount: 4,
      usedCount: 0,
      type: 'order',
      price: 5,
      completedText: '',
    },
    {
      id: '2',
      status: 'not_available',
      availableCount: 4,
      usedCount: 4,
      type: 'ride',
      price: 5,
      completedText: '',
    },
    {
      id: '3',
      status: 'completed',
      availableCount: 4,
      usedCount: 4,
      type: 'order',
      price: 5,
      completedText: 'First',
    },
    {
      id: '4',
      status: 'available',
      availableCount: 4,
      usedCount: 2,
      type: 'parcel',
      price: 5,
      completedText: '',
    },
    {
      id: '5',
      status: 'completed',
      availableCount: 4,
      usedCount: 4,
      type: 'ride',
      price: 5,
      completedText: '',
    },
    {
      id: '6',
      status: 'not_available',
      availableCount: 4,
      usedCount: 4,
      type: 'parcel',
      price: 5,
      completedText: '',
    },
  ];

  const RenderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.renderMainView,
          {
            borderColor:
              item?.status == 'not_available' ? colors.grey : colors.main,
          },
        ]}>
        <View style={styles.renderInnerView}>
          <View style={styles.completeTextView}>
            <Text numberOfLines={2} style={styles.completeText}>
              Complete your{' '}
              {item?.status == 'completed'
                ? item?.completedText?.length > 0
                  ? item?.completedText + ' ' + ' ' + item?.type
                  : item?.type
                : `${item?.availableCount}${' '}${item?.type}${' '}(${
                    item?.usedCount
                  }/${item?.availableCount})`}
            </Text>
            <View
              style={[
                styles.ruppeImageView,
                {
                  borderColor:
                    item?.status == 'not_available' ? colors.grey : colors.main,
                },
              ]}>
              <Image
                style={styles.ruppeImage}
                source={
                  item?.status == 'not_available'
                    ? appImages.ruppeGreyIcon
                    : appImages.ruppeYellowIcon
                }
              />
              <Text
                style={[
                  styles.priceText,
                  {
                    color:
                      item?.status == 'not_available'
                        ? colors.grey
                        : colors.main,
                  },
                ]}>
                {item?.price}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            disabled={item?.status == 'available' ? false : true}
            activeOpacity={0.8}
            style={[
              styles.claimTouch,
              {
                backgroundColor:
                  item?.status == 'completed'
                    ? 'transparent'
                    : item?.status == 'not_available'
                    ? colors.grey
                    : colors.main,
              },
            ]}>
            <Text
              style={[
                styles.claimText,
                {
                  color:
                    item?.status == 'completed' ? colors.main : colors.white,
                },
              ]}>
              {item?.status == 'completed' ? 'Claimed' : 'Claim'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <Header
        backArrow={true}
        title={'Reward Stars'}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <NumberBoxComponent />
      <Spacer space={'2%'}/>
      <View style={styles.upperMainView}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={rewardStarList}
          renderItem={RenderItem}
          keyExtractor={item => item?.id}
          contentContainerStyle={{paddingBottom: '10%'}}
        />
      </View>
    </View>
  );
};

export default RewardsStars;
