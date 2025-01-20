import React from 'react';
import {Pressable, Text,View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import { View } from 'react-native-reanimated/lib/typescript/Animated';



const DotedLine = () => {
  return (
    <View
    style={{
      borderStyle: 'dashed',
      borderWidth: 0.5,
      marginTop: 20,
      borderColor: '#838282',
    }}></View>
  );
};

export default DotedLine;

