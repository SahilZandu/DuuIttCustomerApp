import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Pressable} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const dotLineArray = [1, 2, 3];

const PickDropLocation = ({
  pickUpLocation,
  onPressPickUp,
  onPressPickLocation,
  dropLocation,
  onPressDrop,
  onPressDropLocation,
}) => {
  return (
    <Surface elevation={2} style={styles.container}>
      <View>
        <TouchableOpacity 
        onPress={onPressPickLocation}
        activeOpacity={0.8} style={styles.mainTouch}>
          <Image
            style={{width: 25, height: 25}}
            source={appImages.pickIconSet}
          />
          <Text numberOfLines={1} style={styles.text}>
            {pickUpLocation == '' ? 'Set pick up location' : pickUpLocation}
          </Text>
          {onPressDrop && <>
          {pickUpLocation != '' && (
              <Pressable onPress={onPressPickUp}>
            <SvgXml  xml={appImagesSvg.crossBlackIcon} />
            </Pressable>
          )}
          </>}
        </TouchableOpacity>

        <View style={{marginHorizontal: '7%'}}>
          {dotLineArray?.map((item, i) => {
            return (
              <View style={{justifyContent: 'center'}}>
                <View style={styles.dottedView} />
                {item == 2 && <View style={styles.dottedWithLine} />}
              </View>
            );
          })}
        </View>

        <TouchableOpacity
            onPress={onPressDropLocation}
          activeOpacity={0.8}
          disabled={pickUpLocation == '' ? true : false}
          style={styles.dropTouch(pickUpLocation)}>
          <Image
            style={{width: 25, height: 25}}
            source={appImages.dropIconSet}
          />
          <Text numberOfLines={1} style={styles.dropText(pickUpLocation)}>
            {dropLocation == '' ? 'Set drop location' : dropLocation}
          </Text>
          {onPressDrop && <>
          {dropLocation != '' && (
            <Pressable onPress={onPressDrop}>
            <SvgXml xml={appImagesSvg.crossBlackIcon} />
            </Pressable>
          )}
            </>}
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default PickDropLocation;

const styles = StyleSheet.create({
  container: {
    shadowColor: colors.black50, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('13.5%'),
    marginTop: '5%',
  },
  mainTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
    marginTop: '4.5%',
    height: '18%',
  },
  text: {
    marginLeft: '3%',
    width: wp('70%'),
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  dottedView: {
    height: 6,
    width: 3,
    backgroundColor: colors.color95,
    marginTop: '2%',
  },
  dottedWithLine: {
    height: 2,
    width: wp('70%'),
    backgroundColor: colors.colorD1,
    alignSelf: 'center',
    marginLeft: '6%',
    top: '-17%',
  },
  dropTouch: pickUpLocation => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
    height: '30%',
    opacity: pickUpLocation == '' ? 0.5 : 1,
  }),
  dropText: pickUpLocation => ({
    marginLeft: '3%',
    width: wp('70%'),
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: pickUpLocation == '' ? colors.black50 : colors.black,
  }),
});
