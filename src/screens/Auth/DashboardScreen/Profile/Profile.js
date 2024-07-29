import React, {useEffect, useState, useRef} from 'react';
import {Text, View, Pressable, TouchableOpacity, Image} from 'react-native';
import {appImagesSvg, appImages} from '../../../../commons/AppImages';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import Spacer from '../../../../halpers/Spacer';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../../../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import { rootStore } from '../../../../stores/rootStore';


export default function Orders({navigation}) {

const {setToken}=rootStore.commonStore ;
  const settingOptions = [
    {
      title: 'Order Histroy',
      onPress: () => {
        console.log('Order Histroy');
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
    {
      title: 'Payment Method',
      onPress: () => {
        console.log('Order Histroy');
      },
      icon: appImagesSvg.paymentSvg,
      show: true,
      disable: false,
    },
    {
      title: 'My Address',
      onPress: () => {
        console.log('Order Histroy');
      },
      icon: appImagesSvg.myAddressSvg,
      show: true,
      disable: false,
    },
    {
      title: 'My Favorite',
      onPress: () => {
        console.log('Order Histroy');
      },
      icon: appImagesSvg.myFavorate,
      show: true,
      disable: false,
    },
    {
      title: 'Send feedback',
      onPress: () => {
        console.log('Order Histroy');
      },
      icon: appImagesSvg.sendFeedback,
      show: true,
      disable: false,
    },
    {
      title: 'Help',
      onPress: () => {
        console.log('Order Histroy');
      },
      icon: appImagesSvg.helpSvg,
      show: true,
      disable: false,
    },
    {
      title: 'Settings',
      onPress: () => {
        console.log('Order Histroy');
      },
      icon: appImagesSvg.settingSvg,
      show: true,
      disable: false,
    },

    {
      title: 'Logout',
      onPress: async() => {
        // logout(navigation);
        await setToken(null),
        navigation.navigate('login');
      },
      icon: appImagesSvg.logOutSvg,
      show: true,
      disable: false,
    },
  ];

  return (
    <View style={styles.container}>
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View style={{}}>
        <LinearGradient colors={['#28B05610', '#28B05640', '#28B05650']} 
        style={{height:hp("17%")
        ,borderBottomLeftRadius:10,
        borderBottomRightRadius:10}}>
  
         </LinearGradient>
          <View style={{
            justifyContent: 'center',
             alignItems: 'center'}}>
            <View
              style={{
                width: wp('88%'),
                height: hp('11%'),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#D9D9D9',
                justifyContent: 'center',
                marginTop:'-13%',
                backgroundColor:colors.white
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 100,
                    marginLeft: '5%',
                  }}
                  source={appImages.avtarImage}
                />

                <View
                  style={{flex: 1, marginLeft: '3%', justifyContent: 'center'}}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: RFValue(17),
                        fontFamily: fonts.medium,
                        color: colors.black,
                      }}>
                      Rahul Garg
                    </Text>
                    <TouchableOpacity
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      style={{marginRight: '7%', justifyContent: 'center'}}
                      activeOpacity={0.8}>
                      <SvgXml xml={appImagesSvg.editProfile} />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      fontSize: RFValue(13),
                      fontFamily: fonts.medium,
                      color: colors.black75,
                      marginTop: '3%',
                    }}>
                    rahulgarg@email.com
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Spacer
           space={'3%'}/>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginHorizontal: 20,
            }}>
            {settingOptions?.map(
              (item, index) =>
                item?.show && (
                  <View style={{justifyContent: 'center'}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={item?.disable}
                      onPress={item?.onPress}
                      key={index}
                      style={{flexDirection: 'row', marginTop: '8%'}}>
                      <SvgXml height={22} width={22} xml={item?.icon} />

                      <Text
                        style={{
                          fontSize: RFValue(14),
                          fontFamily: fonts.regular,
                          marginLeft: '3%',
                          color: '#242424',
                        }}>
                        {item?.title}
                      </Text>

                      {item?.title != 'Logout' && (
                        <SvgXml
                          height={22}
                          width={22}
                          style={{marginLeft: 'auto'}}
                          xml={appImagesSvg.rightArrow}
                        />
                      )}
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: '#D9D9D9',
                        marginTop: '5%',
                      }}
                    />
                  </View>
                ),
            )}
          </View>

        </View>
      </AppInputScroll>
    </View>
  );
}
