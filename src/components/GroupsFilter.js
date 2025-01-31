import React, {useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import {appImagesSvg} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';

const filters = [
  {icon: appImagesSvg.veg, title: 'Veg', type: 'veg'},
  {icon: appImagesSvg.nonVeg, title: 'Non Veg', type: 'non-veg'},
  {icon: appImagesSvg.eggSvg, title: 'Egg', type: 'egg'},
  {icon: appImagesSvg.spicy, title: 'Spicy', type: 'spicy'},
];

const GroupsFilter = ({onFilter, showFilters, filterType, mainStyle}) => {
  const [selected, setSelected] = useState(filterType);

  return (
    // <ScrollView
    // style={{flex:1}}
    // horizontal={true}
    // showsHorizontalScrollIndicator={false}
    // contentContainerStyle={{paddingRight:'45%'}}>
    <View
      style={[
        {
          flexDirection: 'row',
          paddingHorizontal: 16,
          backgroundColor: showFilters ? colors.white : 'transparent',
        },
        mainStyle,
      ]}>
      {filters?.map((item, key) => (
        <Pressable
          key={key}
          onPress={() => {
            if (item?.type == selected) {
              setSelected(null);
              onFilter('all');
            } else {
              setSelected(item.type);
              onFilter(item?.type);
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'center',
            height: hp('4.3%'),
            paddingHorizontal: '2.5%',
            backgroundColor:
              selected == item.type ? colors.colorD45 : colors.white,
            marginRight: '3%',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: selected == item.type ? colors.main : colors.colorD9,
            opacity: showFilters ? 1 : 0,
          }}>
          <SvgXml xml={item.icon} />
          <Text
            style={{
              color: colors.color64,
              fontFamily: fonts.medium,
              fontSize: RFValue(10),
              marginLeft:'1%',
              marginRight:'1%'
            }}>
            {'  '}
            {item.title}
          </Text>
          {selected == item?.type && <SvgXml xml={close} />}
        </Pressable>
      ))}
    </View>
    // </ScrollView>
  );
};

export default GroupsFilter;

const close = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 10 10" fill="none">
<path d="M7.5 2.5L2.5 7.5" stroke="#646464" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 2.5L7.5 7.5" stroke="#646464" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
