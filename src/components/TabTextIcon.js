import react, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {currencyFormat} from '../halpers/currencyFormat';
import { screenHeight, screenWidth } from '../halpers/matrics';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const size = Dimensions.get('window').height;

export default function TabTextIcon({tabs, tabPress, isRating}) {
  const scrollViewRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState('');

  const handleTabPress = (index, text) => {
    setSelectedIndex(index);
    if (tabPress) tabPress(text);
  };

  const TabButton = ({index, text, selectedIndex, onPress}) => {
    const isSelected = index === selectedIndex;

    return (
      <Pressable
        style={[styles.button, isSelected && styles.selectedButton]}
        onPress={() => {
          onPress(index, text);
        }}>
        <Text
          style={[
            styles.tabtext,
            {
              color: !isSelected ? colors.black85 :colors.main,
              fontFamily: fonts.regular,
              fontSize: RFValue(13),
            },
          ]}>
          {currencyFormat(Number(text))}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{flex: 0, marginTop: '3%', marginBottom: 0}}>
      <ScrollView
        bounces={false}
        ref={scrollViewRef}
        style={{alignSelf: 'center', height:screenHeight(6)}}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{minWidth:screenWidth(90)}}
        horizontal>
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
    height: screenHeight(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.colorD9,
    paddingHorizontal: '3%',
  },

  selectedButton: {
    backgroundColor:colors.colorD45,
    borderColor: colors.main,
  },
});
