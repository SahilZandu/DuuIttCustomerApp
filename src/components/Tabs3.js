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
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';


const size = Dimensions.get('window').height;

export default function Tabs3({tabs, tabPress, isRating, isCount,showImage}) {
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
          styles.button(isSelected)
        ]}
        onPress={() => {
          onPress(index, text);
        }}>
        {(index != 0 || showImage) && <Image 
         resizeMode='contain'
        style={{
            width:20,height:20 
            ,tintColor:isSelected ? colors.main :colors.black85}} 
            source ={onSetImage(index)}/>}
        <Text
          style={[
            styles.tabtext,
            {
              color: !isSelected ? colors.black85 : colors.main,
              fontSize: isCount ? RFValue(10.5) : RFValue(13),
              marginLeft: isRating ? (index != 0 || showImage) ? size / 130 : 0 : 0,
            },
          ]}>
          {text}
          {isCount ? ' (' + count + ')' : ''}
        </Text>
      </Pressable>
    );
  };



  return (
    <View style={{flex:0, marginTop: '3%', marginBottom:0}}>
      <ScrollView
        bounces={false}
        ref={scrollViewRef}
        style={{alignSelf: 'center',height:hp("6%")}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{minWidth:wp("90")}}
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
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
  },
  button:(isSelected)=>({
    flexDirection: 'row',
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.white,
    borderColor:isSelected ? colors.main :colors.white,
    marginHorizontal: -3,
    borderBottomWidth: 2,
    padding:wp("3%"),
  }),


});
