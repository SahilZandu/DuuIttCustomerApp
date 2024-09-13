import React, {useEffect, useState} from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {useFormikContext} from 'formik';
import { fonts } from '../theme/fonts/fonts';
import { appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';


const CheckBoxText = ({data, name, value, title,titleStyle}) => {
  const [v, setV] = useState(value);
  const {setFieldTouched, handleChange, values, setFieldValue} =
  useFormikContext();

  useEffect(()=>{
    setV(value)
  },[])


  return (
    <View style={{marginTop: '6%',}}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={styles.rovView}>
        {data?.map((item, key) => (
          <Pressable onPress={() => {
            setV(item)
            setFieldValue(name,item)
            }} key={key} style={styles.btn}>
            <SvgXml  xml={v == item ? appImagesSvg.select : appImagesSvg.unSelect} />
            <Text style={[styles.text, {color:v == item ? colors.main : colors.black50}]}>
              {'  '}
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default CheckBoxText;

const styles = StyleSheet.create({
  title: {
    color:colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
  },
  rovView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '6%',
  },
  text: {
    color:colors.black50,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
  },
});
