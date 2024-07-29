import React, {useEffect, useState, useRef} from 'react';
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
import {fonts} from '../../../../theme/fonts/fonts';
import {colors} from '../../../../theme/colors';
import ChangeRoute from '../../../../components/ChangeRoute';
import {mainArray} from '../../../../stores/DummyData/Home';
import HomeSlider from '../../../../components/slider/homeSlider';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import RenderOffer from '../../../../components/RenderOffer';



let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];




export default function Home({navigation}) {


  const [sliderItems, setSliderItems] = useState(imageArray);
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

 
  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}> Under Processing .... </Text> */}
    
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
      <View style={styles.mainView}>
       <KeyboardAvoidingView
          style={{flex: 1,marginTop:'1.5%'}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
          <AppInputScroll
            padding={true}
            keyboardShouldPersistTaps={'handled'}>

        <ChangeRoute data={homeCS} />

        <HomeSlider data={sliderItems}/>

          <RenderOffer data={mainArray}/>

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
