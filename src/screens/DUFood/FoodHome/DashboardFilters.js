import React, {useState} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Filters} from './Filters';
import {RFValue} from 'react-native-responsive-fontsize';
import {fontsDmSan} from '../../../theme/fonts/fontsDmSan';
import {SvgXml} from 'react-native-svg';
//import { rootStore } from '../../stores/rootStore';

let f = [];

const DashboardFilters = ({onChange}) => {
  const [selected, setSelected] = useState([]);
  const [update, setupdate] = useState(true);
  //const { setFilterRating, setDashfilter } = rootStore.homeStore

  const handleSelect = async item => {
    if (selected.includes(item.name)) {
      await setSelected(selected.filter(i => i !== item.name));
      setFilterValues(selected.filter(i => i !== item.name));
    } else {
      await setSelected([...selected, item.name]);
      setFilterValues([...selected, item.name]);
    }
    // setSelected(item.name);

    setupdate(!update);
  };

  const setFilterValues = v => {
    if (v && v.length > 0) {
      let veg = v.includes('Veg-only') ? {veg: 'veg'} : {};
      let nonveg = v.includes('NonVeg-only') ? {'non-veg': 'non-veg'} : {};
      // let rating = v.includes('Rating 4.0+') ? {rating: '4'} : {};
      let rating = v.includes('Rating 4.0+') ? '4' : '0';
      let offers = v.includes('Great Offers') ? {offers: 'offers'} : {};
      let f = {...veg, ...nonveg,...offers};
       setDashfilter(f)
       setFilterRating(rating)
      onChange(f);
    } else {
      setDashfilter([])
      setFilterRating('0')
      onChange([]);
    }
  };

  return (
    <View style={{height: hp('5.6%'), marginTop: '2%'}}>
      <ScrollView
        style={{width: wp('100%'), alignSelf: 'center'}}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingRight: '40%'}}>
        {Filters.map((item, key) => (
          <Pressable
            key={key}
            onPress={() => handleSelect(item)}
            style={{
              height: hp('5%'),
              borderRadius: 20,
              borderWidth:selected.includes(item.name) ? 0 : 1,
              marginLeft: 12,
              paddingHorizontal: '3%',
              marginTop: '1%',
              borderWidth:1,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: selected.includes(item.name)
              ? '#28B056'
              : '#BBBBBB',
              backgroundColor: selected.includes(item.name)
                ? '#D6FFE473'
                : 'white',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: fontsDmSan.regular,
                fontSize: RFValue(12),
                color: selected.includes(item.name) ? '#28B056' : 'rgba(0, 0, 0, 0.65)',
              }}>
              {item.name}{' '}
            </Text>

            {selected.includes(item.name) && <SvgXml style={{}} xml={icon} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default DashboardFilters;

const icon = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 2.5L2.5 7.5" stroke="#28B056" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 2.5L7.5 7.5" stroke="#28B056" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
