import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../theme/fonts/fonts';
import { appImages, appImagesSvg } from '../../../commons/AppImages';
import { currencyFormat } from '../../../halpers/currencyFormat';
import Header from '../../../components/header/Header';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import CouponDetail from '../Components/CouponDetail';
import { rootStore } from '../../../stores/rootStore';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import { Wrapper } from '../../../halpers/Wrapper';

const CouponsList = ({ navigation, route }) => {
  const { restaurant, selectedOffers, onCoupanSelected, couponList, getCartTotal } = route.params;
  const { getRestaurantOffers } = rootStore.dashboardStore;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [offerList, setOfferList] = useState(couponList ?? []);
  const [activeOffer, setActiveOffer] = useState(selectedOffers ?? {});

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      // onCheckIsSelected();
      if (selectedOffers && couponList?.length > 0) {
        setOfferList(couponList)
        onSelectedItem(selectedOffers)
      } else {
        getRestaurantOffersData();
      }
    }, [couponList, selectedOffers]),
  );

  console.log("getCartTotal--", getCartTotal);

  const getRestaurantOffersData = async () => {
    const restaurantCoupans = await getRestaurantOffers(
      handleLoading,
    );
    if (restaurantCoupans?.length > 0) {
      console.log('restaurantCoupans--', restaurantCoupans);
      setOfferList(restaurantCoupans);
      onCheckIsSelected(restaurantCoupans);
      onSelectedItem(selectedOffers ?? restaurantCoupans[0])
    } else {
      setOfferList([]);
    }
  };

  const handleLoading = v => {
    console.log('v----', v);
    setLoading(v);
  };

  const onCheckIsSelected = offersList => {
    const newList = offersList?.map((item, i) => {
      if (item?.status == 1) {
        setActiveOffer(item);
        return { ...item, status: 1 };
      } else {
        return { ...item, status: 0 };
      }
    });
    setOfferList([...newList]);
  };

  const onSelectedItem = (data) => {
    console.log("offerList---", offerList, data);
    const newOfferList = offerList?.map((item, i) => {
      if (item?._id == data?._id) {
        setActiveOffer(item);
        return { ...item, status: true };
      } else {
        return { ...item, status: false };
      }
    });
    setOfferList([...newOfferList]);
  };

  const renderCoupansItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          onSelectedItem(item);
          setVisible(true);
        }}>
        <View style={styles.mainRenderView}>
          <View style={styles.innerUpperView}>
            <View style={styles.mainViewImageBtn}>
              <Image style={styles.image} source={appImages.offerPercent} />
              <Text numberOfLines={1} style={styles.percentText}>
                Get{' '}
                {item?.discount_type === 'percentage'
                  ? `${item?.discount_price}%`
                  : currencyFormat(Number(item?.discount_price))}{' '}
                OFF up to {currencyFormat(Number(item?.usage_conditions?.min_order_value))}
              </Text>
            </View>
            <SvgXml
              width={18}
              height={18}
              xml={
                item?.status == true
                  ? appImagesSvg.selectedRadioButton
                  : appImagesSvg.unSelectCheckBox
              }
            />
          </View>
          <Text style={styles.saveText}>
            Save{' '}
            {currencyFormat(Number(item?.discount_price ?? item?.discount))}{' '}
            with this code
          </Text>
          {item?.title?.length !== 0 && <Text style={styles.titleText}>
          {item?.title}
          </Text>}
          <Text style={styles.referalCodeText}>
            {item?.referral_code}
          </Text>
        </View>
        <View style={styles.bottomLineView} />
      </TouchableOpacity>
    );
  };

  return (
     <Wrapper
            edges={['left', 'right']}
            transparentStatusBar
            title={'Coupons'}
            backArrow={true}
            onPress={() => {
              navigation.goBack();
            }}
            showHeader
          >
    <View style={styles.container}>
      {/* <Header
        title={'Coupons'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
      {/* coupansListLoader */}
      {loading ? (
        <AnimatedLoader type={'coupansListLoader'} />
      ) : (
        <View style={{ flex: 1 }}>
          {offerList?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ marginTop: '2%' }}
              data={offerList}
              renderItem={renderCoupansItem}
              keyExtractor={item => item?.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.NoDataView}>
              <Text style={styles.NoDataText}>No Record Found</Text>
            </View>
          )}
        </View>
      )}
      <CouponDetail
        onApply={() => {
          onCoupanSelected(activeOffer);
          setVisible(false);
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        }}
        selectedData={selectedOffers}
        item={activeOffer}
        getCartTotal={getCartTotal}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </View>
    </Wrapper>
  );
};

export default CouponsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  listContainer: {
    paddingBottom: '10%',
  },
  mainRenderView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  innerUpperView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainViewImageBtn: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 20,
    height: 20,
  },
  percentText: {
    fontFamily: fonts.semiBold,
    fontSize: RFValue(15),
    color: colors.black,
    marginLeft: '4%',
    width: wp('74%'),
  },
  saveText: {
    color: colors.main,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    marginLeft: '8%',
    marginTop: '2%',
  },
  titleText: {
    color: colors.black85,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    marginLeft: '8%',
    marginTop: '2%',
  },
  referalCodeText: {
    marginLeft: '8%',
    borderRadius: 12,
    width: wp('30%'),
    marginTop: '3%',
    textAlign: 'center',
    color: colors.colorAF,
    borderColor: colors.colorAF,
    borderWidth: 1,
    paddingVertical: '0.5%',
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.colorAF,
  },
  bottomLineView: {
    backgroundColor: colors.colorD9,
    height: 1,
    margin: 20,
  },
  NoDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  NoDataText: {
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
