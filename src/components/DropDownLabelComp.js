import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFormikContext} from 'formik';

import Spacer from '../halpers/Spacer';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
<path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M5.54674 5.6563C5.4061 5.7969 5.21537 5.87589 5.01649 5.87589C4.81762 5.87589 4.62689 5.7969 4.48624 5.6563L0.243493 1.41355C0.17186 1.34437 0.114723 1.26161 0.0754165 1.1701C0.0361098 1.0786 0.01542 0.980186 0.0145547 0.880602C0.0136893 0.781017 0.0326658 0.682258 0.0703765 0.590085C0.108087 0.497913 0.163777 0.414174 0.234197 0.343754C0.304616 0.273335 0.388355 0.217645 0.480527 0.179934C0.572699 0.142224 0.671459 0.123247 0.771044 0.124113C0.870628 0.124978 0.969043 0.145668 1.06055 0.184975C1.15205 0.224281 1.23481 0.281418 1.30399 0.35305L5.01649 4.06555L8.72899 0.35305C8.87045 0.216432 9.0599 0.140836 9.25655 0.142545C9.45319 0.144254 9.6413 0.22313 9.78036 0.362186C9.91941 0.501242 9.99829 0.689352 10 0.886C10.0017 1.08265 9.92611 1.2721 9.78949 1.41355L5.54674 5.6563Z" fill="black"/>
</svg>`;

const {height} = Dimensions.get('window');

const iosZindex = Platform.OS == 'ios' ? {zIndex: 1} : {};
const androidZindex = Platform.OS == 'android' ? {zIndex: 1} : {};

const DropDownLabelComp = ({
  title,
  name,
  list,
  value,
  titleStyle,
  listObject,
  onSelectItem,
  marginTop,
  position,
}) => {
  const {setFieldValue, values} = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);
  const [v, setV] = useState(values[name]);

  const DropDownList = () => {
    return (
      <View style={[styles.listView(marginTop, position), {...androidZindex}]}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          {list?.map((item, key) => (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: key == 0 ? '1%' : '3%',
              }}
              key={key}
              onPress={() => {
                setV(item?.name);
                setFieldValue(name, item?.name);
                setIsOpen(!isOpen);
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(14),
                  color: colors.black,
                  textTransform: 'capitalize',
                }}>
                {item?.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const getTitle = name => {
    if (list) {
      let f = list?.find(e => e?.name == name);
      return f ? f.name : name;
    } else {
      return name;
    }
  };

  return (
    <View style={{marginTop: '8%', overflow: 'visible', ...iosZindex}}>
      {/* Floating Label */}
      {title && (
        <Text
          style={[
            styles.floatingLabel,
            titleStyle,
            {
              top: position && isOpen ? '-0.1%' : '-0.5%',
              left: '5%',
              backgroundColor: colors.white,
            },
          ]}>
          {title}
        </Text>
      )}
      <View>
        <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.box}>
          <Text
            style={[styles.selectText, {color: v ? colors.black : '#8F8F8F'}]}>
            {v ? getTitle(v) : 'Select'}
          </Text>
          <SvgXml
            style={{transform: [{rotate: isOpen ? '180deg' : '0deg'}]}}
            xml={icon}
          />
        </Pressable>
        {isOpen && <DropDownList />}
        {position && isOpen && <Spacer space={'13%'} />}
      </View>
    </View>
  );
};

export default DropDownLabelComp;

const styles = StyleSheet.create({
  floatingLabel: {
    position: 'absolute',
    zIndex: 1, // Ensure the label is above the dropdown
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    paddingHorizontal: 5,
  },
  selectText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(14),
    textTransform: 'capitalize',
  },
  box: {
    height: hp('5.8%'),
    width: wp('90%'),
    marginTop: '3%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.colorD9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
  },
  listView: (marginTop, position) => ({
    marginTop: marginTop ? marginTop : '5%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.color95,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: 'rgba(16, 24, 40, 0.1)',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    position: position ? position : 'absolute',
    top: height / 20,
    width: '100%',
    maxHeight: hp('25%'),
  }),
});
