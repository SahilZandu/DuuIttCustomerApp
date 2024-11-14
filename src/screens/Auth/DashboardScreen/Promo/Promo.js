import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, View, KeyboardAvoidingView, DeviceEventEmitter} from 'react-native';
import {appImagesSvg, appImages} from '../../../../commons/AppImages';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {currencyFormat} from '../../../../halpers/currencyFormat';
import {Surface} from 'react-native-paper';
import Tabs3 from '../../../../components/Tabs3';
import Spacer from '../../../../halpers/Spacer';
import HomeSlider from '../../../../components/slider/homeSlider';
import {Formik, useFormikContext} from 'formik';
import {giftMessageValidations} from '../../../../forms/formsValidation/giftMessageValidations';
import GiftCard from './GiftCard';
import Rewards from './Rewards';
import NoInternet from '../../../../components/NoInternet';
import {fetch} from '@react-native-community/netinfo';


const tabs = [{text: 'Gift cards'}, {text: 'Rewards'}];

let defaultType = 'Gift cards';

let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];

export default function Promo({navigation}) {
  const [sliderItems, setSliderItems] = useState(imageArray);
  const [sliderItems1, setSliderItems1] = useState(imageArray);
  const [sliderItems2, setSliderItems2] = useState(imageArray);
  const [initialValues, setInitialValues] = useState({
    feedback: '',
  });
  const [giftReward, setGiftReward] = useState(defaultType);
  const [internet, setInternet] = useState(true);

  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
    }, []),
  );

  const handleTabPress = async text => {
    defaultType = text;
    console.log('text--', text);
    setGiftReward(text);
  };
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

  return (
    <View style={styles.container}>
      {internet == false ? <NoInternet/> 
      :<> 
      <Formik
        initialValues={initialValues}
        validationSchema={giftMessageValidations()}>
        <KeyboardAvoidingView
          style={{flex: 1, marginTop: '1.5%'}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Surface elevation={3} style={styles.surfaceView}>
            <View style={styles.walletRateView}>
              <View style={styles.walletView}>
                <SvgXml
                  style={styles.walletImage}
                  xml={appImagesSvg.walletIcon}
                />
                <Text style={styles.walletText}>Wallet</Text>
              </View>
              <View style={styles.rateView}>
                <Text style={styles.rateText}>{currencyFormat(450)}</Text>
              </View>
            </View>
          </Surface>
          {/* <Spacer space={'1%'} /> */}
          <Tabs3 tabs={tabs} tabPress={handleTabPress} imageHide={false} />

          <AppInputScroll
            Pb={'35%'}
            padding={true}
            keyboardShouldPersistTaps={'handled'}>
            <View style={styles.innerMainView}>
              <View style={styles.offerTextView}>
                <Text style={styles.offerText}>Offers For You</Text>
              </View>
              <View style={{marginHorizontal: '-3%'}}>
                <HomeSlider data={sliderItems} paginationList={true} />
                <HomeSlider data={sliderItems1} paginationList={true} />
                <HomeSlider data={sliderItems2} paginationList={true} />
              </View>

              {giftReward === 'Gift cards' ? (
                <GiftCard navigation={navigation} />
              ) : (
                <Rewards navigation={navigation} />
              )}
            </View>
          </AppInputScroll>
        </KeyboardAvoidingView>
      </Formik>
      </>}
    </View>
  );
}
