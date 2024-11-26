import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import {colors} from '../../../../../theme/colors';
import {Surface} from 'react-native-paper';
import {currencyFormat} from '../../../../../halpers/currencyFormat';
import BTN from '../../../../../components/cta/BTN';
import Spacer from '../../../../../halpers/Spacer';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../../../theme/fonts/fonts';
import DotTextComp from '../../../../../components/DotTextComp';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../../../../../commons/AppImages';
import moment from 'moment';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

const VouchersDetails = ({navigation, route}) => {
  const {item} = route.params;
  console.log('item--', item);
  const [vouchersItem, setVouchresItem] = useState(item);
  const exampleDate = new Date(); // Current date

  const formatDate = date => {
    return moment(date).format('Do MMM.');
  };

  useEffect(() => {
    setTimeout(() => {
      setVouchresItem(item);
    }, 300);
  }, [item]);

  let vochersInstDetails = [
    {
      id: 1,
      title: `₹${vouchersItem?.walletPrice} in your wallet`,
      amount: 0,
    },
    {
      id: 2,
      title: `${vouchersItem?.coupons} Food Coupons (${
        vouchersItem?.validdate
      } ${formatDate(item?.expiryDate)})`,
      amount: 0,
    },
    {
      id: 3,
      title: 'This offer is applicable to all users.',
      amount: 0,
    },
  ];
  return (
    <View style={styles.main}>
      <Header
        backArrow={true}
        title={'Vouchers Details'}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.upperMainView}>
          <Surface elevation={3} style={styles.surfaceView}>
            <View style={styles.innerView}>
              <Text style={styles.discountText}>
                {vouchersItem?.discount}
                <Text style={{fontSize: RFValue(18)}}>%</Text>
              </Text>
              <Text style={styles.offText}>off</Text>
            </View>
          </Surface>
          <View style={styles.detailsView}>
            <Text style={styles.detailsText}>Details</Text>
            {vochersInstDetails?.map((item, i) => {
              return (
                <View style={{marginHorizontal: -10}}>
                  <DotTextComp
                    title={item?.title}
                    index={i}
                    data={vochersInstDetails}
                    amount={item?.amount}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </AppInputScroll>
      <View style={styles.bottomButtonView}>
        <Surface elevation={3} style={styles.bottomBtnSurface}>
          <View style={styles.bottomInnerView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('paymentMethod');
              }}
              activeOpacity={0.8}
              style={styles.paymentModeTouch}>
              <SvgXml xml={appImagesSvg.googlePay} />
              <Text numberOfLines={1} style={styles.paymentTitle}>
                Google Pay
              </Text>
              <SvgXml
                style={{marginLeft: '2%'}}
                xml={appImagesSvg.greenBottomArrow}
              />
            </TouchableOpacity>

            <View style={styles.buyBtnView}>
              <BTN
                width={wp('45%')}
                title={'Buy Now'}
                onPress={() => {
                  navigation.navigate('paymentMethod');
                }}
              />
            </View>
          </View>
        </Surface>
      </View>
    </View>
  );
};

export default VouchersDetails;
