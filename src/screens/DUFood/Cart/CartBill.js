import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {currencyFormat} from '../../../halpers/currencyFormat';
import {fonts} from '../../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';

const CartBill = ({appCart, billdetail, activeOffer}) => {
  const [cartTotal, setCartTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [pfee, setPfee] = useState(5);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (appCart && appCart?.cartitems) {
      const totalPrice = appCart?.cartitems.reduce((accumulator, item) => {
        return accumulator + Number(item.grand_total);
      }, 0);
      const gstPer = appCart?.orgdata?.gst_percentage;
      const discount =
        appCart?.coupon_amount && appCart?.coupon_amount > 0
          ? appCart?.coupon_amount
          : 0;
      const getTotal =
        discount && discount > 0 ? totalPrice - discount : totalPrice;
      const pFeees = appCart?.orgdata?.restaurant_charge;
      const gst = getTotal * Number(gstPer / 100);

      setDiscount(discount);
      setPfee(pFeees);
      setCartTotal(totalPrice);

      setTax(gst);
      const bill = {
        cartTotal: totalPrice,
        tax: gst,
        pfree: Number(pFeees),
        discount: discount,
        total: totalPrice + gst + Number(pFeees),
      };
      billdetail(bill);
    }
  }, [appCart]);

  const TextRow = ({title, value, isGrand}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3%',
          paddingHorizontal: 16,
        }}>
        <Text
          style={{
            color: '#838F9A',
            fontFamily: fonts.medium,
            fontSize: isGrand ? RFValue(14) : RFValue(12),
          }}>
          {title}
        </Text>
        <Text
          style={{
            color: 'black',
            fontFamily: fonts.medium,
            fontSize: isGrand ? RFValue(14) : RFValue(13),
          }}>
          {title == 'Discount' ? '-' : ''} {currencyFormat(value)}
        </Text>
      </View>
    );
  };

  return (
    <View style={{marginTop: '6%'}}>
      <Text
        style={{
          color: 'black',
          fontFamily: fonts.medium,
          fontSize: RFValue(13),
          marginLeft: 16,
        }}>
        Bill Details
      </Text>

      <TextRow title={'Cart total'} value={cartTotal} />
      {discount > 0 && <TextRow title={'Discount'} value={discount} />}
      <TextRow title={'Tax'} value={tax} />
      <TextRow title={'Restaurant charges'} value={pfee} />

      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          marginTop: '3%',
          borderColor: 'rgba(0, 0, 0, 0.15)',
          paddingBottom: '3%',
        }}>
        <TextRow
          isGrand={true}
          title={'Subtotal'}
          value={tax + cartTotal + Number(pfee) - discount}
        />
      </View>
    </View>
  );
};

export default CartBill;
