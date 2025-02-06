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

const OffersExploreFlatList = ({data, onPress}) => {
  const flatListRef = useRef();

  // Render each item in the FlatList
  const renderItem = ({item, index}) => (
    <View style={styles.mainRender}>
      <TouchableOpacity
        onPress={()=>{onPress(item)}}
        activeOpacity={0.8}
        style={styles.mainTouch}>
        <Surface elevation={1} style={styles.surfaceView}>
          <View style={styles.viewTextImage}>
            <View style={styles.viewText}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.discountText}>{item?.discount}</Text>
            </View>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={item?.image}
            />
          </View>
        </Surface>
      </TouchableOpacity>
    </View>
  );

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <View style={styles.main}>
      <Text style={styles.exploreText}>Explore Cards</Text>
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
          keyExtractor={(index) => index?.toString()}
          contentContainerStyle={{
            paddingRight: wp('10%'),
          }} 
        />
      </View>
    </View>
  );
};

export default OffersExploreFlatList;

const styles = StyleSheet.create({
  main: {
    marginTop: '4%',
    justifyContent: 'center',
  },
  exploreText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  mainRender: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainTouch: {
    alignSelf: 'center',
    borderRadius: 10,
    marginRight: wp('3%'), // Space between items
    height: hp('10.1%'),
  },
  surfaceView: {
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('10%'),
    width: wp('40%'),
    borderColor: colors.black85,
    borderWidth: 0.3,
  },
  viewTextImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: wp('2.5%'),
  },
  viewText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: hp('2.5%'),
  },
  titleText: {
    fontSize: RFValue(12),
    fontFamily: fonts.bold,
    color: colors.black85,
  },
  discountText: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black75,
  },
  image: {
    height: hp('4.5%'),
    width: wp('11%'),
    alignSelf: 'center',
    marginTop: hp('2.5%'),
  },
});
