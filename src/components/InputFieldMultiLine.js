import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View, Text, TextInput, Platform } from 'react-native';
import { useFormikContext } from 'formik';
import { colors } from '../theme/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import FieldErrorMessage from './FieldErrorMessage';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { fonts } from '../theme/fonts/fonts';
import { LaunchGallary } from './LaunchGallery';

function InputFieldMultiLine({
  name,
  value,
  inputLabel,
  onRightPress,
  onChange,
  placeholder,
  image,
  onBlur,
  rightIcon,
  keyboardType,
  maxLength,
  borderWidth,
  marginBottom,
  marginLeft,
  height,
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
  const [inputShowError, setInputShowError] = useState(false)

  return (
    <>
      <View style={{ marginTop: '5%', justifyContent: 'center' }}>
        {inputLabel && (
          <Text
            style={{
              fontSize: RFValue(13),
              fontFamily: fonts.medium,
              color: colors.black,
              marginLeft: marginLeft ? marginLeft : 0,
              marginBottom: marginBottom ? marginBottom : '4%',
            }}>
            {inputLabel}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors?.colorD9,
          }}>
          <TextInput
            multiline
            editable={rightIcon ? false : true}
            keyboardType={keyboardType}
            placeholder={placeholder}
            placeholderTextColor={colors.color95}
            value={value ? value : values[name]}
            onBlur={() => (onBlur ? onBlur() : setFieldTouched(name))}
            onChangeText={t => {
              setFieldValue(name, t);
            }}
            onFocus={() => {
              setInputShowError(true)
            }}
            style={{
              // flex: 1,
              height: height ? height : hp('18%'),
              marginRight: '2%',
              color: colors.black,
              fontSize: RFValue(13),
              marginLeft: '4%',
              paddingVertical: '2%',
              textAlignVertical: 'top', // Aligns text to the top
              textAlign: 'left',        // Aligns text to the left
              paddingHorizontal: 0,     // Removes extra horizontal padding
            }}
            maxLength={maxLength}
            {...otherProps}
          />
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: '4%' }}>
              <SvgXml width={17} height={17} xml={image} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <FieldErrorMessage
          error={errors[name]}
          visible={rightIcon || inputShowError ? true : inputShowError || touched[name]}
        />
      </View>
    </>
  );
}

export default InputFieldMultiLine;
