import react, {useState, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

export default function TabsTouch({data, onPassCate}) {
  const onCatePress = item => {
    onPassCate(item);
  };

  return (
    <View style={styles.main}>
      {data?.map((item, i) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onCatePress(item);
            }}
            activeOpacity={0.8}
            style={[styles.renderTouch(item)]}>
            <Text style={styles.text(item)}>{item?.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '2%',
  },
  renderTouch: item => ({
    backgroundColor: item?.active == 0 ? colors.white : colors.main,
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.main,
    padding: wp('2.5%'),
    marginTop: '5%',
    marginLeft: '3%',
  }),
  text: item => ({
    fontSize: RFValue(13),
    fontFamily: fonts.bold,
    color: item?.active == 1 ? colors.white : colors.main,
  }),
});
