import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {screenHeight, screenWidth} from '../halpers/matrics';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const IncompleteCartComp = ({
  navigation,
  trackedArray,
  incompletedArray,
  onPressComplete,
  onDeleteRequest,
  title,
}) => {
  const setOrderImage = status => {
    switch (status) {
      case 'food':
        return appImages.order1;
      case 'parcel':
        return appImages.order2;
      case 'ride':
        return appImages.order3;
    }
  };

  return (
    <View style={styles.main(trackedArray)}>
      <Surface elevation={2} style={styles.viewDetailsSurfaceView}>
        <View style={styles.innerView}>
          {/* <Image
              resizeMode="contain"
              style={styles.image}
              source={setOrderImage('parcel')}
            /> */}
          <View style={styles.IncompleteView}>
            <Text numberOfLines={1} style={styles.incompleteText}>
              {title}....
            </Text>
            <Text numberOfLines={2} style={styles.proceedText}>
              Proceed the process and find your driver
            </Text>
          </View>
          <View style={styles.completeDeleteView}>
            <TouchableOpacity
              onPress={onPressComplete}
              activeOpacity={0.8}
              style={styles.completeBtnView}>
              <Text style={styles.completeBtnText}>{title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={
                incompletedArray[0]?.status == 'accepted' ? true : false
              }
              onPress={onDeleteRequest}
              activeOpacity={0.8}
              style={styles.deleteImageView}>
              <SvgXml
                opacity={incompletedArray[0]?.status == 'accepted' ? 0.5 : 1}
                width={35}
                height={35}
                xml={appImagesSvg.deleteIconSvg}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Surface>
    </View>
  );
};

export default IncompleteCartComp;

const styles = StyleSheet.create({
  main: trackedArray => ({
    position: 'absolute',
    alignSelf: 'center',
    bottom: trackedArray?.length > 0 ? screenHeight(19) : screenHeight(8.5),
  }),
  viewDetailsSurfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: screenHeight(8),
    width: screenWidth(90),
    justifyContent: 'center',
  },
  innerView: {
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  image: {
    width: 47,
    height: 47,
    borderRadius: 100,
  },
  IncompleteView: {
    flex: 1,
    marginLeft: '3%',
    justifyContent: 'center',
  },
  incompleteText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    width: screenWidth(41),
  },
  proceedText: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black65,
    width: screenWidth(41),
    marginTop: '2%',
  },
  completeDeleteView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  completeBtnView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorD45,
    height: screenHeight(5.8),
    width: screenWidth(24),
    borderRadius: 10,
    borderColor: colors.main,
    borderWidth: 0.5,
    paddingHorizontal: '2%',
  },
  completeBtnText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.main,
    textAlign: 'center',
  },
  deleteImageView: {
    marginLeft: '7%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
