import {RFC_2822} from 'moment';
import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/fonts/fonts';

const PromotionsFlatList = ({data, onPress}) => {
  const flatListRef = useRef();

  // Render each item in the FlatList
  const renderItem = ({item, index}) => (
    <View style={styles.mainRender}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.mainTouch}>
        <Image resizeMode="stretch" style={styles.image} source={item?.image} />
      </TouchableOpacity>
    </View>
  );

    const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <View style={styles.main}>
      <Text style={styles.exploreText}>Promotions</Text>
      <Text style={styles.boostText}>
        Boost your tech, organize your home, and pamper your skin with this
        exclusive promo.
      </Text>
      <View style={{marginTop: '5%'}}>
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment={'center'}
          decelerationRate="fast"
          snapToInterval={wp('55%')} // Ensures only two items are fully visible
            viewabilityConfig={viewConfigRef.current}
          keyExtractor={(item, index) => index?.toString()}
          contentContainerStyle={{
            paddingRight: wp('3%'),
          }}
        />
      </View>
    </View>
  );
};

export default PromotionsFlatList;

const styles = StyleSheet.create({
  main: {
    marginTop: '6%',
    justifyContent: 'center',
  },
  exploreText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  boostText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black85,
    marginRight: 20,
    marginTop: '2%',
    lineHeight: 20,
  },
  mainRender: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainTouch: {
    borderRadius: 10,
    marginRight: wp('4%'), // Space between items
    backgroundColor: colors.white,
  },
  image: {
    height: hp('15%'),
    width: wp('35%'),
    alignSelf: 'center',
    borderRadius: 10,
  },
});
