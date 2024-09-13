import React, {useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {Strings} from '../translates/strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const ChangeRoute2 = ({data, navigation,route}) => {

  const onRoutePress =(item)=>{
    if(item?.name == 'FOOD'){
      navigation.navigate('food',{screen:'home'})
    }else if(item?.name == 'RIDE'){
      navigation.navigate('ride',{screen:'home'})
    }else if(item?.name == 'PARCEL'){
      navigation.navigate('parcel',{screen:'home'})
    }
    else{
      navigation.navigate('dashborad',{screen:'home'})
    }
    

  }

  const renderItem = ({item, index}) => {
    return (
        <>
        {route !== item?.name ?  
        <TouchableOpacity
        onPress={()=>{onRoutePress(item)}}
        activeOpacity={0.8}
        key={index}
        style={styles.mainTouch(index)}>
        <SvgXml
          style={{marginLeft: '8%', marginTop: '8%'}}
          xml={item?.duIcon}
        />
        <Text
          style={styles.nameText}>
          {item?.name}
        </Text>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={item?.image}
        />
        </TouchableOpacity>
        :null}
      </>
    );
  };

  return (
      <View style={styles.container}>
        <FlatList
          nestedScrollEnabled={true}
          scrollEnabled={false}
          bounces={false}
          style={{
            marginTop: '1%',
            alignSelf: 'center',
          }}
          contentContainerStyle={{paddingBottom: '1%',width:wp('90%'),}}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2} // Set number of columns
        />
      </View>
  );
};

export default ChangeRoute2;

const styles = StyleSheet.create({
  container:{
    flex: 1, 
    flexWrap: 'wrap',
    marginTop:'6%'
    },
    mainTouch:(index)=>({
      marginLeft:(index)%2 == 0 ? 0:'auto',
      width: wp('43%'),
      height: hp('15%'),
      backgroundColor: colors.colorDo,
      borderRadius: 10,
      borderColor:colors.colorD6,
      borderWidth:1.5,
      // marginTop: '5%',
    }),
    nameText:{
      marginLeft: '8%',
      marginTop: '7%',
      fontSize: RFValue(15),
      fontFamily: fonts.bold,
      color: colors.color27,
    },
    image:{
      alignSelf: 'center',
      marginTop: '-15%',
      marginLeft: '40%',
      width: 90,
      height: 90,
    }

})