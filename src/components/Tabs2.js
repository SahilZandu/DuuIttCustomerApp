import react, {useState, useRef, useEffect} from 'react';
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

export default function Tabs2({tabs, tabPress, isRating, isCount,title}) {
  const scrollViewRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleTabPress = (index, text) => {
    // console.log("index",index)
    setSelectedIndex(index);
    if (tabPress){ 
      tabPress(text)
    };
  }

  const onSetIndex =(title)=>{
    switch (title) {
        case 'Home':
          return 0;
        case 'Work':
          return 1;
        case 'Hotel':
          return 2;
          default :
          return 3;
      }

  }
  useEffect(()=>{
    if(title){
      setSelectedIndex(onSetIndex(title));
      if (tabPress){ 
        tabPress(title)
      };
    }
  },[title])

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
        {iconName && <Image
        resizeMode='contain'
        style={{
            width:18,height:18 
            ,tintColor:isSelected ?'#28B056':'#00000085'}} 
            source ={iconName}/>}
        <Text
          style={[
            styles.tabtext,
            {
              color: !isSelected ? '#00000085' : '#28B056',
              fontSize: isCount ? RFValue(10.5) : RFValue(11),
              marginLeft:size / 130 ,
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
        style={{alignSelf: 'center',height:hp("6%")}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{minWidth:wp("90")}}
        horizontal >
        {tabs?.map((tab, idx) => (
          <TabButton
            index={idx}
            text={tab.text}
            count={tab?.count}
            iconName={tab.icon}
            selectedIndex={selectedIndex}
            onPress={()=>{handleTabPress(idx, tab.text)}}
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
    fontFamily: fonts.regular,
    textAlign:"center",
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
    padding:wp("2.5%"),
  },

  selectedButton: {
    backgroundColor:colors.colorDo,
    borderColor:colors.main,
  },
});
