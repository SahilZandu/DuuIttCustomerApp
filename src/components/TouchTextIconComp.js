import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const TouchTextIconComp = ({data,firstIcon}) => {
  return (
    <View style={styles.container}>
      {data?.map(
        (item, index) =>
          item?.show && (
            <View key={index} style={styles.renderView}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={item?.disable}
                onPress={item?.onPress}
                style={styles.textIconView}>
              {firstIcon == true && <SvgXml height={22} width={22} xml={item?.icon} />}
                <Text style={styles.titleText}>{item?.title}</Text>
                {item?.title != 'Logout' && (
                  <SvgXml
                    height={22}
                    width={22}
                    style={{marginLeft: 'auto'}}
                    xml={appImagesSvg.rightArrow}
                  />
                )}
              </TouchableOpacity>
            <View style={styles.bottomLine(data, index)} />
            </View>
          ),
      )}
    </View>
  );
};

export default TouchTextIconComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  renderView: {
    justifyContent: 'center',
  },
  textIconView:{
    flexDirection: 'row',
    marginTop:'6%',
  },
  titleText: {
    fontSize: RFValue(14),
    fontFamily: fonts.regular,
    marginLeft: '3%',
    color: colors.color24,
  },
  bottomLine: (data, index) => ({
    height: 2,
    backgroundColor: data?.length - 1 == index ? 'transparent' : colors.colorD9,
    marginTop:'5%',
  }),
  

});
