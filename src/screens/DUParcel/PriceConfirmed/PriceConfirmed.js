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
import {silderArray} from '../../../stores/DummyData/Home';
import ModalPopUp from '../../../components/ModalPopUp';
import {colors} from '../../../theme/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {SvgXml} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import BTN from '../../../components/cta/BTN';

let priceArray = [0, 10, 20, 30, 40, 50];
const paymentMethod = ['Cash', 'QR Code'];

export default function PriceConfirmed({navigation, route}) {
  const {item} = route.params;
  const {setAddParcelInfo} = rootStore.parcelStore;
  console.log('Price item---', item);
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [initialValues, setInitialValues] = useState({
    paymentMethods: 'Cash',
  });
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [total, setTotal] = useState(0);
  const [minMaxHp, setMinMaxHp] = useState(hp('80%'));
  const [pickDropDetails, setPickDropDetails] = useState(item);
  const [isPriceModal, setIsPriceModal] = useState(false);
  const [fare, setFare] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedWidth, setSelectedWidth] = useState('0%');

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
    }, []),
  );

  useEffect(() => {
    if (Object?.keys(item || {})?.length > 0) {
      setTotal(item?.total_amount);
      setFare(item?.total_amount);
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
    setInitialValues(value);
    setMinMaxHp(hp('35%'));
    setIsPriceModal(true);
    //  navigation.navigate('searchingRide', {
    //   paymentMethod: value?.paymentMethods,
    // });
  };

  const handlePriceFindRider = () => {
    setIsPriceModal(false);
    setTimeout(()=>{
      navigation.navigate('searchingRide', {
        paymentMethod: initialValues?.paymentMethods,
        totalAmount:total,
      });
    },500)
   
  };

  const onGestureEvent = ({nativeEvent}) => {
    console.log('nativeEvent----------', nativeEvent);
    if (nativeEvent?.translationY >= 0) {
      setMinMaxHp(hp('35%'));
    } else {
      setMinMaxHp(hp('80%'));
    }
  };

  const onNegative = () => {
    if (fare < total) {
      let newFare = total - 10;
      let newCount = selectedCount - 0.2;
      let newWidth = `${parseFloat(selectedWidth) - parseFloat('18')}%`;
      setTotal(Number(newFare));
      setSelectedCount(newCount);
      setSelectedWidth(newWidth);
    }
  };

  const onPositive = () => {
    if (fare + priceArray.at(-1) > total) {
      let newFare = total + 10;
      let newCount = selectedCount + 0.2;
      let newWidth = `${parseFloat(selectedWidth) + parseFloat('18')}%`;
      setTotal(Number(newFare));
      setSelectedCount(newCount);
      setSelectedWidth(newWidth);
    }
  };

  const ProgressBarWithGradient = ({progress}) => {
    return (
      <View
        style={{
          width: wp('86%'),
          height: hp('0.9%'),
          backgroundColor: colors.colorC5,
          borderRadius: 5,
          overflow: 'hidden',

          alignSelf: 'center',
        }}>
        <LinearGradient
          colors={['#28B056', '#63BE82', '#9DCBAD']} // Gradient colors
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          style={{
            width: `${progress * 100}%`, // Dynamic width based on progress
            height: '100%',
          }}
        />
      </View>
    );
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
                      navigation.navigate('parcel', {screen: 'home'});
                      // setAddParcelInfo({});
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
      <ModalPopUp
        isVisible={isPriceModal}
        onClose={() => {
          setIsPriceModal(false);
        }}>
        <View
          style={{
            height: hp('48%'),
            backgroundColor: colors.white,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <View style={{marginHorizontal: 20}}>
            <Text
              style={{
                fontSize: RFValue(15),
                fontFamily: fonts.bold,
                color: colors.black,
                marginTop: '5%',
              }}>
              Raise your fair
            </Text>
            <Text
              style={{
                fontSize: RFValue(13),
                fontFamily: fonts.regular,
                color: colors.color24,
                marginTop: '3%',
                lineHeight: 20,
              }}>
              We charge no commission. Full amount goes to the rider
            </Text>

            <Text
              style={{
                fontSize: RFValue(32),
                fontFamily: fonts.semiBold,
                color: colors.black,
                marginTop: '5%',
                textAlign: 'center',
              }}>
              {currencyFormat(total)}
            </Text>
            <Text
              style={{
                fontSize: RFValue(12),
                fontFamily: fonts.regular,
                color: colors.black,
                marginTop: '3%',
                textAlign: 'center',
              }}>
              You can also directly type the fare
            </Text>
            <View style={{justifyContent: 'center', marginTop: hp('3%')}}>
              <ProgressBarWithGradient progress={selectedCount} />
              <SvgXml
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  left: selectedWidth,
                }}
                xml={appImagesSvg.progessBarIcon}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                marginTop: '6%',
              }}>
              {priceArray?.map((item, i) => {
                return (
                  <View>
                    <Text>{item}</Text>
                  </View>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                marginTop: '4%',
              }}>
              <SvgXml
                onPress={() => {
                  onNegative();
                }}
                width={30}
                height={30}
                xml={appImagesSvg.progessNegative}
              />
              <SvgXml
                onPress={() => {
                  onPositive();
                }}
                width={30}
                height={30}
                xml={appImagesSvg.progessPositive}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <BTN
                width={wp('86%')}
                title={`Book Now for ${currencyFormat(total)}`}
                textTransform={'capitalize'}
                onPress={() => {
                  handlePriceFindRider();
                }}
              />
            </View>
          </View>
        </View>
      </ModalPopUp>
    </View>
  );
}
