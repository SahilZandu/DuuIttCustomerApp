// import React, {useEffect, useState} from 'react';
// import {
//   Pressable,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   FlatList,
// } from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {SvgXml} from 'react-native-svg';
// import {colors} from '../theme/colors';
// import {fonts} from '../theme/fonts/fonts';
// import {Strings} from '../translates/strings';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';

// const ChangeRoute = ({data, navigation}) => {

//   const onRoutePress =(item)=>{
//     if(item?.name == 'FOOD'){
//       navigation.navigate('food',{screen:'home'})
//     }else if(item?.name == 'RIDE'){
//       navigation.navigate('ride',{screen:'home'})
//     }else if(item?.name == 'PARCEL'){
//       navigation.navigate('parcel',{screen:'home'})
//     }
//     else{
//       navigation.navigate('dashborad',{screen:'home'})
//     }

//   }

//   const renderItem = ({item, i}) => {
//     return (
//       <TouchableOpacity
//         onPress={()=>{onRoutePress(item)}}
//         activeOpacity={0.8}
//         key={i}
//         style={{
//           justifyContent: 'space-evenly',
//           width: wp('28%'),
//           height: hp('18%'),
//           backgroundColor: colors.colorDo,
//           borderRadius: 10,
//           borderColor:colors.colorD6,
//           borderWidth:1.5,
//           marginTop: '2%',
//           margin: 6,
//         }}>
//         <SvgXml
//           style={{marginLeft: '14%', marginTop: '24%'}}
//           xml={item?.duIcon}
//         />
//         <Text
//           style={{
//             marginLeft: '14%',
//             marginTop: '18%',
//             fontSize: RFValue(15),
//             fontFamily: fonts.bold,
//             color: colors.color27,
//           }}>
//           {item?.name}
//         </Text>
//         <Image
//           resizeMode="contain"
//           style={{
//             alignSelf: 'center',
//             marginTop: '26%',
//             width: 90,
//             height: 90,
//           }}
//           source={item?.image}
//         />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View
//       style={{
//         marginTop: '3%',
//       }}>
//       <Text
//         style={{
//           fontSize: RFValue(13),
//           fontFamily: fonts.semiBold,
//           color: colors.black,
//           marginHorizontal: 10,
//         }}>
//         {Strings.chooseYourService}
//       </Text>
//       <View style={{flex: 1,
//       flexWrap: 'wrap',
//        marginHorizontal: 3}}>
//         <FlatList
//           nestedScrollEnabled={true}
//           scrollEnabled={false}
//           bounces={false}
//           style={{
//             marginTop: '1%',
//             alignSelf: 'center',
//           }}
//           contentContainerStyle={{paddingBottom: '1%'}}
//           showsVerticalScrollIndicator={false}
//           data={data}
//           renderItem={renderItem}
//           keyExtractor={item => item.id}
//           numColumns={3} // Set number of columns
//         />
//       </View>
//     </View>
//   );
// };

// export default ChangeRoute;

import React, { useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { Strings } from '../translates/strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { screenHeight } from '../halpers/matrics';
import { Surface } from 'react-native-paper';

const ChangeRoute = ({ data, navigation }) => {
  const onRoutePress = item => {
    if (item?.name == 'FOOD') {
      navigation.navigate('food', { screen: 'home' });
    } else if (item?.name == 'RIDE') {
      navigation.navigate('ride', { screen: 'home' });
    } else if (item?.name == 'PARCEL') {
      navigation.navigate('parcel', { screen: 'home' });
    } else {
      navigation.navigate('dashborad', { screen: 'home' });
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        <Surface
          elevation={1}
          style={{
            shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
            backgroundColor: colors.white,
            alignSelf: 'center',
            borderRadius: 10,
            height: hp('14%'),
            width: wp('88%'),
            marginTop: '7%',
            // paddingVertical: '5%',
          }}>
          {index % 2 == 0 ? (
            <TouchableOpacity
              onPress={() => {
                onRoutePress(item);
              }}
              activeOpacity={0.8}
              key={index}
              style={{
                flex: 1,
                flexDirection: 'row',
                // height: screenHeight(14),
                // backgroundColor: colors.white,
                // borderRadius: 10,
                // borderWidth: 1,
                // borderColor: colors.black30,
                // marginTop: '5%',
              }}>
              <View
                style={{ flex: 1, marginLeft: wp('5%'), marginTop: hp('2%') }}>
                <SvgXml xml={item?.duIcon} />
                <Text
                  style={{
                    fontSize: RFValue(15),
                    fontFamily: fonts.bold,
                    color: colors.color27,
                    marginTop: '2%',
                  }}>
                  {item?.name}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: fonts.regular,
                    color: colors.black75,
                    marginTop: '1%',
                    width: wp('45%'),
                  }}>
                  {item?.title}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: wp('3%'),
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    alignSelf: 'center',
                    width: wp('32%'),
                    height: 130,
                    bottom: hp('-1%'),
                  }}
                  source={item?.image}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                onRoutePress(item);
              }}
              activeOpacity={0.8}
              key={index}
              style={{
                flex: 1,
                flexDirection: 'row',
                // height: screenHeight(14),
                // backgroundColor: colors.white,
                // borderRadius: 10,
                // borderWidth: 1,
                // borderColor: colors.colorD9,
                // marginTop: '5%',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp('5%'),
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    alignSelf: 'center',
                    width: wp('32%'),
                    height: 130,
                    bottom: hp('-1%'),
                    left: wp('-2%'),
                  }}
                  source={item?.image}
                />
              </View>
              <View style={{
                marginLeft:
                  Platform.OS === 'ios' ? wp('5%')
                    : wp('7%'), marginTop: hp('2%')
              }}>
                <SvgXml xml={item?.duIcon} />
                <Text
                  style={{
                    fontSize: RFValue(15),
                    fontFamily: fonts.bold,
                    color: colors.color27,
                    marginTop: '2%',
                  }}>
                  {item?.name}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: RFValue(12),
                    fontFamily: fonts.regular,
                    color: colors.black75,
                    marginTop: '1%',
                    width: wp('45%'),
                  }}>
                  {item?.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Surface>
      </>
    );
  };

  return (
    <View
      style={{
        marginTop: '3%',
        marginHorizontal: 10,
      }}>
      <Text
        style={{
          fontSize: RFValue(13),
          fontFamily: fonts.semiBold,
          color: colors.black,
        }}>
        {Strings.chooseYourService}
      </Text>
      <View
        style={{
          flex: 1,
        }}>
        <FlatList
          nestedScrollEnabled={true}
          scrollEnabled={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: '1%' }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        // numColumns={3} // Set number of columns
        />
      </View>
    </View>
  );
};

export default ChangeRoute;
