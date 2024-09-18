import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, View, KeyboardAvoidingView, FlatList} from 'react-native';
import {appImagesSvg, appImages} from '../../../../commons/AppImages';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import MikePopUp from '../../../../components/MikePopUp';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import {ordersArray} from '../../../../stores/DummyData/orders';
import Spacer from '../../../../halpers/Spacer';
import CardOrder from '../../../../components/CardOrder';
import Tabs from '../../../../components/Tabs';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import Tabs3 from '../../../../components/Tabs3';


const tabs = [
  {text: 'All Orders'},
  {text: 'Food'},
  {text: 'Ride'},
  {text: 'Parcel'},
];

let defaultType = 'All Orders';

export default function Orders({navigation}) {
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [orderList ,setOrderList]=useState(ordersArray)
  const [orderListP ,setOrderListp]=useState(ordersArray)


  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const hanldeSearch = async s => {
    console.log('get res:--', s);
  };

  const onSuccessResult = item => {
    console.log('item=== onSuccessResult', item);
    setSearchRes(item);
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const renderItem = ({item, i}) => {
    return (
      <>
        <CardOrder item={item} index={i} />
      </>
    );
  };


  const handleTabPress = async text => {
      defaultType = text;
       type = text 
    // const filter = await getOrderbyFilters(text);
    // // console.log("filter--",filter,defaultType,text)
    // setHis([...filter]);

    if (type == 'All Orders') {
      setOrderList(orderListP)
      // return orderListP;
    } else if (type == 'Food') {
      const filterList = orderListP?.filter(element =>
        element?.statusOrder?.includes('food'),
      );
      setOrderList(filterList)
      // return filterList;
    } 
    else if (type == 'Ride') {
      const filterList = orderListP?.filter(element =>
        element?.statusOrder?.includes('ride'),
      );
      setOrderList(filterList)
      // return filterList;
    }
     else if (type == 'Parcel') {
      const filterList = orderListP?.filter(element =>
        element?.statusOrder?.includes('parcel'));
        setOrderList(filterList)
      // return filterList;
    }


  };


  return (
    <View style={styles.container}>
       
      <DashboardHeader
         navigation={navigation}
        title={'Home'}
        autoFocus={isKeyboard}
        onPressSecond={() => {
          // alert('second');
        }}
        secondImage={appImagesSvg.cartIcon}
        value={searchRes}
        onChangeText={t => {
          setSearchRes(t);
          if (t) {
            hanldeSearch(t);
          }
        }}
        onMicroPhone={() => {
          setVisible(true);
        }}
        onFocus={() => setIskeyboard(true)}
        onBlur={() => setIskeyboard(false)}
        onCancelPress={() => {
          setSearchRes('');
        }}
      />
      <View style={styles.mainView}>
      <Tabs3 isRating={true} tabs={tabs} 
            tabPress={handleTabPress}
             />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
          
            <View style={styles.offerTextView}>
              <Text style={styles.offerText}>Offers You Can’t Miss</Text>
            </View>
            <View style={{flex: 1}}>
              <FlatList
                contentContainerStyle={{paddingBottom: '30%'}}
                nestedScrollEnable={true}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={orderList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          </AppInputScroll>
        </KeyboardAvoidingView>
      </View>
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
