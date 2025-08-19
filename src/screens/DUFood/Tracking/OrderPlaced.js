import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fonts } from '../../../theme/fonts/fonts';
import { appImages } from '../../../commons/AppImages';
import { colors } from '../../../theme/colors';
import FoodSlider from '../../../components/slider/foodSlider';
import { silderArrayOrder } from '../../../stores/DummyData/Home';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import AppInputScroll from '../../../halpers/AppInputScroll';
import BTN from '../../../components/cta/BTN';
import Spacer from '../../../halpers/Spacer';
import { rootStore } from '../../../stores/rootStore';
import { useFocusEffect } from '@react-navigation/native';

export default function OrderPlaced({ navigation, route }) {
  const { orderData } = route.params;
  const { cancelFoodOrderByCustomer } = rootStore.foodDashboardStore;
  const [sliderItems, setSliderItems] = useState(silderArrayOrder);
  const [loading, setLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState(orderData ?? {})


  useFocusEffect(
    useCallback(() => {
      // handleAndroidBackButton();
      handleAndroidBackButton('', 'food', 'food', navigation);
      setOrderDetails(orderData)
    }, []),
  );


  const onCancelFoodOrder = async () => {
    await cancelFoodOrderByCustomer(orderData, navigation, handleLoading)
  }

  const handleLoading = (v) => {
    setLoading(v)
  }


  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('foodOrderUpdate', data => {
      console.log('foodOrderUpdate data -- ', data);
      if (data?.order_type == 'food') {
        setOrderDetails(data)
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);


  return (
    <View style={styles.conatiner}>
      <AppInputScroll
        padding={true}
        Pb={'1%'}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.innerMainView}>
          <View style={styles.imageTextBtnView}>
            <Image style={styles.image} source={appImages.orderPlaced} />
            <Text style={styles.orderPlacedText}>Order Placed</Text>
            <Text style={styles.yourOrderText}>
              Your order has been successfully placed and your items are on the
              way to you
            </Text>
            <Spacer space={'10%'} />
            {/* {orderDetails?.status == 'waiting_for_confirmation' &&
              <> */}
            <BTN
              // disable={orderDetails?.rider?._id?.length > 0 ? true : false}
              textTransform={'auto'}
              title={orderDetails?.status === "waiting_for_confirmation" ? 'Cancel with full refund' : "Cancel with no refund"}
              onPress={() => {
                onCancelFoodOrder();
                //navigation.navigate('trackingFoodOrderList');
              }}
              loading={loading}
            />
            <Spacer space={'5%'} />
            {/* </>} */}
            <BTN
              backgroundColor={colors.white}
              borderColor={colors.green}
              labelColor={colors.green}
              title={'Track Your Order'}
              onPress={() => {
                navigation.navigate('trackingFoodOrderList');
              }}
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('food', { screen: 'home' });
              }}
              activeOpacity={0.8}>
              <Text style={styles.backToHomeText}>Back to home</Text>
            </TouchableOpacity>
          </View>
          <View
            style={styles.bottomSliderView}>
            <View
              style={styles.bottomMainSlider}>
              <FoodSlider
                data={sliderItems}
                oneCard={true}
                imageWidth={wp('90%')}
                imageHeight={hp('18%')}
              />
            </View>
          </View>
        </View>
      </AppInputScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  innerMainView: {
    justifyContent: 'center',
    marginTop: hp('25%'),
  },
  imageTextBtnView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: hp('20%'),
  },
  orderPlacedText: {
    fontFamily: fonts.semiBold,
    fontSize: RFValue(20),
    marginTop: 20,
    color: colors.black,
    textAlign: 'center',
  },
  yourOrderText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(12),
    marginTop: '3%',
    color: colors.black65,
    textAlign: 'center',
  },
  backToHomeText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    marginTop: '5%',
    color: colors.black85,
    textDecorationLine: 'underline',
  },
  bottomSliderView: {
    marginTop: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomMainSlider: {
    alignContent: 'center',
  }
});
