import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import {
  termsAndConditionsLink,
  privacyPolicyLink,
  openSourceyLink,
} from '../../../halpers/AppLink';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import Header from '../../../components/header/Header';
import { colors } from '../../../theme/colors';
import { styles } from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { Wrapper } from '../../../halpers/Wrapper';



export default function MyWebComponent({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const { type } = route?.params;

  let link = type == 'policy' ? privacyPolicyLink : type == 'terms' ? termsAndConditionsLink : openSourceyLink;

  useEffect(() => {
    if (type == 'policy') {
      link = privacyPolicyLink
    } else if (type == 'terms') {
      link = termsAndConditionsLink
    } else {
      link = openSourceyLink
    }
  }, [type])

  const setHeaderText = (type) => {
    switch (type) {
      case 'policy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms & Conditions'
      default:
        return 'Open Source Library';
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, [])
  )

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      onPress={() => {
        navigation.goBack();
      }}
      backArrow={true}
      title={setHeaderText(type)}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
        onPress={() => {
          navigation.goBack();
        }}
        backArrow={true}
        title={setHeaderText(type)}
      /> */}
        {loading && (
          <View
            style={styles.loaderView}>
            <ActivityIndicator style={{
              marginTop:
                Platform.OS === 'ios' ?
                  hp('-20%') : hp('-10%')
            }}
            size="large" color={colors.main} />
          </View>
        )}
        <View style={styles.webMainView}>
          <WebView
            style={{ flex: 1 }}
            source={{ uri: link }}
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
          />
        </View>
      </View>
    </Wrapper>
  );
}


