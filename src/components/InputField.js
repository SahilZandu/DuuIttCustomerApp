
import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormikContext } from 'formik';
import { colors } from '../theme/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import FieldErrorMessage from './FieldErrorMessage';
import { heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen';
import { fonts } from '../theme/fonts/fonts';


function InputField({
  name,
  leftIconName,
  onPressEye,
  rightIconName,
  leftIconAffix,
  value,
  onBlur,
  prefix,
  changeText,
  inputLabel,
  isBlur,
  onPress,
  onChange,
  editable,
  keyboardType,
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
      <View
        style={{
          justifyContent: 'center',
          marginVertical: '2%',
          marginTop: '6%',
          opacity: isBlur ? 0.5 : 1,
        }}>
        {inputLabel && (
          <Text
            style={{
              marginBottom: 10,
              fontSize: RFValue(13),
              fontFamily: fonts.regular,
              color: '#8F8F8F',
              marginLeft: '2%'
            }}>
            {inputLabel}
          </Text>
        )}
        <Pressable
          onPress={() => {
            onPress ? onPress() : console.log('press');
          }}>
          <TextInput
            placeholderTextColor={colors.color95}
            outlineColor={colors.colorB6}
            activeOutlineColor={colors.color95}
            editable={editable}
            keyboardType={keyboardType}
            scrollEnabled={false}
            dense={true}
            textAlignVertical="center"
            multiline={false}          // <-- ADD THIS
            numberOfLines={1}           // <-- ADD THIS
            style={{
              paddingLeft: prefix ? '10%' : '2%',
              marginTop: '1%',
              backgroundColor: colors.appBackground,
              paddingVertical: 0,
              fontSize: RFValue(13),
              height: hp('3.8%'),
              fontWeight: '500',
              textAlign: 'left',
              textAlignVertical: 'center',
            }}
            contentStyle={{
              height: hp('5.8%'), // same as style.height
              textAlignVertical: 'center',
              paddingVertical: 0,
              marginVertical: 0,
              fontSize: RFValue(13),
            }}
            theme={{ roundness: 50 }}
            left={
              (leftIconName && (
                <TextInput.Icon
                  icon={leftIconName}
                  size={24}
                  iconColor={'#8F8F8F'}
                />
              )) ||
              (leftIconAffix && (
                <TextInput.Affix
                  text={leftIconAffix}
                  textStyle={{
                    fontSize: RFValue(12),
                    color: colors.red,
                    fontFamily: fonts.regular,
                  }}
                />
              ))
            }
            right={
              rightIconName ? (
                changeText ? (
                  <TextInput.Affix
                    text={changeText}
                    textStyle={{
                      fontSize: RFValue(12),
                      color: colors.red,
                      fontFamily: fonts.regular,
                    }}
                  />
                ) : (
                  <TextInput.Icon
                    onPress={onPressEye}
                    icon={rightIconName}
                    size={24}
                    iconColor={'#8F8F8F'}
                    style={{ marginLeft: '4%', bottom: hp('-1%'), alignSelf: 'center' }}
                  />
                )
              ) : null
            }
            mode="outlined"
            value={value ? value : values[name]}
            onBlur={() => (onBlur ? onBlur() : setFieldTouched(name))}
            onChangeText={t => {
              // handleChange(name)
              if (onChange) {
                onChange(true)
              }
              ;
              setFieldValue(name, t);
            }}
            onFocus={() => {
              setInputShowError(true)
            }}
            {...otherProps}
          />
        </Pressable>
        {prefix && (
          <Text
            style={{
              position: 'absolute',
              left: 10,
              fontSize: RFValue(13),
              color: colors.black,
              textAlign: 'center',
              top: '27%'
            }}>
            {prefix}
          </Text>
        )}
      </View>
      <FieldErrorMessage errorStyle={{ marginTop: 0 }} error={errors[name]} visible={inputShowError || touched[name]} />
    </>
  );
}

export default InputField;
