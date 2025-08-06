import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Image,
  FlatList,
  DeviceEventEmitter,
  Text,
  StyleSheet,
} from 'react-native';
import { appImages } from '../../../commons/AppImages';
import Header from '../../../components/header/Header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentLocation, setCurrentLocation } from '../../../components/GetAppLocation';
import { rootStore } from '../../../stores/rootStore';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../theme/fonts/fonts';
import { colors } from '../../../theme/colors';
import SearchButtonInputComp from '../../../components/SearchButtonInputComp';
import MikePopUp from '../../../components/MikePopUp';
import CategoryCard from '../../../components/Cards/CategoryCard';
import SearchCategoryCard from '../../../components/Cards/SearchCategoryCard';


export default function SearchFoodCategoryRest({ navigation }) {
  const {
    allDishCategory,
    allCategoryList,

  } = rootStore.foodDashboardStore;
  const searchTimeout = useRef(null);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [isKeyboard, setIskeyboard] = useState(false);
  const [categoryList, setCategoryList] = useState(allCategoryList ?? []);
  const [categoryListFilter, setCategoryListFilter] = useState(allCategoryList ?? []);
  const [loadingCategory, setLoadingCategory] = useState(
    allCategoryList?.length > 0 ? false : true,
  );

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      // getCategoryList()
    }, []),
  );

  useEffect(() => {
    if ((categoryList?.length == 0 || allCategoryList?.length == 0)) {
      getCategoryList()
    }
  }, [allCategoryList])

  const getCategoryList = async () => {
    // console.log('getCategoryList');
    const res = await allDishCategory(handleLoadingCatagory);
    // console.log("res---",res);
    setCategoryList(res);
    setCategoryListFilter(res)
  };
  const handleLoadingCatagory = v => {
    setLoadingCategory(v);
  };

  const onSuccessResult = item => {
    // console.log('item=== onSuccessResult', item);
    // setSearchRes(item);
    handleSearch(item)
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };

  const handleSearch = s => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setSearchRes(s);
    searchTimeout.current = setTimeout(() => {
      console.log('get res:--', s);
      if (s?.length > 0) {
        const resFilter = categoryListFilter?.filter(item =>
          item?.name?.toLowerCase().includes(s?.toLowerCase())
        );
        setCategoryList(resFilter);
      } else {
        setCategoryList([...categoryListFilter]);
      }
    }, 300);
  };


  return (
    <View style={styles.container}>
      <View style={{}}>
        <SearchButtonInputComp
          onBackPress={() => { navigation.goBack() }}
          value={searchRes}
          onChangeText={t => {
            handleSearch(t)
          }}
          onMicroPhone={() => {
            setVisible(true);
          }}
          onFocus={() => setIskeyboard(true)}
          onBlur={() => setIskeyboard(false)}
          onCancelPress={() => {
            // setSearchRes('');
            handleSearch('')
          }} />
      </View>
      {categoryList?.length > 0 ?
        <View style={styles.orderMainView}>
          <SearchCategoryCard data={categoryList} navigation={navigation} />
        </View>
        : <View style={styles.noDataView}>
          <Text style={styles.noDataText}>No data found</Text>
        </View>}

      <MikePopUp
        visible={visible}
        title={'Sorry! Didn’t hear that'}
        text={'Try saying restaurant name or a dish.'}
        onCancelBtn={onCancel}
        onSuccessResult={onSuccessResult}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  orderMainView: {
    justifyContent: 'center',
    marginTop: '2%'
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataText: {
    fontFamily: fonts.medium, fontSize: RFValue(13),
    color: colors.black
  }

});
