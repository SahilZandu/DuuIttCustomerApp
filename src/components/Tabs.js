import react, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Image
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import { appImages, appImagesSvg } from '../commons/AppImages';
import { screenHeight, screenWidth } from '../halpers/matrics';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';


const size = Dimensions.get('window').height;

export default function Tabs({tabs, tabPress, isRating, isCount,showImage,imageHide}) {
  const scrollViewRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabPress = (index, text) => {
    setSelectedIndex(index);
    if (tabPress) tabPress(text);
  };

  const onSetImage =(index)=>{
    switch (index) {
        case 1:
          return appImages.foodTab;
        case 2:
          return appImages.rideTab;
        case 3:
          return appImages.parcelTab;
          default :
          return appImages.foodTab;
      }

  }

  const TabButton = ({
    index,
    text,
    iconName,
    selectedIndex,
    onPress,
    count,
  }) => {
    const isSelected = index === selectedIndex;

    return (
      <Pressable
        style={[
          styles.button,
          isSelected && styles.selectedButton,
        ]}
        onPress={() => {
          onPress(index, text);
        }}>
        {imageHide == false && <>
        {(index != 0 || showImage) && <Image 
         resizeMode='contain'
        style={{
            width:20,height:20 
            ,tintColor:isSelected ?colors.main :colors.black85}} 
            source ={onSetImage(index)}/>}
          </>}
        <Text
          style={[
            styles.tabtext,
            {
              color: !isSelected ? colors.black85 : colors.main,
              fontFamily: fonts.medium,
              fontSize: isCount ? RFValue(10.5) : RFValue(11),
              marginLeft: isRating ? (index != 0 || showImage) ? size / 130 : 0 : 0,
            },
          ]}>
          {text}
          {isCount ? ' (' + count + ')' : ''}
        </Text>
        {(isRating && isSelected) && (
          <SvgXml
          style={{marginLeft:2}}
            xml={appImagesSvg.greenCrossSvg}
          />
         )} 
      </Pressable>
    );
  };



  return (
    <View style={{flex:0, marginTop: '3%', marginBottom:0}}>
      <ScrollView
        bounces={false}
        ref={scrollViewRef}
        style={{alignSelf: 'center',height:screenHeight(6)}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingRight:wp('50%')}}
        horizontal >
        {tabs?.map((tab, idx) => (
          <TabButton
            index={idx}
            text={tab.text}
            count={tab?.count}
            iconName={tab.iconName}
            selectedIndex={selectedIndex}
            onPress={handleTabPress}
            key={'tab-' + idx}
          />
        ))}
      </ScrollView>
     
    </View>
  );
}

const styles = StyleSheet.create({
  tabtext: {
    fontSize: RFValue(12),
  },
  button: {
    flexDirection: 'row',
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor:colors.colorD9,
    paddingHorizontal:'6%',
  },

  selectedButton: {
    backgroundColor:colors.colorDo,
    borderColor:colors.main,
  },
});
