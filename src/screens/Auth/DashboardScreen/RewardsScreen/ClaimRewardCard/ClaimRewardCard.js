import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import GiftCardHappiness from '../../../../../components/GiftCardHappiness';
import DotTextComp from '../../../../../components/DotTextComp';
import Spacer from '../../../../../halpers/Spacer';
import BTN from '../../../../../components/cta/BTN';
import {useFocusEffect} from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import DotTextExpireComp from '../../../../../components/DotTextExpireComp';

const ClaimRewardCard = ({navigation, route}) => {
  const {item} = route.params;
  const [clainReward, setClainReward] = useState(item);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  useEffect(() => {
    setClainReward(item);
  }, [item]);

  return (
    <View style={styles.main}>
      <Header
        backArrow={true}
        title={'Claim Reward Card'}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View style={{flex:1,justifyContent:'center'}}>
          <Image
            resizeMode='cover'
            style={{width:wp('100%'), height:hp('40%')}}
            source={clainReward?.image}
          />
        </View>
        <View style={styles.upperMainView}>
          {/* <GiftCardHappiness item={clainGift} /> */}
        </View>
        <View style={styles.detailsView}>
          <Text style={styles.detailsText}>Details</Text>
          {item?.data?.map((item, i) => {
            return (
              <View style={{marginHorizontal: -10}}>
                {(item?.wallet ?? 0) > 0 ||
                (item?.coupanCount ?? 0) > 0 ||
                (item?.expireDate ?? 0) > 0 ? (
                  <DotTextExpireComp
                    item={item}
                    index={i}
                    data={clainReward?.data}
                  />
                ) : (
                  <DotTextComp
                    title={item?.title}
                    index={i}
                    data={clainReward?.data}
                    amount={item?.amount}
                  />
                )}
              </View>
            );
          })}
        </View>
      </AppInputScroll>
      <View style={styles.botomBtnView}>
        <Spacer space={'5%'} />
        <BTN
          title={'Back to Reward Cards'}
          width={wp('90%')}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

export default ClaimRewardCard;
