import React, {useState} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import { fonts } from '../../../theme/fonts/fonts';
import { filters } from '../../../stores/DummyData/Home';
import { colors } from '../../../theme/colors';

const DashboardFilters = ({onChange}) => {

  const [selected, setSelected] = useState('');
  const [update, setupdate] = useState(true);

  const handleSelect = async item => {
     setSelected(item.name);
    setupdate(!update);
    if (item.name!=='') {
   onChange(item?.type);
 } else {
   onChange('');
 }
  };

  return (
      <ScrollView
        style={{width: wp('100%'), alignSelf: 'center',marginTop:'4%'}}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingRight: '40%'}}>
        {filters?.map((item, key) => (
          <Pressable
            key={key}
            onPress={() => handleSelect(item)}
            style={{
              height: hp('4.5%'),
              borderRadius: 50,
              borderWidth:selected==item?.name ? 0 : 1,
              marginLeft:'3%',
              paddingHorizontal: '3.5%',
              marginTop: '1%',
              borderWidth:1,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: selected==item?.name 
              ? colors.main
              : colors.colorD9,
              backgroundColor: selected==item?.name 
                ? colors.colorD73
                :colors.white,
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: RFValue(11),
                // color: selected.includes(item.name) 
                color: selected ==item?.name 
                ? colors.main : colors.black85,
              }}>
              {item?.name}{' '}
            </Text>

            {
            // selected.includes(item.name) 
            selected==item.name 
            && <SvgXml style={{}} xml={icon} />}
          </Pressable>
        ))}
      </ScrollView>
  );
};

export default DashboardFilters;

const icon = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 2.5L2.5 7.5" stroke="#28B056" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 2.5L7.5 7.5" stroke="#28B056" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
