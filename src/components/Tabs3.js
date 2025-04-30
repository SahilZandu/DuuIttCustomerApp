import react, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { appImages, appImagesSvg } from '../commons/AppImages';
import { screenHeight, screenWidth } from '../halpers/matrics';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';

const size = Dimensions.get('window').height;

export default function Tabs3({
  tabs,
  tabPress,
  isRating,
  isCount,
  showImage,
  type,
  imageHide,
}) {
  const scrollViewRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabPress = (index, text) => {
    setSelectedIndex(index);
    if (tabPress) tabPress(text);
  };

  useEffect(() => {
    // if (type == 'All Orders') {
    //   setSelectedIndex(0);
    // }
    if (type == 'Ride') {
      setSelectedIndex(1);
    } else if (type == 'Parcel') {
      setSelectedIndex(2);
    } else if (type == 'Food') {
      setSelectedIndex(3);
    }
    else {
      setSelectedIndex(0);
    }
  }, [type]);

  // console.log('type--selectedIndex', type, selectedIndex);

  const onSetImage = index => {
    switch (index) {
      case 1:
        return appImages.foodTab;
      case 2:
        return appImages.rideTab;
      case 3:
        return appImages.parcelTab;
      default:
        return appImages.foodTab;
    }
  };

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
        style={[styles.button(isSelected, index)]}
        onPress={() => {
          onPress(index, text);
        }}>
        {imageHide !== false && (
          <View>
            {(index != 0 || showImage) && (
              <Image
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: isSelected ? colors.main : colors.black85,
                }}
                source={onSetImage(index)}
              />
            )}
          </View>
        )}
        <Text
          style={[
            styles.tabtext,
            {
              color: !isSelected ? colors.black85 : colors.main,
              fontSize: isCount ? RFValue(10.5) : RFValue(13),
              marginLeft: isRating
                ? index != 0 || showImage
                  ? size / 130
                  : 0
                : 0,
            },
          ]}>
          {text}
          {isCount ? ' (' + count + ')' : ''}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{ backgroundColor: colors.appBackground, justifyContent: 'center' }}>
      <ScrollView
        bounces={false}
        ref={scrollViewRef}
        style={{ alignSelf: 'center', height: screenHeight(6) }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ minWidth: screenWidth(90) }}
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
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
  },
  button: (isSelected, index) => ({
    flexDirection: 'row',
    height: screenHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.appBackground,
    borderColor: isSelected ? colors.main : colors.appBackground,
    marginHorizontal: -3,
    borderBottomWidth: 2,
    marginLeft: index !== 0 ? '5%' : 0,
  }),
});
