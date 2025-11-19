import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Image, Platform } from 'react-native';
import { appImages, appImagesSvg } from '../../../commons/AppImages';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import { currencyFormat } from '../../../halpers/currencyFormat';
import { Surface } from 'react-native-paper';
import CheckBoxText from '../../../components/CheckBoxText';
import { Formik, useFormikContext } from 'formik';
import PickDropLocation from '../../../components/PickDropLocation';
import Spacer from '../../../halpers/Spacer';
import HomeSlider from '../../../components/slider/homeSlider';
import MapRoute from '../../../components/MapRoute';
import { silderArray } from '../../../stores/DummyData/Home';
import ModalPopUp from '../../../components/ModalPopUp';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import BTN from '../../../components/cta/BTN';
import Slider from '@react-native-community/slider';
import AppInputScroll from '../../../halpers/AppInputScroll';
import BackBtn from '../../../components/cta/BackBtn';
import { rootStore } from '../../../stores/rootStore';
import { Wrapper } from '../../../halpers/Wrapper';
import { AppEvents } from '../../../halpers/events/AppEvents';


let priceArray = [0, 10, 20, 30, 40, 50];
const paymentMethod = ['Cash', 'Online'];

export default function PriceConfirmed({ navigation, route }) {
  const { item } = route.params;
  console.log('Price item---', item);
  const { setAddParcelInfo, } = rootStore.parcelStore;
  const { appUser } = rootStore.commonStore;
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [initialValues, setInitialValues] = useState({
    paymentMethods: 'Cash',
  });
  const [sliderItems, setSliderItems] = useState(silderArray);
  const [total, setTotal] = useState(0);
  const [pickDropDetails, setPickDropDetails] = useState(item);
  const [isPriceModal, setIsPriceModal] = useState(false);
  const [fare, setFare] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedWidth, setSelectedWidth] = useState('0%');
  const [fireValue, setFireValue] = useState(0);
  console.log('fireValue--', fireValue);


  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'PriceConfirmedParcel',
        payload: {
          name: appUser?.name ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }

  useFocusEffect(
    useCallback(() => {
      // handleAndroidBackButton();
      handleAndroidBackButton('', 'parcel', 'parcel', navigation);
      setSelectedCount(0);
      setSelectedWidth('0%');
    }, []),
  );

  useEffect(() => {
    if (Object?.keys(item || {})?.length > 0) {
      setTotal(item?.total_amount);
      setFare(item?.total_amount);
      setFireValue(0)
      setPickUpLocation(item?.sender_address?.address);
      setDropLocation(item?.receiver_address?.address);
      setPickDropDetails(item);
    }
  }, [item]);

  const BtnForm = ({ onPress, onBackPress }) => {
    const { dirty, isValid, values } = useFormikContext();
    return (
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          // width: wp(88),
        }}>
        {/* <BTN
          backgroundColor={colors.white}
          labelColor={colors.main}
          width={wp(42)}
          title={'Back To Home'}
          textTransform={'capitalize'}
          onPress={() => {
            onBackPress();
          }}
        /> */}
        <BTN
          width={wp(88)}
          title={'Find a driver'}
          textTransform={'capitalize'}
          onPress={() => {
            onPress(values);
          }}
        />
      </View>
    );
  };

  const handleFindRider = value => {
    setInitialValues(value);
    setIsPriceModal(true);
  };

  const handlePriceFindRider = () => {
    setIsPriceModal(false);
    let updateItem = {
      ...item,
      total_amount: total
    }
    setAddParcelInfo(updateItem);
    setTimeout(() => {
      navigation.navigate('searchingRide', {
        paymentMethod: initialValues?.paymentMethods,
        totalAmount: total,
      });
    }, 500);
  };

  const onNegative = val => {
    // console.log('val---', val);
    if (val >= 5) {
      if (fare < total) {
        let newFare = total - 10 * val;
        let newCount = selectedCount - 0.2 * val;
        let newWidth = `${parseFloat(selectedWidth) - parseFloat('18')}%`;
        setTotal(Number(newFare));
        setSelectedCount(newCount);
        setSelectedWidth(newWidth);
        setFireValue(val);
      }
    } else {
      if (fare < total) {
        let newFare = total - 10;
        let newCount = selectedCount - 0.2;
        let newWidth = `${parseFloat(selectedWidth) - parseFloat('18')}%`;
        setTotal(Number(newFare));
        setSelectedCount(newCount);
        setSelectedWidth(newWidth);
        setFireValue(fireValue - 1);
      }
    }
  };

  const onPositive = val => {
    // console.log('val---', val);
    if (val <= 5) {
      // const fixedNum = Number(val?.toFixed(0));
      // console.log("val---",fixedNum);
      if (fare + priceArray.at(-1) > total) {
        let newFare = fare + 10 * val;
        let newCount = 0 + 0.2 * val;
        let newWidth = `${parseFloat(selectedWidth) + parseFloat('18')}%`;
        setTotal(Number(newFare));
        setSelectedCount(newCount);
        setSelectedWidth(newWidth);
        setFireValue(val);
      }
    } else {
      if (fare + priceArray.at(-1) > total) {
        let newFare = total + 10;
        let newCount = selectedCount + 0.2;
        let newWidth = `${parseFloat(selectedWidth) + parseFloat('18')}%`;
        setTotal(Number(newFare));
        setSelectedCount(newCount);
        setSelectedWidth(newWidth);
        setFireValue(fireValue + 1);
      }
    }
  };

  const ProgressBarWithGradient = ({ progress }) => {
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
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            width: `${progress * 100}%`, // Dynamic width based on progress
            height: '100%',
          }}
        />
      </View>
    );
  };

  const onPressPickLocation = () => {
    navigation.navigate('editOrderLocation', {
      pickDrop: 'pick',
      item: item?.sender_address,
      orderItem: item,
    });
  };

  const onPressDropLocation = () => {
    navigation.navigate('editOrderLocation', {
      pickDrop: 'drop',
      item: item?.receiver_address,
      orderItem: item,
    });
  };

  const backToHome = () => {
    navigation.navigate('parcel', { screen: 'home' });
  }

  return (
    <Wrapper
      edges={['left', 'right', 'bottom']}
      transparentStatusBar
    >
      <View style={styles.container}>
        <MapRoute
          orderData={pickDropDetails}
          origin={pickDropDetails?.sender_address?.geo_location}
          destination={pickDropDetails?.receiver_address?.geo_location}
          mapContainerView={{ height: hp('48%') }}
        />
        <BackBtn onPress={() => {
          backToHome();
        }} />
        <View style={styles.containerDriverTouch}>
          <Spacer space={'2%'} />
          <Formik initialValues={initialValues}>
            <>
              <AppInputScroll
                Pb={hp('25%')}
                padding={true}
                keyboardShouldPersistTaps={'handled'}>
                <View style={{ marginHorizontal: 20, marginTop: hp('1.5%') }}>
                  <PickDropLocation
                    pickUpLocation={pickUpLocation}
                    dropLocation={dropLocation}
                    onPressPickLocation={onPressPickLocation}
                    onPressDropLocation={onPressDropLocation}
                  />
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

                  {/* <View style={styles.homeSliderView}>
                    <HomeSlider
                      data={sliderItems}
                      imageWidth={wp('92%')}
                      imageHeight={hp('18%')}
                    />
                  </View> */}
                </View>
              </AppInputScroll>
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: colors.white,
                  alignSelf: 'center',
                  paddingHorizontal: 40,
                  height: hp('18%'),
                  bottom: Platform.OS == 'ios' ? '-2.1%' : '0.1%',
                  borderTopWidth: 0.3,
                  borderTopColor: colors.main,
                }}>
                <CheckBoxText
                  data={paymentMethod}
                  title={'Payment Methods'}
                  name={'paymentMethods'}
                  value={initialValues.paymentMethods}
                />
                <Spacer space={hp('3.5%')} />

                <BtnForm
                  onPress={value => {
                    handleFindRider(value);
                  }}
                  onBackPress={() => {
                    backToHome();
                  }}
                />
              </View>
            </>
          </Formik>
        </View>

        <ModalPopUp
          isVisible={isPriceModal}
          onClose={() => {
            setIsPriceModal(false);
          }}>
          <View style={styles.modalMainView}>
            <View style={styles.modalTitleView}>
              <Text style={styles.modalTitle}>Raise your fair</Text>
              <Text style={styles.modalMessage}>
                We charge no commission. Full amount goes to the rider
              </Text>

              <Text style={styles.modalAmount}>{currencyFormat(total)}</Text>
              <Text style={styles.modalFairText}>
                You can also directly increase the fare
              </Text>
              <View style={styles.progessBarView}>
                <ProgressBarWithGradient progress={selectedCount} />
                <View style={styles.sliderView}>
                  <Slider
                    style={{ width: wp(90), height: hp(5) }}
                    minimumValue={0}
                    step={1}
                    maximumValue={5}
                    value={fireValue}
                    onValueChange={val => {
                      const fixedNum = Number(val?.toFixed(0));
                      // console.log('val---', fixedNum);
                      setTimeout(() => {
                        setFireValue(fixedNum);
                        if (fireValue < fixedNum) {
                          onPositive(fixedNum);
                        } else {
                          onNegative(fixedNum);
                        }
                      });
                    }}
                    // thumbImage={Image.resolveAssetSource(appImages.fareBtn)}
                    // thumbImage={appImages.fareBtn}
                    thumbTintColor="transparent" // Hide default thumb
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                  />
                  <Image
                    source={appImages.fareBtn}
                    style={{
                      width: 40,
                      height: 40,
                      position: 'absolute',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      top: -1,
                      left: (fireValue / 5) * wp(90) - 19, // Dynamically move thumb
                    }}
                    resizeMode="contain"
                  />
                </View>
                {/* <ProgressBarWithGradient progress={selectedCount} />
              <SvgXml
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  left: selectedWidth,
                }}
                xml={appImagesSvg.progessBarIcon}
              /> */}
              </View>

              <View style={styles.priceRenderView}>
                {priceArray?.map((item, i) => {
                  return (
                    <View>
                      <Text style={styles.priceText}>{item}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.btnPNView}>
                <SvgXml
                  onPress={() => {
                    onNegative('-10');
                  }}
                  width={30}
                  height={30}
                  xml={appImagesSvg.progessNegative}
                />
                <SvgXml
                  onPress={() => {
                    onPositive('+10');
                  }}
                  width={30}
                  height={30}
                  xml={appImagesSvg.progessPositive}
                />
              </View>
              <View style={{ marginTop: '10%' }}>
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
    </Wrapper>
  );
}
