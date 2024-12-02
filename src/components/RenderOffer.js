import React from 'react';
import {StyleSheet, TouchableOpacity, Image, View, Text} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const RenderOffer = ({data}) => {
  return (
    <View style={styles.container}>
      {data?.map((item, i) => {
        return (
          <View style={styles.renderView}>
            <Surface elevation={3} style={styles.surfaceView}>
              <TouchableOpacity
                style={styles.touchView}
                key={i}
                activeOpacity={0.8}
                // onPress={onPressOffer}
              >
                <Image
                  resizeMode="cover"
                  style={styles.image}
                  source={item?.image}
                />
              </TouchableOpacity>
            </Surface>

            <View style={styles.textView}>
              <Text style={styles.title}>{item?.title}</Text>
              <Text style={styles.message}>{item?.message}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default RenderOffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  surfaceView: {
    shadowColor: colors.black50, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('18%'),
    width: wp('89%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  touchView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp('90%'),
    height: hp('18%'),
    borderRadius: 10,
  },
  textView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: RFValue(16),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '4%',
  },
  message: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black85,
    marginTop: '3%',
  },
});
