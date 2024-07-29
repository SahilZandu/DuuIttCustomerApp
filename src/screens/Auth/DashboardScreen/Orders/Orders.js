import React, {useEffect, useState, useRef} from 'react';
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

export default function Orders({navigation}) {
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      <DashboardHeader
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
      <Spacer space={'2%'} />
      <View style={styles.mainView}>
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
                data={ordersArray}
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
