import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, Dimensions,TouchableOpacity,Image,View,Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import CTA from './cta/CTA';
import { currencyFormat } from '../halpers/currencyFormat';



const CardOrder= ({item ,index}) => {

  return (
    <TouchableOpacity
       key={index}
      activeOpacity={0.8}
       style={{
        width:wp("90%"),
      backgroundColor:colors.white,
      alignSelf:'center',
      marginTop:'5%',
      borderRadius:10,
      borderWidth:0.5,
      borderColor:colors.black65}}>
      <View style={{
      paddingHorizontal:'3%',
      marginTop:'5%',
      flexDirection:'row',
        }}>
        <Image style={{width:75,height:75,borderRadius:10}} source={item?.image}/>
        <View style={{flex:1, flexDirection:'column',marginLeft:'2.5%'}}>
         <Text
         numberOfLines={1}
          style={{fontSize:RFValue(15),fontFamily:fonts.medium,color:colors.black}}>{item?.name?item?.name:`Tracking ID:${item?.tracking_id}`}</Text>
          <Text style={{fontSize:RFValue(13),fontFamily:fonts.medium,color:'#838282',marginTop:'3%'}}>{item?.date}</Text>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:'3%'}}>
          <Text style={{fontSize:RFValue(13),fontFamily:fonts.medium,color:item?.status == 'Canceled' ? '#E70000':'#28B056'}}>{item?.status}</Text>
          <View style={{flex:1,marginLeft:'4%'}}>
          <SvgXml xml={item?.status == 'Canceled' ?appImagesSvg.crossSvg: appImagesSvg.rightSvg}/>
          </View>
          <Text style={{fontSize:RFValue(13),fontFamily:fonts.medium,color:colors.black}}>{currencyFormat(item?.price)}</Text>
          </View>
        </View>
     
      </View>

      <View style={{marginHorizontal:10,marginTop:'3%'}}>
           
        {item?.itemArray?.map((value,i)=>{
          return(
            <>
           {value?.type?.length > 0  ?  <View style={{flexDirection:'row',marginTop:'4%'}}>
              <SvgXml xml={value?.type == 'veg' ? appImagesSvg.vegSvg :appImagesSvg.nonVeg}/>
              <Text 
              numberOfLines={1}
              style={{fontSize:RFValue(13),fontFamily:fonts.regular,
               marginLeft:'2%',width:wp("79%")}}>{value?.name}
               <Text style={{color:'#646464'}}> x {value?.qty}</Text>
               </Text>
            </View>
            :
            <View style={{flexDirection:'row',marginTop:'5%'}}>
            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <View style={{height:13,width:13,
                borderRadius:100,borderWidth:3,borderColor:'#28B056'}} />
                <View style={{
                  marginTop:'-2%',
                  height:52,width:2.5,
                backgroundColor:'#28B056',}} />
                <View style={{height:13,width:13,backgroundColor:'#28B056',
                borderRadius:100,borderWidth:3,borderColor:'#28B056'}} />

              </View>
              {/* <SvgXml xml={appImagesSvg.vegSvg}/> */}
              <View style={{flexDirection:'column',marginLeft:'3%'}}>
              <Text
              numberOfLines={1} 
              style={{fontSize:RFValue(12),fontFamily:fonts.medium,color:'#838282'}}>Pickup point </Text>
              <Text
               numberOfLines={1} 
               style={{flex:1, fontSize:RFValue(12),fontFamily:fonts.medium,color:'#838282',marginTop:'1%',width:wp("79%")}}>{value?.pickup}</Text>
              <Text 
               numberOfLines={1} 
              style={{fontSize:RFValue(12),fontFamily:fonts.medium,color:'#000000',width:wp("79%")}}>{value?.drop} dsgh mdf huds bjsg</Text>
              </View>
            </View>
          }
            </>
          )
        })}

      <View style={{marginTop:'12%'}}>
      <CTA
        title={'ReOrder'}
        onPress={() => {
          // handleVerify(otp);
        }}
         bottomCheck={15}
      />  
   </View>
      </View>


      </TouchableOpacity>
  );
};

export default CardOrder;


