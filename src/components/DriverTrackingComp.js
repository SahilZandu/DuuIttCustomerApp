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
    marginTop: '5%',
  },
  renderView: {
    justifyContent: 'center',
  },
  renderInnerView: {
    flexDirection: 'row',
  },
  cricleView: status => ({
    height: 13,
    width: 13,
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
    width: wp('0.7%'),
    backgroundColor: colors.main,
    borderRadius: 100,
    marginLeft: '1.5%',
    marginVertical: '-2%',
  },
  packetImageView: {
    position: 'absolute',
    top:hp('20%'),
    right: '0.1%',
  },
  packetImage: {
    height: 100,
    width: 100,
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '8%',
    marginHorizontal: -20,
  },
});
