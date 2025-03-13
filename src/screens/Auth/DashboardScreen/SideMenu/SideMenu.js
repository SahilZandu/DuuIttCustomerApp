import React, {useState, useCallback,useEffect} from 'react';
import {View, Text, DeviceEventEmitter} from 'react-native';
import {appImagesSvg} from '../../../../commons/AppImages';
import {styles} from './styles';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import {rootStore} from '../../../../stores/rootStore';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import Url from '../../../../api/Url';
import ReusableSurfaceComp from '../../../../components/ReusableSurfaceComp';
import TouchTextRightIconComp from '../../../../components/TouchTextRightIconComp';
import ProfileCompleteIconTextComp from '../../../../components/ProfileCompleteIconTextComp';
import ProfileUpperShowComp from '../../../../components/ProfileUpperShowComp';
import Spacer from '../../../../halpers/Spacer';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';
import socketServices from '../../../../socketIo/SocketServices';



export default function SideMenu({navigation}) {
  const {setToken, setAppUser, appUser} = rootStore.commonStore;
  const foodOptions = [
    {
      title: 'Your Order',
      onPress: () => {
        // console.log('Order Histroy');
        navigation.navigate('tab3',{tabText:'Food'})
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
    {
      title: 'My Favorite',
      onPress: () => {
        navigation.navigate('favoriteRestaurant')
      },
      icon: appImagesSvg.myFavorate,
      show: true,
      disable: false,
    },
  ];
  const rideOptions = [
    {
      title: 'Your Order',
      onPress: () => {
        // console.log('Order Histroy');
        navigation.navigate('tab3',{tabText:'Ride'})
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
  ];
  const parcelOptions = [
    {
      title: 'Your Order',
      onPress: () => {
        // console.log('Order Histroy');
        navigation.navigate('tab3',{tabText:'Parcel'})
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
  ];

  const moneyOptions = [
    {
      title: 'Wallet',
      onPress: () => {
        navigation.navigate('wallet')
        // console.log('Wallet');
      },
      icon: appImagesSvg.walletSvg,
      show: true,
      disable: false,
    },
    {
      title: 'Buy  Gift Card',
      onPress: () => {
        // console.log('Buy  Gift Card');
        navigation.navigate('giftCard')
      },
      icon: appImagesSvg.giftCardSvg,
      show: true,
      disable: false,
    },
    {
      title: 'Claim Gift Card',
      onPress: () => {
        // console.log('Claim Gift Card');
        navigation.navigate('claimGiftCardList')
      },
      icon: appImagesSvg.myFavorate,
      show: true,
      disable: false,
    },
    {
      title: 'Reward Coins',
      onPress: () => {
        navigation.navigate('rewardsStars') 
        // console.log('Reward Coins');
      },
      icon: appImagesSvg.currencySvg,
      show: true,
      disable: false,
    },
    {
      title: 'Duuitt Credits',
      onPress: () => {
        navigation.navigate('duuIttCredit')
        // console.log('Duuitt Credits');
      },
      icon: appImagesSvg.duuIttCoin,
      show: true,
      disable: false,
    },
    {
      title: 'Payment Settings',
      onPress: () => {
        console.log('Payment Settings');
      },
      icon: appImagesSvg.paymentSvg,
      show: true,
      disable: false,
    },
  ];

  const coupanOptions = [
    {
      title: 'Collected Coupons',
      onPress: () => {
        console.log('Collected Coupons');
      },
      icon: appImagesSvg.coupansSvg,
      show: true,
      disable: false,
    },
  ];

  const moreOptions = [
    {
      title: 'My Address',
      onPress: () => {
        navigation.navigate('myAddress',{screenName:'home'})
        // console.log('My Address');
      },
      icon: appImagesSvg.myAddressSvg,
      show: true,
      disable: false,
    },
    // {
    //   title: 'About',
    //   onPress: () => {
    //     console.log('About');
    //   },
    //   icon: appImagesSvg.aboutSvg,
    //   show: true,
    //   disable: false,
    // },
    {
      title: 'Send feedback',
      onPress: () => {
        navigation.navigate('feedback');
      },
      icon: appImagesSvg.sendFeedback,
      show: true,
      disable: false,
    },
    {
      title: 'Help',
      onPress: () => {
        navigation.navigate('help');
      },
      icon: appImagesSvg.helpSvg,
      show: true,
      disable: false,
    },
    {
      title: 'Settings',
      onPress: () => {
        console.log('Settings');
      },
      icon: appImagesSvg.settingSvg,
      show: true,
      disable: false,
    },

    {
      title: 'Logout',
      onPress: async () => {
        let query ={
          user_id:appUser?._id
          }
        socketServices.emit('remove-user',query)
        socketServices.disconnectSocket();
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

  const [initialValues, setInitialValues] = useState({
    image: '',
    name: '',
    email: '',
    phone: '',
  });
  const [internet, setInternet] = useState(true);

  useFocusEffect(
    useCallback(() => {
      socketServices.initailizeSocket();
      checkInternet();
      handleAndroidBackButton(navigation);
      onUpdateUserInfo();
    }, []),
  );

  useEffect(() => {
    DeviceEventEmitter.addListener('tab4', event => {
      if (event != 'noInternet') {
      }
      setInternet(event == 'noInternet' ? false : true);
      console.log('internet event');
    });
  }, []);
  
  const checkInternet = () => {
    fetch().then(state => {
      setInternet(state.isInternetReachable);
    });
  };

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

  return (
    <View style={styles.container}>
      {internet == false ? <NoInternet/> 
      :<> 
      <ProfileUpperShowComp
        navigation={navigation}
        item={initialValues}
        appUser={appUser}
      />
      <Spacer space={'1%'} />
      <AppInputScroll
        Pb={'57%'}
        padding={true}
        keyboardShouldPersistTaps={'handled'}>
        <ProfileCompleteIconTextComp
          navigation={navigation}
          appUser={appUser}
        />
        <ReusableSurfaceComp title={'Food'}>
          <TouchTextRightIconComp  firstIcon={true} data={foodOptions} />
        </ReusableSurfaceComp>

        <ReusableSurfaceComp title={'Ride'}>
          <TouchTextRightIconComp firstIcon={true} data={rideOptions} />
        </ReusableSurfaceComp>

        <ReusableSurfaceComp title={'Parcel'}>
          <TouchTextRightIconComp firstIcon={true} data={parcelOptions} />
        </ReusableSurfaceComp>

        {/* <ReusableSurfaceComp title={'Money'}>
          <TouchTextRightIconComp firstIcon={true} data={moneyOptions} />
        </ReusableSurfaceComp> */}
        {/* <ReusableSurfaceComp title={'Coupons'}>
          <TouchTextRightIconComp  firstIcon={true} data={coupanOptions} />
        </ReusableSurfaceComp> */}

        <ReusableSurfaceComp title={'More'}>
          <TouchTextRightIconComp firstIcon={true} data={moreOptions} />
        </ReusableSurfaceComp>
      </AppInputScroll>
      </>}
    </View>
  );
}
