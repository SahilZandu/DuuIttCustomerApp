import React from 'react';
import {Text, View, Linking, Pressable} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';


const LinkText = ({text, link, marginTop}) => (
  <View style={{alignItems: 'center'}}>
    <Pressable
      style={{marginTop: marginTop ? marginTop : '5%', padding: 5}}
      onPress={() => Linking.openURL(link)}>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: RFValue(12),
          alignSelf: 'center',
          color: '#8F8F8F',
          textDecorationLine: 'underline',
        }}>
        {text}
      </Text>
    </Pressable>
  </View>
);

export default LinkText;
