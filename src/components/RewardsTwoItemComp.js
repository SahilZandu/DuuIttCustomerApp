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

const RewardsTwoItemComp = ({data, navigation, onPress,title}) => {
  const renderItem = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            onPress(item);
          }}
          activeOpacity={0.8}
          key={index}
          style={styles.mainTouch(index)}>
          <Image
            resizeMode="stretch"
            style={styles.image}
            source={item?.image}
          />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
     {title && <Text
        style={styles.title}>
        {title}
      </Text>}
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={false}
        bounces={false}
        style={{
          alignSelf: 'center',
        }}
        contentContainerStyle={{paddingBottom: '1%', width: wp('90%')}}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2} // Set number of columns
      />
    </View>
  );
};

export default RewardsTwoItemComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    marginTop: '2%',
  },
  title:{
    fontSize: RFValue(12),
          fontFamily: fonts.medium,
          color: colors.black,
  },
  mainTouch: index => ({
    marginLeft: index % 2 == 0 ? 0 : 'auto',
    width: wp('43%'),
    height: hp('15%'),
    backgroundColor: colors.colorDo,
    borderRadius: 10,
    borderColor: colors.colorD6,
    borderWidth: 0.5,
    marginTop: '5%',
  }),
  image: {
    alignSelf: 'center',
    width: wp('43%'),
    height: hp('15%'),
    borderRadius: 10,
  },
});
