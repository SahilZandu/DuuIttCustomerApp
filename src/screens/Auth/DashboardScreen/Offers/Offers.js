import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  DeviceEventEmitter,
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
import {
  offerExplore,
  offerPromotion,
  offerTopDeals,
} from '../../../../stores/DummyData/Offers';
import PromotionsFlatList from '../../../../components/slider/promotionsSlider';
import TwoTextSlider from '../../../../components/slider/twoTextSlider';


export default function Offers({navigation}) {
  const {appUser} = rootStore.commonStore;
  const [internet, setInternet] = useState(true);
  const [exploreArray, setExploreArray] = useState(offerExplore);
  const [promotionArray, setPromotionArray] = useState(offerPromotion);
  const [sliderItems, setSliderItems] = useState(offerTopDeals);

  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
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
    if( item?.title == 'Rewards'){
    navigation.navigate("rewards")
    }
    else if( item?.title == 'Gift Cards'){
      navigation.navigate("giftCard");
    }
    else if( item?.title == 'Vouchers'){
      navigation.navigate("vouchers");
    }
    else if( item?.title == 'Wallet'){
      navigation.navigate("wallet");
    }else{
      navigation.navigate('rewardsStars') 
      // alert("under processing...")
    }
  }

  return (
    <View style={styles.container}>
      {internet == false ? (
        <NoInternet />
      ) : (
        <>
          <DashboardHeader title={'Explore'} />
            <AppInputScroll
            Pb={'35%'}
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
                    // alert('yes');
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
