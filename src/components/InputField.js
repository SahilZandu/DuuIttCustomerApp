
import React from 'react';
import {Pressable, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {useFormikContext} from 'formik';
import {colors} from '../theme/colors';
import {RFValue} from 'react-native-responsive-fontsize';
import FieldErrorMessage from './FieldErrorMessage';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
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
            style={{
              paddingLeft: prefix ? '10%' : 0,
              marginTop: '-2%',
              backgroundColor:colors.white,
              paddingVertical: 0,
              fontSize: RFValue(13),
              height:hp('5.8%'),
              fontWeight:'600'
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
      <FieldErrorMessage errorStyle={{marginTop:0}}  error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default InputField;
