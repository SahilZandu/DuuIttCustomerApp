import React, { Component, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputScrollView from 'react-native-input-scroll-view';
import { SvgXml } from 'react-native-svg';
import Header from '../../../../components/header/Header';
import { fonts } from '../../../../theme/fonts/fonts';
import Spacer from '../../../../halpers/Spacer';
import { colors } from '../../../../theme/colors';
import { styles } from './styles';
import { Wrapper } from '../../../../halpers/Wrapper';



export default function Help({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [openClose, setOpenClose] = useState('');

  let helpArray = [
    {
      id: 1,
      name: 'How to Book a Ride 🚖',
      AnswerArray: [
        "Open the Duuitt app and tap Du Ride from the home screen.",
        "Enter your pickup location and drop location.",
        "Choose your vehicle type (bike/scooter).",
        "Review the fare estimate and confirm your booking.",
        "You’ll see driver details and can track them in real time."],
    },
    {
      id: 2,
      name: 'How to Order Food 🍔',
      AnswerArray: [
        "Tap Du Food on the home screen.",
        "Select your restaurant or browse categories.",
        "Add items to your cart and review the total bill.",
        "Choose your delivery address and payment method.",
        "Place the order and track your delivery live."],
    },
    {
      id: 3,
      name: 'Sending a Parcel 📦',
      AnswerArray: [
        "Open Du Parcel from the home screen.",
        "Enter the pickup and delivery locations.",
        "Add receiver’s name and contact number.",
        "Confirm parcel details and estimated fare.",
        "Book the delivery — you can track it until it’s completed."],
    },
    {
      id: 4,
      name: 'Track Your Orders & Rides 📍',
      AnswerArray: [
        "Go to Profile > My Rides to see all your ride bookings.",
        "Go to Profile > My Orders to see your food orders.",
        "Tap any ride/order to view real-time tracking and status updates.",
      ],
    },
    {
      id: 5,
      name: 'Report an Issue 🛠',
      AnswerArray: [
        "Open My Rides or My Orders.",
        "Select the ride/order/parcel you faced an issue with.",
        "Tap Report Issue and choose the reason (late delivery, payment problem, etc.)",
        "Submit details — our support team will respond within 24 hours.",
      ],

    },
    {
      id: 6,
      name: 'Contact Us 📞',
      AnswerArray: [
        "We’re here to help between 8 AM – 10 PM.",
        "Email: support@duuitt.com",
      ],
    },

  ];

  const onPressDownUp = item => {
    if (item?.id === openClose) {
      setOpenClose('');
    } else {
      setOpenClose(item?.id);
    }
  };

  const hanldeLinking = (type, data) => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${data ?? "support@duuitt.com"}`);
      } else {
        Linking.openURL(`tel:${data ?? '1234567890'}`);
      }
    }
  };

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      onPress={() => {
        navigation.goBack();
      }}
      title={'Help'}
      backArrow={true}
      showHeader
    >

      <InputScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardOffset={hp('20%')}
        contentContainerStyle={{
          paddingBottom: '10%',
        }}>
        <Spacer space={'2%'} />
        <View style={styles.upperLine} />
        {helpArray?.map((item, i) => {
          return (
            <View>
              <View style={styles.renderMainView}>
                <TouchableOpacity
                  style={styles.touchImage}
                  activeOpacity={0.8}
                  onPress={() => {
                    onPressDownUp(item);
                  }}
                  hitSlop={styles.hotSlotImage}>
                  <Text
                    style={styles.nameTitle}>
                    {item?.name}
                  </Text>

                  <SvgXml
                    xml={openClose == item?.id ? upperIcon : downIcon}
                  />
                </TouchableOpacity>

                {openClose === item?.id && (
                  <>
                    {item?.AnswerArray?.map((data, i) => {
                      const parts = data.split(": ");
                      return (
                        <>
                          {data?.includes(':') ?
                            <Text
                              onPress={() => { hanldeLinking("email", parts[1]) }}
                              style={styles.answerText}>
                              {parts[0]} :
                              <Text style={styles.emailPhoneText}>{' '}{parts[1]}</Text>
                            </Text>
                            : <Text
                              style={styles.answerText}>
                              {data}
                            </Text>}
                        </>
                      )
                    })}
                  </>
                )}
              </View>
              <View
                style={styles.bottonLineView}
              />
            </View>
          );
        })}
      </InputScrollView>
    </Wrapper>
  );
}

const downIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
<path d="M5 7.5L10 12.5L15 7.5" stroke="#595959" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const upperIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
<path d="M15 12.5L10 7.5L5 12.5" stroke="#595959" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
