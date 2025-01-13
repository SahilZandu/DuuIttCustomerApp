import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {appImagesSvg} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';

const filters = [
  {icon: appImagesSvg.veg, title: 'Veg', type: 'veg'},
  {icon: appImagesSvg.nonVeg, title: 'Non Veg', type: 'non-veg'},
  {icon: appImagesSvg.spicy, title: 'Spicy', type: 'spicy'},
];

const GroupsFilter = ({onFilter, showFilters, filterType}) => {
  const [selected, setSelected] = useState(filterType);

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        backgroundColor: showFilters ? 'white' : null,
        
      }}>
      {filters.map((item, key) => (
        <Pressable
          key={key}
          onPress={() => {
            if (item.type == selected) {
              setSelected(null);
              onFilter('all');
            } else {
              setSelected(item.type);
              onFilter(item.type);
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: hp('4.5%'),
            paddingHorizontal: '3%',
            backgroundColor:
              selected == item.type ? '#D6FFE473' : 'white',
            marginRight: '2%',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: selected == item.type ? '#28B056' : '#D9D9D9',
            opacity: showFilters ? 1 : 0,
          }}>
          <SvgXml xml={item.icon} />
          <Text
            style={{
              color: '#646464',
              fontFamily: fonts.medium,
              fontSize: RFValue(10),
            }}>
            {'  '}
            {item.title}
          </Text>
          {selected == item.type && <SvgXml xml={close} />}
        </Pressable>
      ))}
    </View>
  );
};

export default GroupsFilter;

const close = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 10 10" fill="none">
<path d="M7.5 2.5L2.5 7.5" stroke="#646464" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 2.5L7.5 7.5" stroke="#646464" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
