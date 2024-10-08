import React, {Component, useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity,  Linking,} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputScrollView from 'react-native-input-scroll-view';
import {SvgXml} from 'react-native-svg';
import Header from '../../../../components/header/Header';
import { fonts } from '../../../../theme/fonts/fonts';
import Spacer from '../../../../halpers/Spacer';
import { colors } from '../../../../theme/colors';

let helpArray = [
  {
    id: 1,
    name: 'I did not receive this order',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'NotReceiveOrder',
  },
  {
    id: 2,
    name: 'Item(s) portion size is not adequate',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'SizeNotAdequate',
  },
  {
    id: 3,
    name: 'Report a Safety incident',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'SafetyIncident',
  },
  {
    id: 4,
    name: 'Few Items missing in my order',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'MissingMyOrder',
  },
  {
    id: 5,
    name: 'Item(s) quality is poor',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'QualityPoor',
  },
  {
    id: 6,
    name: 'I have coupon related issue',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'couponRelatedIssue',
  },
  {
    id: 7,
    name: 'Payment and billing related issue',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'PaymentRelatedIssue',
  },
];

export default function Help({navigation}) {

  const [loading, setLoading] = useState(false);
  const [openClose, setOpenClose] = useState('');


  const onPressDownUp = item => {
    if (item?.id === openClose) {
      setOpenClose('');
    } else {
      setOpenClose(item?.id);
    }
  };

 
  return (
    <View style={{flex: 1, backgroundColor:colors.white}}>
        <Header
        onPress={() => {
          navigation.goBack();
        }}
        title={'Help'}
        backArrow={true}
          />
      <InputScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardOffset={hp('20%')}
        contentContainerStyle={{
          paddingBottom: '10%',
        }}>
        <Spacer space={'4%'}/>
        <View style={{height: 1, backgroundColor: colors.colorD9}} />
        {helpArray?.map((item, i) => {
          return (
            <View>
              <View style={{marginHorizontal: 16, marginTop: '2%'}}>
                <TouchableOpacity
                style={{flexDirection: 'row', marginTop: '3%'}}
                    activeOpacity={0.8}
                    onPress={() => {
                      onPressDownUp(item);
                    }}
                    hitSlop={{top: 15, bottom: 15, right: 5, left: 5}}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: RFValue(12),
                      fontFamily: fonts.medium,
                      color:colors.color43,
                    }}>
                    {item?.name}
                  </Text>
                 
                    <SvgXml
                      xml={openClose == item?.id ? upperIcon : downIcon}
                    />
                  </TouchableOpacity>
             
                {openClose === item?.id && (
                  <>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        fontFamily: fonts.medium,
                        color:colors.color80,
                        marginTop: '5%',
                      }}>
                      {item?.discription}
                    </Text>
                  
                  </>
                )}
              </View>
              <View
                style={{height: 1, backgroundColor:colors.colorD9, marginTop: '5%'}}
              />
            </View>
          );
        })}
      </InputScrollView>
    </View>
  );
}

const downIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
<path d="M5 7.5L10 12.5L15 7.5" stroke="#595959" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const upperIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
<path d="M15 12.5L10 7.5L5 12.5" stroke="#595959" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;