import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, TouchableOpacity, View, Image, Dimensions,KeyboardAvoidingView,} from 'react-native';
import {appImagesSvg, appImages} from '../../../../commons/AppImages';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import MikePopUp from '../../../../components/MikePopUp';
import {styles} from './styles';
import {SvgXml} from 'react-native-svg';
import {homeCS} from '../../../../stores/DummyData/Home';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import RenderOffer from '../../../../components/RenderOffer';
import { fonts } from '../../../../theme/fonts/fonts';
import { colors } from '../../../../theme/colors';
import { offerArray } from '../../../../stores/DummyData/Offers';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';



export default function Promo({navigation}) {

  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);

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
       <KeyboardAvoidingView
          style={{flex: 1,marginTop:'1.5%'}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
          <AppInputScroll
            padding={true}
            keyboardShouldPersistTaps={'handled'}>
             <View style={styles.offerTextView}>
              <Text style={styles.offerText}>Offers You Can’t Miss</Text>
             </View>
              <RenderOffer data={offerArray}/>
    
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
