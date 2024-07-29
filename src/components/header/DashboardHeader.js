import React, {useEffect, useState,useRef} from 'react';
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


const DashboardHeader = ({
  onPress,
  title,
  onPressFirst,
  firstImage,
  onPressSecond,
  secondImage,
  value,
  onChangeText,
  onFocus,
  onBlur,
  onCancelPress,
  onMicroPhone
}) => {

  const searchInputRef = useRef(null);
  const handleSearchButtonPress = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.backColorMain,
          alignItems: 'center',
          paddingBottom: '2%',
          marginTop: '2%',
          paddingHorizontal:20,
        }}>

       <View style={{flex:1, backgroundColor:colors.white,marginRight:'1%'}}>
       <Text
        numberOfLines={1}
        style={{fontSize:RFValue(12),fontFamily:fonts.semiBold,color:colors.main}} >Home</Text>
       <Text
       numberOfLines={1}
        >Phase 5, Sector 59, Sahibzada Ajit...</Text>
       </View>

       <TouchableOpacity activeOpacity={0.8} >
        <Image style={{width:40,height:40,borderRadius:100}} 
         source={appImages.profileImage} />
       </TouchableOpacity>
      </View>

      {onChangeText && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: '4%',
            marginTop: '3%',
          }}>
          <View
            style={{
             width: wp('90%'),
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf:'center',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.screenBackground,
              backgroundColor:colors.screenBackground,
            }}>
          
            <TextInput
               ref={searchInputRef}
              value={value}
              onChangeText={onChangeText}
              // autoFocus={true}
              placeholderTextColor="#808080"
              placeholder="Search"
              style={{
                width: wp('73%'),
                height: hp('5%'),
                paddingLeft: '4%',  
                paddingRight: '2%', 
                fontSize: RFValue(12),
                color: colors.black,
                padding:0
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            {value?.length > 0 ? <TouchableOpacity
             onPress={onCancelPress} 
             activeOpacity={0.8}
            hitSlop={{top:15,bottom:10,left:5,right:5}}>
            <SvgXml 
            width={21} height={21} 
            xml={appImagesSvg.cancelSvg2} 
            style={{right:wp('0.1%')}}
             />
           </TouchableOpacity>:
           <TouchableOpacity
           onPress={()=>{handleSearchButtonPress()}} 
           activeOpacity={0.8}
          hitSlop={{top:15,bottom:10,left:5,right:5}}>
          <SvgXml width={20} height={20} xml={appImagesSvg.searchIcon} 
           style={{right:wp('0.7%')}}
         />
         </TouchableOpacity>
           }
            <View style={{height:23,width:2,backgroundColor:'#A9A9AA',left:wp('1.5%')
            }}></View>
            <TouchableOpacity 
            onPress={onMicroPhone}
             activeOpacity={0.8}
            hitSlop={{top:15,bottom:10,left:5,right:5}}
            style={{left:wp('3%')}}>
            <SvgXml width={20} height={20} xml={appImagesSvg.microPhoneSvg} />
            </TouchableOpacity>
          </View>
        
        </View>
      )}
    </View>
  );
};

export default DashboardHeader;
