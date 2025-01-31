import React from 'react';
import {
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import DotedLine from './DotedLine';
import {currencyFormat} from '../../../halpers/currencyFormat';
import {colors} from '../../../theme/colors';
import TextRender from '../../../components/TextRender';

const BillSummary = ({visible, cartBillG, onClose, menu, onSelectMenu}) => {
  const billDetails = [
    {
      id: '1',
      name: 'Item Total',
      price: 400,
      coupanCode: '',
      bottomLine: false,
    },
    {
      id: '2',
      name: 'Delivery Fee',
      price: 40,
      coupanCode: '',
      bottomLine: false,
    },
    {
      id: '3',
      name: 'Platform fee',
      price: 10,
      coupanCode: '',
      bottomLine: false,
    },
    {
      id: '4',
      name: 'GST and Restaurant Charges',
      price: 20.86,
      coupanCode: '',
      bottomLine: true,
    },
    {
      id: '5',
      name: 'Grand Total',
      price: 543.6,
      coupanCode: '',
      bottomLine: false,
    },
    {
      id: '6',
      name: 'Restaurant Coupon',
      price: 100,
      coupanCode: 'DUIT75',
      bottomLine: false,
    },
    {
      id: '1',
      name: 'To Pay',
      price: 395.18,
      coupanCode: '',
      bottomLine: false,
    },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <Pressable
        //  onPress={() => onClose()}
        style={styles.container}>
        <Pressable onPress={() => onClose()} style={styles.backButtonTouch}>
          <Image
            resizeMode="contain"
            style={{height: 45, width: 45}}
            source={appImages.crossClose} // Your icon image
          />
        </Pressable>
        <View style={styles.mainWhiteView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: '10%'}}>
            <View style={styles.scrollInnerView}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.bold,
                  fontSize: RFValue(15),
                  // padding: 10,
                  color: colors.black,
                }}>
                Bill Summary
              </Text>

              {billDetails?.map((item, i) => {
                return (
                  <View style={styles.billDetailRenderView}>
                    <TextRender
                      titleStyle={[
                        styles.titleText,
                        {
                          color:
                            item?.coupanCode?.length > 0
                              ? colors.main
                              : colors.color64,
                        },
                      ]}
                      valueStyle={[
                        styles.valueText,
                        {
                          color:
                            item?.coupanCode?.length > 0
                              ? colors.main
                              : colors.color64,
                        },
                      ]}
                      title={
                        item?.coupanCode?.length > 0
                          ? item?.name + '- (' + item?.coupanCode + ')'
                          : item?.name
                      }
                      value={currencyFormat(Number(item?.price))}
                      bottomLine={false}
                    />
                    {i == 3 && <DotedLine />}
                  </View>
                );
              })}

              <View style={styles.btnView}>
                <SvgXml xml={appImagesSvg.party} />
                <Text numberOfLines={1} style={styles.btnText}>
                  You saved ₹10 on this order
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default BillSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  backButtonTouch: {
    alignItems: 'center',
    zIndex: 1,
    alignSelf: 'center',
    marginBottom: '3%',
  },
  mainWhiteView: {
    backgroundColor: colors.white,
    height: hp('50%'),
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: colors.colorF9,
    paddingTop: '3%',
  },
  scrollInnerView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  billDetailRenderView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    color: colors.color64,
  },
  valueText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(14),
    color: colors.color64,
  },
  btnView: {
    paddingHorizontal: 16,
    marginTop: '5%',
    borderRadius: 10,
    height: hp('5.5%'),
    backgroundColor: colors.colorD6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    marginLeft: '3%',
    color: colors.main,
  },
});
