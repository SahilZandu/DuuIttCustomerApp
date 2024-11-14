import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';


const LocationHistoryCard = ({item, index,onPress,bottomLine}) => {

  const getLocationName=(item)=>{
    const nameData = item?.address?.split(',');
    // console.log('nameData--', nameData[0]);
    return nameData[0]
  }
  
  return (
    <TouchableOpacity
    key={index}
    onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <View style={styles.imageTextView}>
        <Image
          resizeMode="contain"
          style={{width: 20, height: 20}}
          source={appImages.locationHistoryIcon}
        />
        <Text numberOfLines={1} 
        style={styles.nameText}>
          {getLocationName(item)}
        </Text>
      </View>
      <Text 
      numberOfLines={2}
      style={styles.textAddress}
       >
        {item.address}
      </Text>
     {!bottomLine &&  <View
        style={styles.bottomLineView}
      />}
    </TouchableOpacity>
  );
};

export default LocationHistoryCard;

const styles = StyleSheet.create({
  container:{
    marginTop: '6%'
  },
  imageTextView:{
    flexDirection: 'row'
  },
  nameText:{
    fontSize:RFValue(12),
    fontFamily:fonts.medium,
    color:colors.black,
      marginLeft: '2%'
  },
  textAddress:{
    fontSize:RFValue(12),
    fontFamily:fonts.regular,
    color:colors.color95,
    marginLeft: '8%',
     marginTop: '0.5%'
  },
  bottomLineView:{
    height: 1,
     backgroundColor:colors.colorD9,
      marginTop: '6%'
  }



})
