import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {WebView} from 'react-native-webview';
import {
  termsAndConditionsLink,
  privacyPolicyLink,
} from '../../../halpers/AppLink';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import Header from '../../../components/header/Header';
import { colors } from '../../../theme/colors';

export default function MyWebComponent({navigation, route}) {
  const [loading, setLoading] = useState(true);
  const {type} = route?.params;

  const link = type == 'policy' ? privacyPolicyLink : termsAndConditionsLink;

  useEffect(() => {
    handleAndroidBackButton(navigation);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor:colors.appBackground,}}>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
        backArrow={true}
        title={type == 'policy' ? 'Privacy Policy' : 'Terms & Conditions'}
      />
      {loading && (
        <View
          style={{
            height: hp('100%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}
      <View style={{flex: 1,}}>
        <WebView
          style={{flex: 1}}
          source={{uri: link}}
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
