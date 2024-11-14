import React from 'react';
import {Surface} from 'react-native-paper';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';
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
    <View>
      {/* <LinearGradient
        colors={['#28B05610', '#28B05640', '#28B05650']}
        style={{
          height: hp('10%'),
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}></LinearGradient> */}
      <View style={styles.container}>
        <View style={styles.innerView}>
          <View style={styles.imageTextMainView}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={
                appUser?.profile_pic?.length > 0
                  ? {uri: Url?.Image_Url + appUser?.profile_pic}
                  : appImages.avtarImage
              }
            />
            <View style={styles.textEditImageMainView}>
              <View style={styles.textEditImageView}>
                <Text style={styles.nameText}>{item?.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('profile');
                  }}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  style={styles.editImage}
                  activeOpacity={0.8}>
                  <SvgXml xml={appImagesSvg.editProfile} />
                </TouchableOpacity>
              </View>
              <Text style={styles.emailText}>{item?.email}</Text>
              <Text style={styles.phoneText}>{item?.phone}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileUpperShowComp;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  innerView: {
    width:screenWidth(90),
    height:screenHeight(11),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.colorD9,
    justifyContent: 'center',
    // marginTop: '-13%',
    backgroundColor: colors.white,
  },
  imageTextMainView: {
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: '5%',
    borderColor: colors.main,
    borderWidth: 0.3,
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
