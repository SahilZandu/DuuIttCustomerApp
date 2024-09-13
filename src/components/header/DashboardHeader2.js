import React, {useEffect, useState, useRef} from 'react';
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg, appImages} from '../../commons/AppImages';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/fonts/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DashboardHeader2 = ({
  navigation,
  value,
  onPress
}) => {
 
  return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.backColorMain,
          alignItems: 'center',
          paddingBottom: '2%',
          marginTop: '2%',
          paddingHorizontal: 20,
        }}>

         <TouchableOpacity 
        activeOpacity={0.9}
        onPress={onPress} 
        style={{marginRight:'4%',marginLeft:'-2%'}}>
        <SvgXml 
           xml={appImagesSvg.backArrow}/>
        </TouchableOpacity> 
       
        <View
          style={{flex: 1, backgroundColor: colors.white, marginRight: '1%'}}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: RFValue(13),
              fontFamily: fonts.semiBold,
              color: colors.main,
              width:wp("68%")
            }}>
            Home
          </Text>
          <Text 
          style={{fontSize:RFValue(10),fontFamily:fonts.regular,
            color:colors.colorA9,width:wp("68%")}}
          numberOfLines={1}>Phase 5, Sector 59, Sahibzada Ajit...</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('profile');
          }}
          activeOpacity={0.8}>
          <Image
            style={{width: 40, height: 40, borderRadius: 100}}
            source={appImages.profileImage}
          />
        </TouchableOpacity>
      </View>
  );
};

export default DashboardHeader2;
