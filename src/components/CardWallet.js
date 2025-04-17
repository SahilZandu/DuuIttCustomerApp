// import React, {useEffect, useRef, useState} from 'react';
// import {
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   View,
//   Text,
// } from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {colors} from '../theme/colors';
// import {fonts} from '../theme/fonts/fonts';
// import {currencyFormat} from '../halpers/currencyFormat';
// import {Surface} from 'react-native-paper';
// import moment from 'moment';
// import { appImages } from '../commons/AppImages';

// const CardWallet = ({item, index}) => {

//   const dateTimeFormat = createdAt => {
//     const date = new Date(createdAt);
//     const formattedDate = moment(date).format('MMM DD, YYYY - hh:mm A');
//     // console.log('formattedDate--', formattedDate); // Output: Jul 25, 2024 - 10:30 AM
//     return formattedDate;
//   };
//   return (
//     <Surface
//       elevation={3}
//       style={styles.main}>
//       <TouchableOpacity
//         key={index}
//         activeOpacity={0.8}
//         style={styles.touchCard}>
//         <View style={styles.imageTextView}>
//           <View style={styles.textPaymentView}>
//             <Text numberOfLines={1} style={styles.itemName}>
//               {item?.payment_id}
//             </Text>
//             <Text numberOfLines={1} style={styles.itemPaymentText}>
//               {dateTimeFormat(item?.date ?? item?.timestamp )}
//             </Text>
//           </View>
//           <View style={styles.kmCurrencyView}>
//             <Text numberOfLines={1} style={styles.currencyText}>
//               {currencyFormat(Number(item?.amount))}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Surface>
//   );
// };

// export default CardWallet;

// const styles = StyleSheet.create({
//   main:{
//     shadowColor: colors.black, // You can customize shadow color
//     backgroundColor: colors.white,
//     alignSelf: 'center',
//     borderRadius: 10,
//     width: wp('90%'),
//     height: hp('9%'),
//     marginTop: '5%',
//     justifyContent:'center',
//   },
//   touchCard:{
//     marginHorizontal: 6,
//     borderRadius: 10,
//     justifyContent:'center',
//   },
//   imageTextView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 100,
//   },
//   textPaymentView: {
//     flex: 1,
//     alignSelf: 'center',
//     marginLeft: '3%',
//   },
//   itemName: {
//     fontSize: RFValue(12),
//     fontFamily: fonts.semiBold,
//     color: colors.black,
//     width: wp('50%'),
//   },
//   itemPaymentText: {
//     fontSize: RFValue(12),
//     fontFamily: fonts.semiBold,
//     color:colors.colorAF,
//     width: wp('50%'),
//     marginTop: '4%',
//   },
//   kmCurrencyView: {
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     alignSelf: 'center',
//     width: wp('17%'),
//     marginRight: '2%',
//   },
//   kmText: {
//     fontSize: RFValue(12),
//     fontFamily: fonts.medium,
//     color: colors.color83,
//   },
//   currencyText: {
//     fontSize: RFValue(12),
//     fontFamily: fonts.bold,
//     color: colors.black,
//     marginTop: '10%',
//   },

// });

import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {currencyFormat} from '../halpers/currencyFormat';
import {Surface} from 'react-native-paper';
import moment from 'moment';

const CardWallet = ({item, index}) => {
  const dateTimeFormat = createdAt => {
    const date = new Date(createdAt);
    const formattedDate = moment(date).format('MMM DD, YYYY - hh:mm A');
    // console.log('formattedDate--', formattedDate); // Output: Jul 25, 2024 - 10:30 AM
    return formattedDate;
  };
  return (
    <Surface elevation={3} style={styles.main}>
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        style={styles.touchCard}>
        <View style={styles.imageTextView}>
          <View style={styles.innerMainView}>
            <Text numberOfLines={1} style={styles.itemPaymentId}>
              PaymentID : {item?.payment_id}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.typeText,
                {
                  color:
                    item?.status == 'deposits' ||
                    item?.status === 'duuitt_credits'
                      ? colors.main
                      : colors.red,
                },
              ]}>
              {/* { item?.type} */}
              {item?.status === 'deposits' || item?.status === 'duuitt_credits'
                ? 'Credit'
                : 'Debit'}
            </Text>
          </View>
          <View style={styles.innerMainView}>
            <Text numberOfLines={1} style={styles.reasonText}>
              {/* { item?.reason} */}
              {item?.status === 'deposits' || item?.status === 'duuitt_credits'
                ? 'Duuitt Credit and Recharge for wallet'
                : 'Deducted platform_fee and GST'}
            </Text>
            <Text numberOfLines={1} style={styles.currencyText}>
              {currencyFormat(Number(item?.amount))}
            </Text>
          </View>
          <View style={styles.innerMainView}>
            <Text numberOfLines={1} style={styles.itemdateTime}>
              {dateTimeFormat(item?.date)}
            </Text>
            <Text numberOfLines={1} style={styles.statusText}>
              {item?.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

export default CardWallet;

const styles = StyleSheet.create({
  main: {
    shadowColor: colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('13%'),
    marginTop: '5%',
  },
  touchCard: {
    marginHorizontal: 14,
    borderRadius: 10,
    justifyContent: 'center',
  },
  imageTextView: {
    justifyContent: 'center',
    marginTop: '1.5%',
  },
  innerMainView: {
    flexDirection: 'row',
    marginVertical: '2%',
  },
  itemPaymentId: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  typeText: {
    fontSize: RFValue(12),
    fontFamily: fonts.bold,
    color: colors.main,
    textTransform: 'capitalize',
  },
  reasonText: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.bold,
    color: colors.black,
    textTransform: 'capitalize',
  },
  itemPaymentText: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.colorAF,
  },
  itemdateTime: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.colorAF,
  },
  kmCurrencyView: {
    justifyContent: 'center',
    width: wp('17%'),
    marginRight: '2%',
  },
  kmText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color83,
  },
  currencyText: {
    fontSize: RFValue(12),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  statusText: {
    fontSize: RFValue(12),
    fontFamily: fonts.bold,
    color: colors.black,
    textTransform: 'capitalize',
  },
});
