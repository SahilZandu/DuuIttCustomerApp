import React, { useEffect, useState } from 'react';
import {Surface} from 'react-native-paper';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';

const ProfileCompleteIconTextComp = ({navigation,  appUser}) => {
    const [completedProfile ,setCompletedProfile]=useState('30%')
  // console.log('appUser --- comp', appUser);

  useEffect(()=>{
    if(appUser?.name?.length > 0){
      setCompletedProfile('100%')
    }else{
      setCompletedProfile('30%')
    }

  },[appUser])

  return (
    <Surface elevation={2} style={styles.container}>
      <View key={0} style={styles.innerView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('profile');
          }}
          style={styles.profileTouchView}>
          <SvgXml height={22} width={22} xml={appImagesSvg.profileIcon} />

          <Text style={styles.title}>{'My Profile'}</Text>
          <View style={styles.completeView}>
            <Text style={styles.completeText}>{`${completedProfile} completed`}</Text>
          </View>
          <SvgXml
            height={22}
            width={22}
            style={{marginLeft: 'auto'}}
            xml={appImagesSvg.rightArrow}
          />
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default ProfileCompleteIconTextComp;

const styles = StyleSheet.create({
  container: {
    shadowColor: colors.black50, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('7%'),
    marginTop: '4%',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  innerView: {
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 16,
  },
  profileTouchView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: fonts.regular,
    marginLeft: '3%',
    color: colors.color24,
  },
  completeView: {
    borderWidth: 1,
    borderColor: colors.colorFFA,
    backgroundColor:colors.colorFF10,
    marginRight: '1%',
    paddingHorizontal: '4%',
    padding: '1.5%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  completeText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color:colors.colorFF,
  },
});
