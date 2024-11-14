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
import { screenHeight } from '../halpers/matrics';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const dotLineArray = [1, 2, 3];

const PickDropLocation = ({
  pickUpLocation,
  cancelPickUp,
  onPressPickLocation,
  dropLocation,
  cancelDrop,
  onPressDropLocation,
}) => {
  return (
    <Surface elevation={3} style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={onPressPickLocation}
          activeOpacity={0.8}
          style={styles.mainTouch}>
          <Image
            style={{width: 25, height: 25}}
            source={appImages.pickIconSet}
          />
          <Text numberOfLines={1} style={styles.text}>
            {pickUpLocation == '' ? 'Set pick up location' : pickUpLocation}
          </Text>
          {cancelPickUp && (
            <>
              {pickUpLocation != '' && (
                <Pressable onPress={cancelPickUp}>
                  <SvgXml xml={appImagesSvg.crossBlackIcon} />
                </Pressable>
              )}
            </>
          )}
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
          {cancelDrop && (
            <>
              {dropLocation != '' && (
                <Pressable onPress={cancelDrop}>
                  <SvgXml xml={appImagesSvg.crossBlackIcon} />
                </Pressable>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default PickDropLocation;

const styles = StyleSheet.create({
  container: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('14%'),
    marginTop: '5%',
  },
  mainTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
    marginTop:hp('1.8%'),
    height:hp('2.5%') ,
  },
  text: {
    marginLeft: '3%',
    width: wp('70%'),
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  dottedView: {
    height: 5,
    width: 3,
    backgroundColor: colors.color95,
    marginTop: '2%',
  },
  dottedWithLine: {
    height: 2,
    width: wp('72%'),
    backgroundColor: colors.colorD1,
    alignSelf: 'center',
    marginLeft:wp('8%') ,
    // top:hp('-0.4%') ,
  },
  dropTouch: pickUpLocation => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '4%',
    height:hp('4.7%'),
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
