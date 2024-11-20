import React, {useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {Strings} from '../translates/strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {screenHeight, screenWidth} from '../halpers/matrics';

const ChangeRoute2 = ({data, navigation, route}) => {
  const onRoutePress = item => {
    if (item?.name == 'FOOD') {
      navigation.navigate('food', {screen: 'home'});
    } else if (item?.name == 'RIDE') {
      navigation.navigate('ride', {screen: 'home'});
    } else if (item?.name == 'PARCEL') {
      navigation.navigate('parcel', {screen: 'home'});
    } else {
      navigation.navigate('dashborad', {screen: 'home'});
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1}}>
        {route !== item?.name ? (
          <TouchableOpacity
            onPress={() => {
              onRoutePress(item);
            }}
            activeOpacity={0.8}
            key={index}
            style={styles.mainTouch(index)}>
            <View>
              <SvgXml
                style={{marginLeft: wp('4%'), marginTop: hp('2%')}}
                xml={item?.duIcon}
              />
              <Text style={styles.nameText}>{item?.name}</Text>
            </View>
            <View style={styles.imageView}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={item?.image}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={false}
        bounces={false}
        style={{
          marginTop: '1%',
        }}
        contentContainerStyle={{paddingBottom: '1%', width: screenWidth(90)}}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2} // Set number of columns
      />
    </View>
  );
};

export default ChangeRoute2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    marginTop: '6%',
  },
  mainTouch: index => ({
    marginLeft: index % 2 == 0 ? 0 : 'auto',
    // width: wp('43%'),
    // height: hp('15%'),
    width: screenWidth(43),
    height: screenHeight(15),

    backgroundColor: colors.colorDo,
    borderRadius: 10,
    borderColor: colors.colorD6,
    borderWidth: 1.5,
    // marginTop: '5%',
  }),
  nameText: {
    marginLeft: wp('4%'),
    marginTop: hp('1%'),
    fontSize: RFValue(15),
    fontFamily: fonts.bold,
    color: colors.color27,
  },
  imageView: {
    position: 'absolute',
    bottom: hp('-4%'),
  },
  image: {
    alignSelf: 'center',
    marginLeft: screenWidth(13),
    width: wp('29%'),
    height: 120,
  },
});
