// import React, {useState} from 'react';
// import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {appImages} from '../commons/AppImages';
// import {colors} from '../theme/colors';
// import {fonts} from '../theme/fonts/fonts';
// import Popover, {PopoverPlacement} from 'react-native-popover-view';
// import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

// const TextRender = ({
//   title,
//   value,
//   bottomLine,
//   titleStyle,
//   valueStyle,
//   lineStyle,
//   gstShow,
// }) => {
//   const [showPopover, setShowPopover] = useState(false);
//   return (
//     <>
//       <View style={styles.container}>
//         <Text
//           numberOfLines={1}
//           style={[styles.title, {flex: gstShow == true ? 0 : 1}, titleStyle]}>
//           {title}
//         </Text>
//         {gstShow && (
//           <Popover
//             placement={PopoverPlacement.AUTO}
//             isVisible={showPopover}
//             onRequestClose={() => setShowPopover(false)} // Close on tap outside
//             from={
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 style={{flex:1, right: wp('6%')}}
//                 hitSlop={{left: 15, right: 15, top: 15, bottom: 15}}
//                 // onPress={() => setShowPopover(true)}
//                 >
//                 <Image
//                   style={{height: 20, width: 20}}
//                   source={appImages.infoIcon}
//                 />
//               </TouchableOpacity>
//             }>
//             <View style={{marginHorizontal: 10, width: wp('60%'),}}>
//               <Text>GST</Text>
//               <View style={{flexDirection: 'row'}}>
//                 <Text>
//                   Duuitt plays no role in taxes and charges levied by the govt.{' '}
//                 </Text>
//                 <Text>₹2.18</Text>
//               </View>
//             </View>
//           </Popover>
//         )}
//         <Text style={[styles.value, valueStyle]}>{value}</Text>
//       </View>
//       {bottomLine && <View style={[styles.bottomLine, lineStyle]} />}
//     </>
//   );
// };

// export default TextRender;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     marginTop: '6%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     flex: 1,
//     fontSize: RFValue(12),
//     fontFamily: fonts.regular,
//     color: colors.black,
//     marginRight: '9%',
//   },
//   value: {
//     fontSize: RFValue(13),
//     fontFamily: fonts.semiBold,
//     color: colors.black,
//   },
//   bottomLine: {
//     height: 1,
//     backgroundColor: colors.colorD9,
//     marginTop: '6%',
//     marginHorizontal: -20,
//   },
// });

import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {appImages} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const TextRender = ({
  title,
  value,
  bottomLine,
  titleStyle,
  valueStyle,
  lineStyle,
  gstShow,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  return (
    <>
      <View style={styles.container}>
        {/* <Text
          numberOfLines={1}
          style={[styles.title, {flex: gstShow == true ? 0 : 1}, titleStyle]}>
          {title}
        </Text> */}
        {gstShow ? (
          <View style={styles.mainViewHover}>
            <View style={styles.innerViewHover}>
              <Text
                numberOfLines={1}
                style={[styles.title, {flex: 0}, titleStyle]}>
                {title}
              </Text>
              <Popover
                placement={PopoverPlacement.TOP}
                isVisible={showPopover}
                onRequestClose={() => setShowPopover(false)} // Close on tap outside
                from={
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{right: wp('4%')}}
                    hitSlop={{left: 15, right: 15, top: 15, bottom: 15}}
                    onPress={() => setShowPopover(true)}>
                    <Image
                      style={{height: 20, width: 20}}
                      source={appImages.infoIcon}
                    />
                  </TouchableOpacity>
                }>
                <View style={styles.hoverDetailView}>
                  <Text style={styles.gstText}>GST</Text>
                  <View style={styles.msgGstRateView}>
                    <Text style={styles.msgText}>
                      Duuitt plays no role in taxes and charges levied by the
                      govt.{' '}
                    </Text>
                    <Text style={styles.gstRate}>{value}</Text>
                  </View>
                </View>
              </Popover>
            </View>
          </View>
        ) : (
          <Text
            numberOfLines={1}
            style={[styles.title, {flex: gstShow == true ? 0 : 1}, titleStyle]}>
            {title}
          </Text>
        )}
        <Text style={[styles.value, valueStyle]}>{value}</Text>
      </View>
      {bottomLine && <View style={[styles.bottomLine, lineStyle]} />}
    </>
  );
};

export default TextRender;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: '6%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
    marginRight: '9%',
  },
  value: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '6%',
    marginHorizontal: -20,
  },
  mainViewHover: {
    flex: 1,
    justifyContent: 'center',
  },
  innerViewHover: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoverDetailView: {
    marginHorizontal: 10,
    width: wp('70%'),
    padding: 10,
    bottom: '2%',
  },
  gstText: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '1%',
  },
  msgGstRateView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  msgText: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color83,
    marginTop: '2%',
    lineHeight: 20,
  },
  gstRate: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color33,
    marginTop: '3%',
  },
});
