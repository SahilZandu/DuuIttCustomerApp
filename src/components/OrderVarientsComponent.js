import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {currencyFormat} from '../halpers/currencyFormat';

export default function OrderVarientsComponent({
  id,
  onSelectId,
  combination,
  varientGroup,
  isResOpen,
}) {
  const getVName = () => {
    if (varientGroup && varientGroup.length > 0) {
      return varientGroup.length == 1
        ? varientGroup[0].group
        :  varientGroup[0].group +' '+ varientGroup[1].group;
    } else {
      return '';
    }
  };

  return (
    <View
      pointerEvents={isResOpen ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          opacity: isResOpen ? 1 : 0.6,
        },
      ]}>
      <View style={styles.uprerTextView}>
        <Text style={styles.baseText}>{getVName()}</Text>
        <Text style={styles.selectText}>Select any 1 option</Text>
        <View style={styles.bottomLineView} />
      </View>

      {combination?.length > 0 && (
        <View style={styles.mainViewRender}>
          {combination?.map((value, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  let vName = value?.second_gp
                    ? value?.first_gp + ' - ' + value?.second_gp
                    : value?.first_gp;

                  onSelectId(value?.price, value?.price, vName);
                }}
                hitSlop={styles.hitSlotTouch}
                activeOpacity={0.8}
                style={styles.touchView}>
                <View style={styles.varientNameView}>
                  <Text numberOfLines={1} style={styles.varientName(id, value)}>
                    {value?.second_gp
                      ? `${value?.first_gp} - ${value?.second_gp}`
                      : `${value?.first_gp}`}
                  </Text>
                </View>
                <Text style={styles.priceText(id, value)}>
                  {currencyFormat(value?.price)}
                </Text>
                {id == value?.price? (
                  <SvgXml xml={check} />
                ) : (
                  <SvgXml xml={uncheck} />
                )}
              </TouchableOpacity>
            );
          })}
          {/* <Spacer space={hp('1%')} /> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    opacity: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowOffset: true,
    shadowColor: colors.black, // Shadow color (black)
    shadowOffset: {width: 0, height: 2}, // Horizontal and vertical offset
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 5, // Blur radius of the shadow
    elevation: 5, // Android shadow (elevation must be set to display shadow on Android)
    shadowRadius: 10,
    marginHorizontal:'4%',
    marginTop: '4%',
    paddingHorizontal: '5%',
    paddingBottom:'2%'
  },
  upperViewMain: {
    backgroundColor: colors.white,
    marginTop: hp('0.4%'),
    justifyContent: 'center',
  },
  uprerTextView: {
    marginTop: '1.2%',
    paddingTop: '3%',
    backgroundColor: colors.white,
  },
  baseText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black85,
  },
  selectText: {
    fontSize: RFValue(13),
    fontFamily: fonts.regular,
    color: colors.color64,
    marginTop: hp('0.5%'),
  },

  mainViewRender: {
    backgroundColor: colors.white,
  },
  hitSlotTouch: {
    top: 10,
    bottom: 10,
    left: 15,
    right: 15,
  },
  touchView: {
    flexDirection: 'row',
    // marginHorizontal: 16,
    marginTop: '3%',
    marginBottom: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  varientNameView: {
    flex: 1,
    justifyContent: 'center',
  },
  varientName: (vCId, value) => ({
    fontFamily: vCId == value?.price ? fonts.medium : fonts.regular,
    fontSize: RFValue(13),
    color: vCId == value?.price ? colors.main : colors.black,
    width: wp('70%'),
  }),
  priceText: (vCId, value) => ({
    fontFamily: vCId == value?.price ? fonts.medium : fonts.regular,
    fontSize: RFValue(13),
    color: vCId == value?.price ? colors.main : colors.black,
    right: 10,
  }),
  bottomLineView: {
    height: 1,
    marginTop: '4%',
    backgroundColor: colors.colorD9,
  },
});
const uncheck = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#D9D9D9"/>
<rect x="3" y="3" width="10" height="10" rx="5" fill="white"/>
</svg>`;

const check = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#28B056"/>
<rect x="3" y="3" width="10" height="10" rx="5" fill="#28B056"/>
</svg>`;
