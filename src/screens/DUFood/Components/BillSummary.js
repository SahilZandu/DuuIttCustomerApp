import React from 'react';
import {View, Modal, Pressable, Text, ScrollView, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import DotedLine from './DotedLine';
import { currencyFormat } from '../../../halpers/currencyFormat';

const BillSummary = ({visible,cartBillG, onClose, menu, onSelectMenu}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <>
        <Pressable
          onPress={() => onClose()}
          style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)'}}></Pressable>
      </>
      <Pressable
        onPress={() => onClose()}
        style={{
          alignItems: 'center',
          position: 'absolute',
          zIndex: 1,
          alignSelf: 'center',
          marginTop: Platform.OS == 'android' ? hp('45%') : hp('38%'),
        }}>
        <SvgXml xml={appImagesSvg.CROSS} />
      </Pressable>
      <View
        style={{
          // backgroundColor: '#F9BD00',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: Platform.OS == 'android' ? 0 : '6%',

          width: wp('100%'),
          height: hp('50%'),
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
          borderColor: '#F9BD00',
          paddingTop: '5%',
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '10%'}}>
          <View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.bold,
                fontSize: RFValue(15),
                padding: 10,
                color: '#000',
              }}>
              Bill Summary
            </Text>

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  maxWidth: wp('55%'),
                  color: '#646464',
                }}>
                Item total
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: '#646464',
                }}>
               
  
                {currencyFormat(cartBillG.cartTotal)}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  maxWidth: wp('55%'),
                  color: '#646464',
                }}>
                Delivery Fee
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: '#646464',
                }}>
                    
                {currencyFormat(cartBillG.deliveryFree)}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  maxWidth: wp('55%'),
                  color: '#646464',
                }}>
                Platform fee
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: '#646464',
                }}>
                  
                {currencyFormat(cartBillG.platformFree)}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  maxWidth: wp('55%'),
                  color: '#646464',
                }}>
                GST and Restaurant Charges
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: '#646464',
                }}>
                   
                {currencyFormat(cartBillG.gstRestorentCharges)}
              </Text>
            </View>
            <View style={{paddingHorizontal: 16}}>
              <DotedLine />
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  maxWidth: wp('55%'),
                  color: '#646464',
                }}>
                Grand Total
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: '#000',
                }}>
                  
                {currencyFormat(cartBillG.grandTotal)}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  maxWidth: wp('55%'),
                  color: '#28B056',
                }}>
                Restaurant Coupon- (DUIT75)
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: '#28B056',
                }}>
                
    {currencyFormat(cartBillG.couponDiscount)}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  maxWidth: wp('55%'),
                  color: '#646464',
                }}>
                To Pay
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: '#000',
                }}>
                    
                {currencyFormat(cartBillG.topay)}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                margin: '4%',
                borderRadius: 20,
                padding: 10,
                backgroundColor: '#D6FFE4',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <SvgXml xml={appImagesSvg.party} />
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(13),
                  marginLeft: 6,
                  color: '#28B056',
                }}>
                You saved ₹10 on this order
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default BillSummary;

const close = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M12 4L4 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 4L12 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
