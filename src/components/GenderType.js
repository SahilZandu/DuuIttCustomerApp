import React, {useState} from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {useFormikContext} from 'formik';
import { fonts } from '../theme/fonts/fonts';
import { appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';

const types = ['male', 'female',];

const GenderType = ({name, value, title,titleStyle}) => {
  const [v, setV] = useState(value);
  const {setFieldTouched, handleChange, values, setFieldValue} =
  useFormikContext();

  const getValueF = i => {
    if (i == 'male') {
      return 'Male';
    } else if (i == 'female') {
      return 'Female';
    } else {
      return 'Male';
    }
  };

  return (
    <View style={{marginTop: '6%',marginHorizontal:22}}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={styles.rovView}>
        {types?.map((item, key) => (
          <Pressable onPress={() => {
            setV(item)
            setFieldValue(name,item)
            }} key={key} style={styles.btn}>
            <SvgXml xml={v == item ? appImagesSvg.select : appImagesSvg.unSelect} />
            <Text style={[styles.text, {color:v == item ? colors.main : colors.black50}]}>
              {'  '}
              {getValueF(item)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default GenderType;

const styles = StyleSheet.create({
  title: {
    color:colors.black,
    fontFamily: fonts.regular,
    fontSize: RFValue(12),
  },
  rovView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '3%',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '6%',
  },
  text: {
    color:colors.black50,
    fontFamily: fonts.regular,
    fontSize: RFValue(12),
  },
});
