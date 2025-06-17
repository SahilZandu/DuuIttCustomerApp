import React, { useEffect, useState } from 'react';
import { Surface } from 'react-native-paper';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import { screenHeight } from '../halpers/matrics';

const ProfileCompleteIconTextComp = ({ navigation, appUser }) => {
  const [completedProfile, setCompletedProfile] = useState('30%')
  // console.log('appUser --- comp', appUser);

  // useEffect(() => {
  //   if (appUser?.gender?.length > 0 &&
  //     appUser?.email?.length > 0 &&
  //     appUser?.profile_pic?.length > 0 &&
  //     appUser?.date_of_birth?.length > 0) {
  //     setCompletedProfile('100%');
  //   } else if (appUser?.gender?.length > 0 &&
  //     appUser?.email?.length > 0 &&
  //     appUser?.profile_pic?.length > 0
  //   ) {
  //     setCompletedProfile('85%');
  //   }
  //   else if (appUser?.gender?.length > 0 &&
  //     appUser?.email?.length > 0 &&
  //     appUser?.date_of_birth?.length > 0) {
  //     setCompletedProfile('85%');
  //   }
  //   else if (appUser?.gender?.length > 0 &&
  //     appUser?.profile_pic?.length > 0 &&
  //     appUser?.date_of_birth?.length > 0) {
  //     setCompletedProfile('85%');
  //   } else if (appUser?.gender?.length > 0 &&
  //     appUser?.email?.length > 0
  //   ) {
  //     setCompletedProfile('70%');
  //   } else if (appUser?.gender?.length > 0 &&
  //     appUser?.date_of_birth?.length > 0) {
  //     setCompletedProfile('70%');
  //   }
  //   else if (appUser?.gender?.length > 0 &&
  //     appUser?.profile_pic?.length > 0) {
  //     setCompletedProfile('70%');
  //   }
  //   else if (appUser?.gender?.length > 0) {
  //     setCompletedProfile('50%');
  //   }
  //   else {
  //     setCompletedProfile('30%')
  //   }

  // }, [appUser])
  useEffect(() => {
    if (appUser) {
      const fields = [
        appUser?.gender,
        appUser?.email,
        appUser?.profile_pic,
        appUser?.date_of_birth,
      ];

      const filledCount = fields?.filter(field => !!field?.length).length;

      const completionMap = {
        4: '100%',
        3: '85%',
        2: '70%',
        1: '50%',
        0: '30%',
      };

      setCompletedProfile(completionMap[filledCount]);
    }

  }, [appUser]);

  return (
    <Surface elevation={2} style={styles.container}>
      <View key={0} style={styles.innerView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('profile', { screenName: 'sideMenu' });
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
            style={{ marginLeft: 'auto' }}
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
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: screenHeight(7),
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
    backgroundColor: colors.colorFF10,
    marginRight: '1%',
    paddingHorizontal: '4%',
    padding: '1.5%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  completeText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.colorFF,
  },
});
