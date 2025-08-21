import React, { useCallback, useState } from 'react';
import { View, Text, Platform, Image, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';
import { appImages, appImagesSvg } from '../../../../../commons/AppImages';
import Header from '../../../../../components/header/Header';
import { colors } from '../../../../../theme/colors';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../../../theme/fonts/fonts';
import TextRender from '../../../../../components/TextRender';
import { currencyFormat } from '../../../../../halpers/currencyFormat';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import { SvgXml } from 'react-native-svg';
import BTN from '../../../../../components/cta/BTN';
import GiftCardHappiness from '../../../../../components/GiftCardHappiness';
import { Wrapper } from '../../../../../halpers/Wrapper';

const GiftCardPurchase = ({ navigation }) => {
  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      backArrow={true}
      title={'Gift Card Purchase'}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.main}>
        {/* <Header
        backArrow={true}
        title={'Gift Card Purchase'}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
          <View style={styles.upperMainView}>
            <GiftCardHappiness
              item={{
                image: appImages.birthdayImage1,
                msgDay: 'Have a great day full of happiness!',
              }}
            />
          </View>
          <View style={styles.summaryView}>
            <Text style={styles.summaryText}>Bill Summary</Text>
            <TextRender
              title={'Subtotal'}
              value={currencyFormat(100.3)}
              bottomLine={true}
              titleStyle={styles.subTotalText}
              valueStyle={styles.subTotalValue}
              lineStyle={{ marginHorizontal: 0 }}
            />
            <TextRender
              title={'Grand Total'}
              value={currencyFormat(100.5)}
              bottomLine={false}
              titleStyle={styles.totalText}
              valueStyle={styles.totalValue}
            />
          </View>
        </AppInputScroll>
        <View style={styles.bottomButtonView}>
          <Surface elevation={3} style={styles.bottomBtnSurface}>
            <View style={styles.bottomInnerView}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('paymentMethod');
                }}
                activeOpacity={0.8}
                style={styles.paymentModeTouch}>
                <SvgXml xml={appImagesSvg.googlePay} />
                <Text numberOfLines={1} style={styles.paymentTitle}>
                  Google Pay
                </Text>
                <SvgXml
                  style={{ marginLeft: '2%' }}
                  xml={appImagesSvg.greenBottomArrow}
                />
              </TouchableOpacity>

              <View style={styles.buyBtnView}>
                <BTN
                  width={wp('45%')}
                  title={'Buy Now'}
                  onPress={() => {
                    navigation.navigate('paymentMethod');
                  }}
                />
              </View>
            </View>
          </Surface>
        </View>
      </View>
    </Wrapper>
  );
};

export default GiftCardPurchase;
