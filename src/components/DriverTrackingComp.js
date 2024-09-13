import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const DriverTrackingComp = ({data, image, bottomLine}) => {
  return (
    <>
      <View style={styles.main}>
        {data?.map((item, i) => {
          return (
            <View style={styles.renderView}>
              <View style={styles.renderInnerView}>
                <View style={styles.cricleView(item?.status)} />
                <Text numberOfLines={1} style={styles.name}>
                  {item?.name}
                </Text>
              </View>
              {i != 3 && <View style={styles.lineView} />}
            </View>
          );
        })}
      </View>
      <View style={styles.packetImageView}>
        <Image resizeMode="contain" style={styles.packetImage} source={image} />
      </View>
      {bottomLine && <View style={styles.bottomLine} />}
    </>
  );
};

export default DriverTrackingComp;

const styles = StyleSheet.create({
  main: {
    marginTop: '8%',
  },
  renderView: {
    justifyContent: 'center',
  },
  renderInnerView: {
    flexDirection: 'row',
  },
  cricleView: status => ({
    height: 18,
    width: 18,
    backgroundColor: status == 'completed' ? colors.main : colors.white,
    borderRadius: 100,
    borderColor: colors.main,
    borderWidth: 3,
  }),
  name: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '3%',
    width: wp('52%'),
  },
  lineView: {
    height: hp('6%'),
    width: wp('0.8%'),
    backgroundColor: colors.main,
    borderRadius: 100,
    marginLeft: '2%',
    marginVertical: '-1%',
  },
  packetImageView: {
    position: 'absolute',
    top: '40%',
    right: '0.1%',
  },
  packetImage: {
    height: 120,
    width: 120,
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '8%',
    marginHorizontal: -20,
  },
});
