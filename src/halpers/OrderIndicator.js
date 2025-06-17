// import React, { useState, useCallback } from 'react';
// import { View, Pressable, Text } from 'react-native';
// import { RFValue } from 'react-native-responsive-fontsize';
// import Icon from 'react-native-vector-icons/Entypo';
// import * as Animatable from 'react-native-animatable';
// import { useFocusEffect } from '@react-navigation/native';
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { fonts } from '../theme/fonts/fonts';
// import { colors } from '../theme/colors';


// const OrderIndicator = ({ onPress, isHashOrders }) => {
//     const [hashOrder, setHashOrder] = useState(true);
//     const [isOrderIndicator, setIsOrderIndicator] = useState(true);

//     useFocusEffect(
//         useCallback(() => {
//             //   setHashOrder(false)
//             //   setIsOrderIndicator(false)
//             setHashOrder(true)
//             setIsOrderIndicator(true)

//         }, []),
//     );

//     if (hashOrder && isOrderIndicator) {
//         return (
//             <Animatable.View
//                 animation="pulse"
//                 duration={2000}
//                 //delay={10000}
//                 easing={'ease-in'}
//                 iterationCount={'infinite'}
//                 style={{
//                     position: 'abslute', bottom: hp("4%"),
//                     width: wp("90%"), justifyContent: 'center',
//                 }}
//             >
//                 <Pressable
//                     onPress={onPress}
//                     style={{
//                         backgroundColor: colors.main,
//                         paddingVertical: '2.5%',
//                         flexDirection: 'row',
//                         paddingHorizontal: 20,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         borderTopLeftRadius: 20,
//                         borderTopRightRadius: 20,

//                     }}>
//                     <Text
//                         style={{
//                             color: colors.white,
//                             fontFamily: fonts.semiBold,
//                             fontSize: RFValue(13),
//                             //   marginTop: '-2%'
//                         }}>
//                         Hang tight! Your Rider is en route.
//                     </Text>
//                     <View style={{
//                         marginLeft: 'auto',
//                         //  marginTop: '-2%'
//                     }}>
//                         <Icon name={'chevron-up'} size={25} color={colors.white} />
//                     </View>
//                 </Pressable>
//             </Animatable.View>
//         );
//     } else {
//         return null;
//     }
// };

// export default OrderIndicator;

import React from 'react';
import { View, StyleSheet,Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } 
from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import { appImages } from '../commons/AppImages';

const CornerTriangle = ({onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.9}
    onPress={onPress}
     style={styles.main}>
      <View style={styles.cornerTriangle} />
      <View style={styles.redDot}> 
      <Animatable.View
        animation="zoomIn"
        //  "shake"  "tada"
        iterationCount={'infinite'}
        direction="alternate"
        duration={4000}>
            <Image style={{height:20,width:20}}
             source={appImages.homeIconDot} />
            </Animatable.View>
      </View>
    </TouchableOpacity>
  );
};

export default CornerTriangle;

const styles = StyleSheet.create({
  main: {
    position: 'absolute', // fixed typo here
    top: hp('2.9%'),
    right: wp('0.9%'),
    width:wp("20"),
    height:hp("20%"),
    overflow: 'hidden',
  },
  cornerTriangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 60,
    borderBottomWidth: 60,
    borderTopLeftRadius:10,
    borderLeftColor: '#FCEEEF', // Light pink fill
    borderBottomColor: 'transparent',
    transform: [{ rotate: '90deg' }],
  },
  redDot: {
    position: 'absolute',
    top:hp("1%"),
    right:wp("2%"),
  },
});



// import React from 'react';
// import { StyleSheet,View } from 'react-native';
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';

// const CornerTriangle = ({}) => {
//   return (
//     <View style={styles.main}>
//     <View style={styles.cornerTriangle} />

//     {/* Red dot in the corner */}
//     <View style={styles.redDot} />
//     </View>
//   );
// };

// export default CornerTriangle;


// const styles = StyleSheet.create({
//     main: {
//         position: 'abslute',
//          bottom: hp("14%"),
//         right:wp('0.5%'),
//         justifyContent: 'center',
     
//     },
//     cornerTriangle: {
//       position: 'absolute',
//       top: 0,
//       right: 0,
//       width: 40,
//       height: 40,
//       backgroundColor: '#FCEEEF',
//       transform: [{ rotate: '180deg' }],
//       borderTopLeftRadius: 10,
//     },
//     redDot: {
//       position: 'absolute',
//       top: 8,
//       right: 8,
//       width: 10,
//       height: 10,
//       borderRadius: 5,
//       backgroundColor: '#FF005C',
//       borderWidth: 1,
//       borderColor: 'white',
//     },
//   });