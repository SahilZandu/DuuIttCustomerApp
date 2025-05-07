import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import {
  termsAndConditionsLink,
  privacyPolicyLink,
} from '../../../halpers/AppLink';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import Header from '../../../components/header/Header';
import { colors } from '../../../theme/colors';
import { styles } from './styles';



export default function MyWebComponent({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const { type } = route?.params;

  const link = type == 'policy' ? privacyPolicyLink : termsAndConditionsLink;

  useEffect(() => {
    handleAndroidBackButton(navigation);
  }, []);

  return (
    <View style={styles.container}>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
        backArrow={true}
        title={type == 'policy' ? 'Privacy Policy' : 'Terms & Conditions'}
      />
      {loading && (
        <View
          style={styles.loaderView}>
          <ActivityIndicator style={{
            marginTop:
              Platform.OS === 'ios' ?
                hp('-20%') : hp('-10%')
          }} size="large" color={colors.main} />
        </View>
      )}
      <View style={styles.webMainView}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: link }}
          onLoadStart={item => {
            setLoading(true);
          }}
          onLoadEnd={item => {
            setLoading(false);
          }}
        />
      </View>
    </View>
  );
}
