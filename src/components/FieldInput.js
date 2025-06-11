import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View, Text, TextInput } from 'react-native';
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


function FieldInput({
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


  return (
    <>
      <View style={{ marginHorizontal: 22, marginTop: '5%' }}>
        {inputLabel && (
          <Text
            style={{
              fontSize: RFValue(12),
              fontFamily: fonts.semiBold,
              color: colors.black,
            }}>
            {inputLabel}
          </Text>
        )}
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
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
              flex: 1,
              height: hp('5%'),
              marginRight: '2%',
              color: colors.black,
              fontSize: RFValue(12),
              fontFamily: fonts.medium,
            }}
            maxLength={maxLength}
            {...otherProps}
          />
          {(rightIcon && image) && (
            <TouchableOpacity
              onPress={onRightPress}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 5 }}>
              <SvgXml width={17} height={17} xml={image} />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            height: 2,
            backgroundColor: '#D9D9D9',
          }}
        />
        <FieldErrorMessage error={errors[name]} visible={inputShowError || touched[name]} />
      </View>
    </>
  );
}

export default FieldInput;
