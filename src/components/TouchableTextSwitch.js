import react, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Switch} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

export default function TouchableTextSwitch({
  activateSwitch,
  onTogglePress,
  toggle,
  title,
  text,
  onPress
}) {
  return (
    <TouchableOpacity 
    activeOpacity={toggle ? 1 : 0.8}
    onPress={onPress}>
      <View style={styles.min}>
        <Text numberOfLines={1} style={styles.titleText}>
          {title}
        </Text>
        {toggle && (
          <Switch
            style={{
              transform:
                Platform.OS === 'ios'
                  ? [{scaleX: 0.8}, {scaleY: 0.7}]
                  : [{scaleX: 1}, {scaleY: 0.9}],
            }}
            value={activateSwitch}
            trackColor={{false:colors.red, true: colors.main}}
            thumbColor={activateSwitch ? colors.white : colors.white}
            onValueChange={onTogglePress}
            ios_backgroundColor={colors.red} // Fix for iOS "off" track color
          />
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[styles.secondText, {marginTop: toggle ? 0 : '2%'}]}>
        {text}
      </Text>
      <View style={styles.bottomLine} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  min: {
    flexDirection: 'row',
    marginTop: '5%',
  },
  titleText: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.color24,
    marginRight: '2%',
  },
  secondText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.color64,
    marginTop: '2%',
  },
  bottomLine: {
    height: 2,
    backgroundColor: colors.colorD9,
    marginTop: '5%',
  },
});
