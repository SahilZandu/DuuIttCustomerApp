import React, {useEffect, useState, useRef, useCallback} from 'react';
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
import {rootStore} from '../../../../stores/rootStore';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import Url from '../../../../api/Url';

export default function SideMenu({navigation}) {
  const {setToken, setAppUser, appUser} = rootStore.commonStore;

  const [initialValues, setInitialValues] = useState({
    image: '',
    name: '',
    email: '',
    phone: '',
  });

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      onUpdateUserInfo();
    }, []),
  );

  const onUpdateUserInfo = () => {
    const {appUser} = rootStore.commonStore;
    console.log('appUser--', appUser);
    setInitialValues({
      image:
        appUser?.profile_pic?.length > 0
          ? Url?.Image_Url + appUser?.profile_pic
          : '',
      name: appUser?.name?.length > 0 ? appUser?.name : 'User Name',
      email: appUser?.email?.length > 0 ? appUser?.email : 'Example@gmail.com',
      phone:
        appUser?.phone?.toString()?.length > 0
          ? appUser?.phone?.toString()
          : '9876543210',
    });
  };

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
      onPress: async () => {
        await setToken(null);
        await setAppUser(null);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'auth'}],
          }),
        );
      },
      icon: appImagesSvg.logOutSvg,
      show: true,
      disable: false,
    },
  ];

  return (
    <View style={styles.container}>
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View>
          <LinearGradient
            colors={['#28B05610', '#28B05640', '#28B05650']}
            style={{
              height: hp('17%'),
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}></LinearGradient>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: wp('90%'),
                height: hp('11%'),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#D9D9D9',
                justifyContent: 'center',
                marginTop: '-13%',
                backgroundColor: colors.white,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  resizeMode="cover"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 100,
                    marginLeft: '5%',
                    borderColor: colors.main,
                    borderWidth: 0.3,
                  }}
                  source={
                    appUser?.profile_pic?.length > 0
                      ? {uri: Url?.Image_Url + appUser?.profile_pic}
                      : appImages.avtarImage
                  }
                />
                <View
                  style={{flex: 1, marginLeft: '3%', justifyContent: 'center'}}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: RFValue(15),
                        fontFamily: fonts.medium,
                        color: colors.black,
                      }}>
                      {initialValues?.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('profile');
                      }}
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
                      marginTop: '1%',
                    }}>
                    {initialValues?.email}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(13),
                      fontFamily: fonts.medium,
                      color: colors.black75,
                      marginTop: '1.5%',
                    }}>
                    {initialValues?.phone}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Spacer space={'3%'} />

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginHorizontal: 20,
            }}>
            {settingOptions?.map(
              (item, index) =>
                item?.show && (
                  <View key={index} style={{justifyContent: 'center'}}>
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
                        height: 2,
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
