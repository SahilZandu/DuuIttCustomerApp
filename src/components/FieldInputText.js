import React from 'react';
import {Pressable, TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useFormikContext} from 'formik';
import {RFValue} from 'react-native-responsive-fontsize';
import FieldErrorMessage from './FieldErrorMessage';
import {SvgXml} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';

function FieldInputText({
  name,
  value,
  inputLabel,
  label,
  onRightPress,
  onChange,
  placeholder,
  image,
  onBlur,
  rightIcon,
  keyboardType,
  maxLength,
  borderWidth,
  borderRadius,
  marginBottom,
  marginLeft,
  marginTop,
  top,
  borderColor,
  rightIconwidth,
  rightIconheight,
  ...otherProps
}) {
  const {
    setFieldTouched,
    handleChange,
    values,
    errors,
    touched,
    isValid,
    dirty,
    setFieldValue,
  } = useFormikContext();
  // console.log("errors--dd",errors)

  return (
    <>
      <View style={{marginTop: top ? top : '10%', justifyContent: 'center'}}>
        {inputLabel && (
          <Text
            style={{
              position: 'absolute',
              top: marginTop ? marginTop : -10,
              left: marginLeft ? marginLeft : '5%',
              backgroundColor: colors.white, // Use the same color as the screen background
              zIndex: 1, // Ensure it's above the input
              paddingHorizontal: 5,
              fontSize: RFValue(12),
              fontFamily: fonts.medium,
              color: colors.black,
            }}>
            {inputLabel}
          </Text>
        )}

        {label && (
          <Text
            style={{
              fontSize: RFValue(12),
              fontFamily: fonts.medium,
              color: colors.black,
              marginLeft: marginLeft ? marginLeft : 0,
              marginBottom: marginBottom ? marginBottom : '4%',
            }}>
            {label}
          </Text>
        )}
        <TouchableOpacity
          onPress={onRightPress}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: borderRadius ? borderRadius : 10,
            borderWidth: borderWidth ? borderWidth : 1,
            borderColor: borderColor ? borderColor : colors?.colorD9,
            height: hp('5.8%'),
          }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: values[name] == '' ? colors.color95 : colors.black,
              fontSize: RFValue(13),
              fontFamily: fonts.medium,
              marginLeft: '6%',
            }}>
            {value ? value : values[name] ? values[name] : placeholder}
          </Text>
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              activeOpacity={0.8}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginRight: '6%',
              }}>
              <SvgXml
                width={rightIconwidth ? rightIconwidth : 17}
                height={rightIconheight ? rightIconheight : 17}
                xml={image}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {!borderWidth && (
          <View
            style={{
              height: 2,
              backgroundColor: colors.colorD9,
              marginHorizontal: 10,
            }}
          />
        )}
      </View>
      <View style={{marginHorizontal: 10}}>
        <FieldErrorMessage
          error={errors[name]}
          visible={rightIcon ? true : touched[name]}
        />
      </View>
    </>
  );
}

export default FieldInputText;
