import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import {Surface} from 'react-native-paper';
import {appImages, appImagesSvg} from '../../../../commons/AppImages';
import Header from '../../../../components/header/Header';
import {colors} from '../../../../theme/colors';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../../theme/fonts/fonts';
import TextRender from '../../../../components/TextRender';
import {currencyFormat} from '../../../../halpers/currencyFormat';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import {SvgXml} from 'react-native-svg';
import BTN from '../../../../components/cta/BTN';
import GiftCardHappiness from '../../../../components/GiftCardHappiness';
import DotTextComp from '../../../../components/DotTextComp';
import Spacer from '../../../../halpers/Spacer';

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
        <View style={{marginTop: hp('4%'), marginHorizontal: 20}}>
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: fonts.medium,
              color: colors.black,
            }}>
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
