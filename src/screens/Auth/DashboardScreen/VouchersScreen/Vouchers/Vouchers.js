import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import { vouchersCardsArray } from '../../../../../stores/DummyData/Offers';
import VouchersGiftCard from '../../../../../components/VouchersGiftCard';
import { Surface } from 'react-native-paper';
import Spacer from '../../../../../halpers/Spacer';
import BTN from '../../../../../components/cta/BTN';
import { currencyFormat } from '../../../../../halpers/currencyFormat';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';

const Vouchers = ({ navigation }) => {
  const [vouchersGiftArray, setVouchersGiftArray] =
    useState(vouchersCardsArray);
  const [payToUnlock, setPayToUnlock] = useState(false);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );


  const onViewDetails = item => {
    navigation.navigate('vouchersDetails', { item: item });
  };

  const onBuyDetails = () => {
    navigation.navigate('paymentMethod');
  };

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      backArrow={true}
      title={'Vouchers'}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.main}>
        {/* <Header
        backArrow={true}
        title={'Vouchers'}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        <AppInputScroll Pb={'20%'} padding={true} keyboardShouldPersistTaps={'handled'}>
          <View style={styles.upperMainView}>
            {payToUnlock == false ? (
              <Surface elevation={3} style={styles.surfaceView}>
                <View style={styles.innerView}>
                  <Text style={styles.priceText}>{currencyFormat(40)}</Text>
                  <Text style={styles.unlockText}>{'Unlock 15 Vouchers'}</Text>
                  <Text style={styles.frdText}>
                    {'5 on food + 5 on ride + 5 on parcel'}
                  </Text>
                  <Spacer space={hp('4%')} />
                  <BTN
                    title={'Pay Now'}
                    height={hp('4%')}
                    width={wp('80%')}
                    onPress={() => {
                      setPayToUnlock(true);
                    }}
                  />
                </View>
              </Surface>
            ) : (
              <View style={styles.rendercardView}>
                {vouchersGiftArray?.map((item, index) => {
                  return (
                    <VouchersGiftCard
                      item={item}
                      index={index}
                      onViewPress={onViewDetails}
                      onBuyPress={onBuyDetails}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </AppInputScroll>
      </View>
    </Wrapper>
  );
};

export default Vouchers;
