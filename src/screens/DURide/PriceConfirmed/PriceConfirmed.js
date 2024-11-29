import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Animated,
} from 'react-native';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../../components/header/Header';
import {currencyFormat} from '../../../halpers/currencyFormat';
import CTA from '../../../components/cta/CTA';
import {Surface} from 'react-native-paper';
import CheckBoxText from '../../../components/CheckBoxText';
import {Formik, useFormikContext} from 'formik';
import PickDropLocation from '../../../components/PickDropLocation';
import Spacer from '../../../halpers/Spacer';
import HomeSlider from '../../../components/slider/homeSlider';
import {rootStore} from '../../../stores/rootStore';
import MapRoute from '../../../components/MapRoute';
import {PanGestureHandler} from 'react-native-gesture-handler';

const paymentMethod = ['Cash', 'QR Code'];
let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];

export default function PriceConfirmed({navigation, route}) {
  const {item} = route.params;
  const {setAddParcelInfo} = rootStore.parcelStore;
  console.log('Price item---', item);
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [initialValues, setInitialValues] = useState({
    paymentMethods: 'Cash',
  });
  const [sliderItems, setSliderItems] = useState(imageArray);
  const [total, setTotal] = useState(0);
  const [minMaxHp, setMinMaxHp] = useState(hp('80%'));
  const [pickDropDetails, setPickDropDetails] = useState(item);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
    }, []),
  );

  useEffect(() => {
    if (Object?.keys(item || {})?.length > 0) {
      setTotal(item?.total_amount);
      setPickUpLocation(item?.sender_address?.address);
      setDropLocation(item?.receiver_address?.address);
      setPickDropDetails(item);
    }
  }, [item]);

  const BtnForm = ({onPress}) => {
    const {dirty, isValid, values} = useFormikContext();
    return (
      <CTA
        title={'Find a driver'}
        textTransform={'capitalize'}
        onPress={() => {
          onPress(values);
        }}
      />
    );
  };

  const handleFindRider = value => {
    navigation.navigate('searchingRide', {
      paymentMethod: value?.paymentMethods,
    });
  };

  const onGestureEvent = ({nativeEvent}) => {
    console.log('nativeEvent----------', nativeEvent);
    if (nativeEvent?.translationY >= 0) {
      setMinMaxHp(hp('35%'));
    } else {
      setMinMaxHp(hp('80%'));
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header
        title={'Price Confirmed'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
      <MapRoute
        origin={pickDropDetails?.sender_address?.geo_location}
        destination={pickDropDetails?.receiver_address?.geo_location}
        mapContainerView={
          Platform.OS == 'ios' ? {height: hp('67%')} : {height: hp('67%')}
        }
      />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[styles.containerDriverTouch, {height: minMaxHp}]}>
          <View style={styles.topLineView} />
          <Formik initialValues={initialValues}>
            <View style={{marginHorizontal: 20}}>
              <PickDropLocation
                pickUpLocation={pickUpLocation}
                dropLocation={dropLocation}
                pick={'Pickup'}
                drop={'Dropped'}
              />
              {minMaxHp == hp('80%') && (
                <>
                  <Surface elevation={3} style={styles.rateSurfaceView}>
                    <View style={styles.surfaceInnerView}>
                      <Image
                        resizeMode="cover"
                        style={styles.rateImage}
                        source={appImages.rateIcon}
                      />
                      <Text style={styles.rateText}>
                        {currencyFormat(Number(total))}
                      </Text>
                    </View>
                  </Surface>
                  <CheckBoxText
                    data={paymentMethod}
                    title={'Payment Methods'}
                    name={'paymentMethods'}
                    value={initialValues.paymentMethods}
                  />
                  <View style={styles.homeSliderView}>
                    <HomeSlider
                      data={sliderItems}
                      imageWidth={wp('92%')}
                      imageHeight={hp('18%')}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ride', {screen: 'home'});
                    }}
                    activeOpacity={0.8}
                    style={styles.BTHView}>
                    <Text style={styles.BTHText}>Back To Home</Text>
                    <View style={styles.BTHBottomLine} />
                  </TouchableOpacity>
                </>
              )}
              <Spacer space={'10%'} />
              <BtnForm onPress={handleFindRider} />
            </View>
          </Formik>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
