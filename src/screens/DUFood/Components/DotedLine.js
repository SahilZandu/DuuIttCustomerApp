import React from 'react';
import {Pressable, Text,View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../../theme/colors';

// import { View } from 'react-native-reanimated/lib/typescript/Animated';



const DotedLine = ({marginTop}) => {
  return (
    <View
    style={{
      borderStyle: 'dashed',
      borderWidth: 0.5,
      marginTop:marginTop?marginTop:'5%',
      borderColor:colors.color83,
    }}></View>
  );
};

export default DotedLine;

