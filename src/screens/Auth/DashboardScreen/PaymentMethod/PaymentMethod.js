import React, {useEffect, useState} from 'react';
import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import Header from '../../../../components/header/Header';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../../theme/colors';
import {fonts} from '../../../../theme/fonts/fonts';
import {Surface} from 'react-native-paper';
import {appImages, appImagesSvg} from '../../../../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import {currencyFormat} from '../../../../halpers/currencyFormat';
import PaymentMethodComp from '../../../../components/PaymentMethodComp';
import { Wrapper } from '../../../../halpers/Wrapper';

const PaymentMethod = ({navigation, secondLine}) => {
  let paymentMode = [
    {
      id: 1,
      title: 'Preferred Payment',
      price: '',
      name: 'Gpay',
      message: '',
      image: appImages.googlePay,
      active: true,
      checkBox: true,
    },
    {
      id: 2,
      title: 'UPI Pay',
      price: '',
      name: 'Add New UPI ID',
      message: 'You need to have a registered UPI ID',
      image: appImages.plusIcon,
      active: false,
      checkBox: false,
    },
    {
      id: 3,
      title: 'Credit & Debit Cards',
      price: '',
      name: 'Add New Card',
      message: 'Save and Pay via Cards',
      image: appImages.plusIcon,
      active: false,
      checkBox: false,
    },
    {
      id: 4,
      title: 'Wallets',
      name: 'Duuitt Cash',
      price: 40.0,
      message: '',
      image: appImages.walletsCash,
      active: false,
      checkBox: true,
    },
    {
      id: 5,
      name: 'Paytm',
      price: '',
      message: '',
      image: appImages.paytmLogo,
      active: false,
      checkBox: true,
    },
    {
      id: 6,
      name: 'Phone Pay',
      price: '',
      message: '',
      image: appImages.phonePay,
      active: false,
      checkBox: true,
    },
  ];

  const [paymentMothod, setPaymentMothod] = useState(paymentMode);

  const onSelectedMethod = async item => {
    const updatedPaymentMethods = paymentMothod.map(details => {
      return {
        ...details, // Spread the existing properties
        active: details.id === item.id, // Update the active state
      };
    });

    setPaymentMothod(updatedPaymentMethods);
  };

  return (
    <Wrapper
          edges={['left', 'right']}
          transparentStatusBar
          backArrow={true}
          title={'Payment Method'}
          onPress={() => {
            navigation.goBack();
          }}
          showHeader
        >
    <View style={styles.main}>
      {/* <Header
        backArrow={true}
        title={'Payment Method'}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.upperMainView}>
          {paymentMothod?.map((item, i) => {
            return (
              <PaymentMethodComp
                item={item}
                index={i}
                onSelectedMethod={onSelectedMethod}
              />
            );
          })}
        </View>
      </AppInputScroll>
    </View>
    </Wrapper>
  );
};

export default PaymentMethod;
