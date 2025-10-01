import React from 'react';
import { View } from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';

const AppInputScroll = ({ children, padding, Pb, nestedScrollEnabled, bounces, ...otherProps }) => (
  <InputScrollView
    horizontal={false}
    nestedScrollEnabled={nestedScrollEnabled}
    bounces={bounces ?? true}
    keyboardOffset={150}
    useAnimatedScrollView={true}
    style={{ flex: 1 }}
    contentContainerStyle={{
      paddingBottom: Pb ? Pb : '15%',
      paddingHorizontal: padding ? 0 : 40,
      flexGrow: 1,
    }}
    showsVerticalScrollIndicator={false}
    {...otherProps}
  >
    {children}
  </InputScrollView>
);

export default AppInputScroll;
