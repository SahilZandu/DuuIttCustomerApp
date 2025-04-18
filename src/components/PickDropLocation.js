// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Pressable,
//   Platform,
// } from 'react-native';
// import {Surface} from 'react-native-paper';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {SvgXml} from 'react-native-svg';
// import {appImages, appImagesSvg} from '../commons/AppImages';
// import { screenHeight } from '../halpers/matrics';
// import {colors} from '../theme/colors';
// import {fonts} from '../theme/fonts/fonts';

// const dotLineArray = [1, 2, 3];

// const PickDropLocation = ({
//   pickUpLocation,
//   cancelPickUp,
//   onPressPickLocation,
//   dropLocation,
//   cancelDrop,
//   onPressDropLocation,
// }) => {
//   return (
//     <Surface elevation={3} style={styles.container}>
//       <View>
//         <TouchableOpacity
//           onPress={onPressPickLocation}
//           activeOpacity={0.8}
//           style={styles.mainTouch}>
//           <Image
//             style={{width: 25, height: 25}}
//             source={appImages.pickIconSet}
//           />
//           <Text numberOfLines={1} style={styles.text}>
//             {pickUpLocation == '' ? 'Set pick up location' : pickUpLocation}
//           </Text>
//           {cancelPickUp && (
//             <>
//               {pickUpLocation != '' && (
//                 <Pressable onPress={cancelPickUp}>
//                   <SvgXml xml={appImagesSvg.crossBlackIcon} />
//                 </Pressable>
//               )}
//             </>
//           )}
//         </TouchableOpacity>

//         <View style={{marginHorizontal: '7%'}}>
//           {dotLineArray?.map((item, i) => {
//             return (
//               <View style={{justifyContent: 'center'}}>
//                 <View style={styles.dottedView} />
//                 {item == 2 && <View style={styles.dottedWithLine} />}
//               </View>
//             );
//           })}
//         </View>

//         <TouchableOpacity
//           onPress={onPressDropLocation}
//           activeOpacity={0.8}
//           // disabled={pickUpLocation == '' ? true : false}
//           style={styles.dropTouch(pickUpLocation)}>
//           <Image
//             style={{width: 25, height: 25}}
//             source={appImages.dropIconSet}
//           />
//           <Text numberOfLines={1} style={styles.dropText(pickUpLocation)}>
//             {dropLocation == '' ? 'Set drop location' : dropLocation}
//           </Text>
//           {cancelDrop && (
//             <>
//               {dropLocation != '' && (
//                 <Pressable onPress={cancelDrop}>
//                   <SvgXml xml={appImagesSvg.crossBlackIcon} />
//                 </Pressable>
//               )}
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </Surface>
//   );
// };

// export default PickDropLocation;

// const styles = StyleSheet.create({
//   container: {
//     shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     height: hp('14%'),
//     marginTop: '5%',
//   },
//   mainTouch: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: '4%',
//     marginTop:hp('1.8%'),
//     height:hp('2.5%') ,
//   },
//   text: {
//     marginLeft: '3%',
//     width: wp('70%'),
//     fontSize: RFValue(12),
//     fontFamily: fonts.medium,
//     color: colors.black,
//   },
//   dottedView: {
//     height: 5,
//     width: 3,
//     backgroundColor: colors.color95,
//     marginTop: '2%',
//   },
//   dottedWithLine: {
//     height: 2,
//     width: wp('72%'),
//     backgroundColor: colors.colorD1,
//     alignSelf: 'center',
//     marginLeft:wp('8%') ,
//     // top:hp('-0.4%') ,
//   },
//   dropTouch: pickUpLocation => ({
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: '4%',
//     height:hp('4.7%'),
//     // opacity: pickUpLocation == '' ? 0.5 : 1,
//   }),
//   dropText: pickUpLocation => ({
//     marginLeft: '3%',
//     width: wp('70%'),
//     fontSize: RFValue(12),
//     fontFamily: fonts.medium,
//     color: colors.black,
//     // color: pickUpLocation == '' ? colors.black50 : colors.black,
//   }),
// });

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {screenHeight} from '../halpers/matrics';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const dotLineArray = [1, 2, 3, 4, 5, 6];

const PickDropLocation = ({
  pickUpLocation,
  cancelPickUp,
  onPressPickLocation,
  dropLocation,
  cancelDrop,
  onPressDropLocation,
  onChangePress,
  addOnPick,
  addOnDrop,
  pick,
  drop,
}) => {
  return (
    <View>
      <Surface elevation={3} style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={onPressPickLocation}
            activeOpacity={0.8}
            style={styles.mainTouch}>
            <Image
              style={{width: 25, height: 25, marginTop: '2%'}}
              source={appImages.pickIconSet}
            />
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.senderText, {flex: 1, top: hp('4%')}]}>
                  {pick ? pick : 'Sender location'}
                </Text>
                {addOnPick && (
                  <TouchableOpacity
                    onPress={addOnPick}
                    style={styles.addOnTouch}>
                    <Text style={styles.addOnText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text
                numberOfLines={2}
                style={[styles.pickedText, {marginTop: hp('4%')}]}>
                {pickUpLocation == '' ? 'Set pick up location' : pickUpLocation}
              </Text>
            </View>
            {cancelPickUp && (
              <>
                {pickUpLocation != '' && (
                  <Pressable
                    hitSlop={{top: 15, bottom: 15, right: 15, left: 15}}
                    style={{padding: 5, top: '4%'}}
                    onPress={cancelPickUp}>
                    <SvgXml xml={appImagesSvg.crossBlackIcon} />
                  </Pressable>
                )}
              </>
            )}
          </TouchableOpacity>

          <View style={{marginHorizontal: '7%'}}>
            {dotLineArray?.map((item, i) => {
              return (
                <View style={{justifyContent: 'center', position: 'relative'}}>
                  <View style={styles.dottedView} />
                  {item == 3 && <View style={styles.dottedWithLine} />}
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={onPressDropLocation}
            activeOpacity={0.8}
            // disabled={pickUpLocation == '' ? true : false}
            style={styles.dropTouch(pickUpLocation)}>
            <Image
              style={{width: 25, height: 25, top: hp('-0.3%')}}
              source={appImages.dropIconSet}
            />
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row', top: hp('-4%')}}>
                <Text style={[styles.reciverText, {flex: 1}]}>
                  {drop ? drop : 'Receiver location'}{' '}
                </Text>
                {addOnDrop && (
                  <TouchableOpacity
                    onPress={addOnDrop}
                    style={styles.addOnRTouch}>
                    <Text style={styles.addOnText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text
                numberOfLines={2}
                style={[
                  styles.dropText(pickUpLocation),
                  {marginTop: hp('-4%')},
                ]}>
                {dropLocation == '' ? 'Set drop location' : dropLocation}
              </Text>
            </View>
            {cancelDrop && (
              <>
                {dropLocation != '' && (
                  <Pressable
                    style={{padding: 5}}
                    hitSlop={{top: 15, bottom: 15, right: 15, left: 15}}
                    onPress={cancelDrop}>
                    <SvgXml xml={appImagesSvg.crossBlackIcon} />
                  </Pressable>
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </Surface>
      {onChangePress && (
        <View style={styles.swipeView}>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={onChangePress}
            activeOpacity={0.8}
            style={styles.swipeTouch}>
            <Text style={styles.swipeText}>Swipe your location</Text>
            <SvgXml
              width={35}
              height={35}
              xml={appImagesSvg.changeLocationAddress}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PickDropLocation;

const styles = StyleSheet.create({
  container: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: hp('20%'),
    marginTop: hp('1%'),
  },
  mainTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
    height: hp('4%'),
    marginTop: '1%',
  },
  senderText: {
    marginLeft: '3%',
    // width: wp('70%'),
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black85,
  },
  pickedText: {
    marginLeft: '3%',
    width: wp('72%'),
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '1%',
    height: '100%',
  },
  dottedView: {
    height: 9,
    width: 3,
    backgroundColor: colors.color95,
    marginTop: '1%',
    marginLeft: '0.2%',
  },
  dottedWithLine: {
    height: 2,
    width: wp('72%'),
    backgroundColor: colors.colorD1,
    alignSelf: 'center',
    marginLeft: wp('8%'),
    top: hp('0.4%'),
  },
  dropTouch: pickUpLocation => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
    height: hp('4.7%'),
    // opacity: pickUpLocation == '' ? 0.5 : 1,
  }),
  reciverText: {
    marginLeft: '3%',
    // width: wp('70%'),
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black85,
  },
  dropText: pickUpLocation => ({
    marginLeft: '3%',
    width: wp('72%'),
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    // marginBottom: '4%',
    // marginTop: '0.5%',
    // color: pickUpLocation == '' ? colors.black50 : colors.black,
  }),
  addOnTouch: {
    // backgroundColor: '#D9D9D9',
    height: hp('3.5%'),
    // borderRadius: 10,
    marginRight: '-7%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-2%',
    top: hp('4%'),
  },
  addOnRTouch: {
    // backgroundColor: '#D9D9D9',
    height: hp('3.5%'),
    // borderRadius: 10,
    marginRight: '-7%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-2%',
    // top: hp('5%'),
  },
  addOnText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.redBold,
    borderBottomWidth: 0.4,
    borderBottomColor: colors.redBold,
  },
  swipeView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: '3%',
  },
  swipeTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color95,
    textAlign: 'center',
    marginRight: '2%',
  },
});
