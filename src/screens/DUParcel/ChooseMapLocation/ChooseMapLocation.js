import React, {useCallback, useEffect, useRef, useState} from 'react';
import { View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MapRoute from '../../../components/MapRoute';
import {styles} from './styles';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import CTA from '../../../components/cta/CTA';
import Spacer from '../../../halpers/Spacer';
import AutoCompleteGooglePlaceHolder from '../../../components/AutoCompleteGooglePlaceHolder';
import Header from '../../../components/header/Header';



const ChooseMapLocation = ({navigation,route}) => {
  const {pickDrop}=route.params
  // console.log("pickDrop--",pickDrop)
  const onPressAddress =(data ,details)=>{
    console.log("data ,details 333",data ,details)
  }
 
  return (
    <View style={styles.container}>
      <Header
        title={'Choose On Map Location'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex:1}}> 
       <MapRoute 
         mapContainerView={{height:hp("70%")}} 
         />
        <AutoCompleteGooglePlaceHolder onPressAddress={onPressAddress} />
         
          </View>
          <View style={styles.bottomPopUpContainer}>
          <View style={{paddingHorizontal:30,
            marginTop:'3%',}}>
          <LocationHistoryCard
          bottomLine={true}
          item={{name:'TDI TAJ PLAZA Block-505',address:'Airport Road, Sector 118, Sector 73, Sahibzada....'}}
          index={0}
          onPress={() => {
          }}
        />
        <Spacer space={'12%'}/>
        <CTA 
        onPress={()=>{navigation.navigate("senderReceiverDetails",{pickDrop:pickDrop})}}
        title={'Confirm'}
        textTransform={'capitalize'}
        bottomCheck={10}
        />
        </View>
          </View>
    </View>
  );
};

export default ChooseMapLocation;
