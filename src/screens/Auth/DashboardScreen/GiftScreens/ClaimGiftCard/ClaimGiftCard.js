import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import GiftCardHappiness from '../../../../../components/GiftCardHappiness';
import DotTextComp from '../../../../../components/DotTextComp';
import Spacer from '../../../../../halpers/Spacer';
import BTN from '../../../../../components/cta/BTN';
import { colors } from '../../../../../theme/colors';
import { fonts } from '../../../../../theme/fonts/fonts';


const ClaimGiftCard = ({navigation, route}) => {
  const {item} = route.params;
  const [clainGift, setClaimGift] = useState(item);

  useEffect(() => {
    setClaimGift(item);
  }, [item]);

  let claimDetails = [
    {
      id: 1,
      title: 'Gift card amount',
      amount: 2000,
    },
    {
      id: 2,
      title: 'This amount is directly enter in your wallet',
      amount: 0,
    },
  ];

  return (
    <View style={styles.main}>
      <Header
        backArrow={true}
        title={'Claim Gift Card'}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.upperMainView}>
          <GiftCardHappiness item={clainGift} />
        </View>
        <View style={styles.detailsView}>
          <Text
            style={styles.detailsText}>
            Details
          </Text>
          {claimDetails?.map((item, i) => {
            return (
              <View style={{marginHorizontal: -10}}>
                <DotTextComp
                  title={item?.title}
                  index={i}
                  data={claimDetails}
                  amount={item?.amount}
                />
              </View>
            );
          })}
        </View>
      </AppInputScroll>
      <View
        style={styles.botomBtnView}>
        <Spacer space={'5%'} />
        <BTN title={'Back to Gift Cards'} width={wp('90%')} />
      </View>
    </View>
  );
};

export default ClaimGiftCard;
