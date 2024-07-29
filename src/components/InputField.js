
import React from 'react';
import {Pressable, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {useFormikContext} from 'formik';
import {colors, fonts} from '../theme/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import FieldErrorMessage from './FieldErrorMessage';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import { heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen';



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



  return (
    <>
      <View
        style={{
          justifyContent: 'center',
          marginVertical: '2%',
          marginTop: '5%',
          opacity: isBlur ? 0.5 : 1,
        }}>
        {inputLabel && (
          <Text
            style={{
              marginBottom: 10,
              fontSize: RFValue(13),
              fontFamily: fonts.Regular,
              color: '#8F8F8F',
            }}>
            {inputLabel}
          </Text>
        )}
        <Pressable
          onPress={() => {
            onPress ? onPress() : console.log('press');
          }}>
          <TextInput
            placeholderTextColor={'#959595'}
            outlineColor={'#B6B6B6'}
            activeOutlineColor={'#959595'}
            style={{
              paddingLeft: prefix ? '10%' : 0,
              marginTop: '-2%',
              backgroundColor: 'white',
              paddingVertical: 0,
              fontSize: RFValue(13),
              height:hp('6%'),
            }}
            theme={{roundness: 10}}
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
                    fontFamily: fonts.Regular,
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
                      fontFamily: fonts.Regular,
                    }}
                  />
                ) : (
                  <TextInput.Icon
                    onPress={onPressEye}
                    icon={rightIconName}
                    size={24}
                    iconColor={'#8F8F8F'}
                  />
                )
              ) : null
            }
            mode="outlined"
            value={value ? value : values[name]}
            onBlur={() => (onBlur ? onBlur() : setFieldTouched(name))}
            onChangeText={t => {
              // handleChange(name)
              if(onChange){
                onChange(true)
              }
             ;
              setFieldValue(name, t);
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
              color: '#000000',
              textAlign: 'center',
              top:'27%'
            }}>
            {prefix}
          </Text>
        )}
      </View>
      <FieldErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default InputField;
