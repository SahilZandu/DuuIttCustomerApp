import React from 'react';
import {Surface} from 'react-native-paper';
import {TouchableOpacity, View, Text, Image, StyleSheet, Platform} from 'react-native';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import LinearGradient from 'react-native-linear-gradient';
import Url from '../api/Url';
import { screenHeight, screenWidth } from '../halpers/matrics';

const ProfileUpperShowComp = ({navigation, appUser, item}) => {
  return (
    <Surface elevation={2} style={styles.surfaceView}>
      <View style={styles.container}>
        <View style={styles.innerView}>
          <View style={styles.imageTextMainView}>
          <View style={styles.imageView}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={
                appUser?.profile_pic?.length > 0
                  ? {uri: Url?.Image_Url + appUser?.profile_pic}
                  : appImages.avtarImage
              }
            />
            </View>
            <View style={styles.textEditImageMainView}>
              <View style={styles.textEditImageView}>
                <Text numberOfLines={1} style={styles.nameText}>{item?.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('profile',{screenName:'sideMenu'});
                  }}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  style={styles.editImage}
                  activeOpacity={0.8}>
                  <SvgXml xml={appImagesSvg.editProfile} />
                </TouchableOpacity>
              </View>
              <Text numberOfLines={2} style={styles.emailText}>{item?.email}</Text>
              <Text numberOfLines={1} style={styles.phoneText}>{item?.phone}</Text>
            </View>
          </View>
        </View>
      
      </View>
      </Surface>
  );
};

export default ProfileUpperShowComp;

const styles = StyleSheet.create({
  surfaceView:{
    shadowColor:Platform.OS == 'ios'? colors.black50:colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height:screenHeight(13),
    marginTop: '6%',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: '6%',
  },
  innerView: {
    width:screenWidth(90),
    height:screenHeight(13),
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: colors.colorD9,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  imageTextMainView: {
    flexDirection: 'row',
  },
  imageView:{
    width: 70,
    height: 70,
    borderRadius: 100,
    marginLeft: '5%',
    borderColor: colors.main,
    borderWidth: 0.3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 100,
    // marginLeft: '5%',
    // borderColor: colors.main,
    // borderWidth: 0.3,
  },
  textEditImageMainView: {
    flex: 1,
    marginLeft: '3%',
    justifyContent: 'center',
  },
  textEditImageView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nameText: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  editImage: {
    marginRight: '7%',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black75,
    marginTop: '1%',
  },
  phoneText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black75,
    marginTop: '1.5%',
  },
});
