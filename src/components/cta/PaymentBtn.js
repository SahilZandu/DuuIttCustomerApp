import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform
  } from 'react-native';
import {colors} from '../../theme/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../theme/fonts/fonts';
import { Surface } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../../commons/AppImages';
import BTN from './BTN';


const PaymentBtn = ({
    onPressPay,payText,onPressBuyNow,buyNowText,disable
}) => (
    <View style={styles.bottomButtonView}>
    <Surface elevation={3} style={styles.bottomBtnSurface}>
      <View style={styles.bottomInnerView}>
        <TouchableOpacity
          onPress={onPressPay
        //     () => {
        //     // navigation.navigate('paymentMethod');
        //   }
        }
          activeOpacity={0.8}
          style={styles.paymentModeTouch}>
          <SvgXml xml={appImagesSvg.googlePay} />
          <Text numberOfLines={1} style={styles.paymentTitle}>
            {payText}
          </Text>
          <SvgXml
            style={{marginLeft: '2%'}}
            xml={appImagesSvg.greenBottomArrow}
          />
        </TouchableOpacity>

        <View style={styles.buyBtnView}>
          <BTN
          disable={disable}
            width={wp('45%')}
            title={buyNowText}
            onPress={
                onPressBuyNow
            //     () => {
            //   // navigation.navigate('paymentMethod');
            // }
        }
          />
        </View>
      </View>
    </Surface>
  </View>
);

export default PaymentBtn;

const styles =StyleSheet.create({
    bottomButtonView: {
        position: 'absolute',
        bottom: '-0.4%',
        backgroundColor: colors.white,
      },
      bottomBtnSurface: {
        shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
        backgroundColor: colors.white,
        alignSelf: 'center',
        borderRadius: 10,
        width: wp('100%'),
        height: hp('9%'),
        borderWidth: 0.5,
        borderColor: colors.colorD9,
      },
      bottomInnerView: {
        flexDirection: 'row',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      paymentModeTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('46%'),
        height: hp('6%'),
        marginTop: hp('1.5%'),
      },
      paymentTitle: {
        marginLeft: '5%',
        fontSize: RFValue(13),
        fontFamily: fonts.bold,
        maxWidth: wp('24%'),
      },
      buyBtnView: {
        justifyContent: 'center',
        marginTop: hp('4%'),
      },
})
