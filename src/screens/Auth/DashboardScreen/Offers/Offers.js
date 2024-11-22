import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import NoInternet from '../../../../components/NoInternet';
import {fetch} from '@react-native-community/netinfo';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import {rootStore} from '../../../../stores/rootStore';
import OffersExploreFlatList from '../../../../components/slider/offersExplore';
import {appImages} from '../../../../commons/AppImages';
import {
  offerExplore,
  offerPromotion,
  offerTopDeals,
} from '../../../../stores/DummyData/Offers';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../../theme/fonts/fonts';
import {colors} from '../../../../theme/colors';
import PromotionsFlatList from '../../../../components/slider/promotionsSlider';
import HomeSlider from '../../../../components/slider/homeSlider';
import TwoTextSlider from '../../../../components/slider/twoTextSlider';

export default function Offers({navigation}) {
  const {appUser} = rootStore.commonStore;
  const [internet, setInternet] = useState(true);
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [exploreArray, setExploreArray] = useState(offerExplore);
  const [promotionArray, setPromotionArray] = useState(offerPromotion);
  const [sliderItems, setSliderItems] = useState(offerTopDeals);

  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
      setAppUserInfo(appUser);
    }, []),
  );

  useEffect(() => {
    DeviceEventEmitter.addListener('tab2', event => {
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

  const onPressExplore =(item)=>{
    console.log("item--",item);
    navigation.navigate("giftCard")
  }

  return (
    <View style={styles.container}>
      {internet == false ? (
        <NoInternet />
      ) : (
        <>
          <DashboardHeader navigation={navigation} appUserInfo={appUserInfo} />
            <AppInputScroll
            Pb={'20%'}
              padding={true}
              keyboardShouldPersistTaps={'handled'}>
              <View style={styles.innerMainView}>
                <OffersExploreFlatList
                  data={exploreArray}
                  onPress={onPressExplore}
                />
                <PromotionsFlatList
                  data={promotionArray}
                  onPress={() => {
                    alert('yes');
                  }}
                />
                <TwoTextSlider
                  title={'Top Deals'}
                  message={
                    'Discover the best offers on high-quality products designed to meet your needs and style.'
                  }
                  data={sliderItems}
                />
                <TwoTextSlider
                  title={'Special Bites, Great Price'}
                  message={
                    'Explore our special food offers and enjoy unbeatable discounts on your favorite dishes.'
                  }
                  data={sliderItems}
                />
              </View>
            </AppInputScroll>
        </>
      )}
    </View>
  );
}
