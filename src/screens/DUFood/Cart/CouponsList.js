import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {currencyFormat} from '../../../halpers/currencyFormat';
import Header from '../../../components/header/Header';
import {useFocusEffect} from '@react-navigation/native';
import {colors} from '../../../theme/colors';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import CouponDetail from '../Components/CouponDetail';

const couponsList = [
  {
    id: '1',
    percent: '20%',
    upTo: 75,
    referalCode: 'DuuItt1',
    status: 0,
    time: 3,
  },
  {
    id: '2',
    percent: '10%',
    upTo: 25,
    referalCode: 'DuuItt2',
    status: 0,
    time: 10,
  },
  {
    id: '3',
    percent: '15%',
    upTo: 55,
    referalCode: 'DuuItt3',
    status: 1,
    time: 5,
  },
  {
    id: '4',
    percent: '30%',
    upTo: 100,
    referalCode: 'DuuItt4',
    status: 0,
    time: 4,
  },
  // Add more restaurants as needed
];
const CouponsList = ({navigation, route}) => {
  const {restaurant} = route.params;

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [offerList, setOfferList] = useState(couponsList ?? []);
  const [activeOffer, setActiveOffer] = useState({});

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      onCheckIsSelected();
    }, []),
  );

  const onCheckIsSelected = () => {
    const newList = offerList?.map((item, i) => {
      if (item?.status == 1) {
        setActiveOffer(item);
        return {...item, status: 1};
      } else {
        return {...item, status: 0};
      }
    });
    setOfferList([...newList]);
  };

  const onSelectedItem = index => {
    const newOfferList = offerList?.map((item, i) => {
      if (i == index) {
        setActiveOffer(item);
        return {...item, status: 1};
      } else {
        return {...item, status: 0};
      }
    });
    setOfferList([...newOfferList]);
  };

  const renderCoupansItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          onSelectedItem(index);
          setVisible(true);
        }}>
        <View style={styles.mainRenderView}>
          <View style={styles.innerUpperView}>
            <View style={styles.mainViewImageBtn}>
              <Image style={styles.image} source={appImages.offerPercent} />
              <Text numberOfLines={1} style={styles.percentText}>
                Get {item?.percent} OFF up to{' '}
                {currencyFormat(Number(item?.upTo))}
              </Text>
            </View>
            <SvgXml
              width={18}
              height={18}
              xml={
                item?.status == 1
                  ? appImagesSvg.selectedRadioButton
                  : appImagesSvg.unSelectCheckBox
              }
            />
          </View>
          <Text style={styles.saveText}>
            Save {currencyFormat(Number(item?.upTo))} with this code
          </Text>
          <Text style={styles.referalCodeText}>{item?.referalCode}</Text>
        </View>
        <View
            style={styles.bottomLineView}/>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Coupons'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        style={{marginTop: '2%'}}
        data={offerList}
        renderItem={renderCoupansItem}
        keyExtractor={item => item?.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <CouponDetail
        onApply={() => {
          setVisible(false);
        }}
        item={activeOffer}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </View>
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
    justifyContent: 'center'
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
  referalCodeText: {
    marginLeft: '8%',
    borderRadius: 12,
    width: wp('24%'),
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
  bottomLineView:{
    backgroundColor: colors.colorD9,
    height: 1,
    margin: 20,
  }
});
