import React, { useState } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native';
import { useFormikContext } from 'formik';
import { colors } from '../theme/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import FieldErrorMessage from './FieldErrorMessage';
import { SvgXml } from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { fonts } from '../theme/fonts/fonts';

function InputFieldLabel({
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
  marginTop,
  marginLeft,
  showErrorMsg,
  borderRadius,
  editable,
  isBlur,
  autoCapitalize,
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
  const [inputShowError, setInputShowError] = useState(false)


  function extractPhoneNumber(input) {
    console.log("input---", input);
    // Remove everything except digits
    const digitsOnly = input.replace(/\D/g, '');
    // Extract the last 10 digits (assumes Indian number)
    console.log("digitsOnly.slice(-10)", digitsOnly.slice(-10));

    return digitsOnly.slice(-10);
  }


  return (
    <>
      <View style={{ marginTop: marginTop ? marginTop : '10%', justifyContent: 'center' }}>
        <View style={{ position: 'relative', opacity: isBlur ? 0.5 : 1, }}>
          {/* Label with "cut through border" effect */}
          {inputLabel && (
            <Text
              style={{
                position: 'absolute',
                top: -10,
                left: marginLeft ? marginLeft : '5%',
                backgroundColor: colors.appBackground, // Use the same color as the screen background
                zIndex: 1, // Ensure it's above the input
                paddingHorizontal: 5,
                fontSize: RFValue(12),
                fontFamily: fonts.medium,
                color: colors.black,
              }}>
              {inputLabel}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: borderRadius ? borderRadius : 10,
              borderWidth: borderWidth ? borderWidth : 1,
              borderColor: colors.colorBB,
              paddingHorizontal: '4%',
              backgroundColor: colors.appBackground
            }}>
            <TextInput
              // editable={!rightIcon}
              autoCapitalize={autoCapitalize}
              editable={editable}
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={colors.color95}
              value={value ? value : values[name]}
              onBlur={() => (onBlur ? onBlur() : setFieldTouched(name))}
              onChangeText={t => {
                // if (keyboardType == "number-pad") {
                //   let res = extractPhoneNumber(t)
                //   setFieldValue(name, res);
                // } else {
                setFieldValue(name, t);
                // }
              }}
              onFocus={() => {
                setInputShowError(true)
              }}
              style={{
                flex: 1,
                height: hp('5.8%'),
                color: colors.black,
                fontSize: RFValue(13),
                marginLeft: '2%',
              }}
              maxLength={maxLength}
              {...otherProps}
            />
            {rightIcon && (
              <TouchableOpacity
                onPress={onRightPress}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ marginRight: '1%' }}>
                <SvgXml width={17} height={17} xml={image} />
              </TouchableOpacity>
            )}
          </View>
        </View>

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

      <View style={{ marginHorizontal: 10 }}>
        <FieldErrorMessage
          error={errors[name]}
          visible={rightIcon || showErrorMsg ? true : inputShowError || touched[name]}
        />
      </View>
    </>
  );
}

export default InputFieldLabel;