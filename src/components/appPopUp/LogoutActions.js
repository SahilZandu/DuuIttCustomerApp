import React, {useState} from 'react';
import {Text, View, Pressable, ActivityIndicator} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fonts } from '../../theme/fonts/fonts';


const LogoutActions = ({onCancle, onLogout, type}) => {
  const actions = [
    {
      action: 'Cancel',
      onAction: () => onCancle(),
    },
    {
      action: type == 'logout' ? 'Logout' : 'Back',
      onAction: () => onLogout(),
    },
    
  ];

  const [loading, setLoading] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%',
      }}>
      {actions?.map((item, key) => (
        <Pressable
          onPress={() => {
            if (type == 'logout') {
              setLoading(true);
            }
            item.onAction();
          }}
          key={key}
          style={{
            height: hp('4%'),
            width: wp('20%'),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: key == 0 ? 1 : 0,
            borderRadius: 10,
            borderColor: '#D9D9D9',
            backgroundColor:
              key == 0
                ? 'white'
                : type == 'logout'
                ? '#CB2F2F'
                : 'rgba(254, 240, 199, 1)',
            marginRight: key == 0 ? 15 : 0,
          }}>
          {type == 'logout' && item?.action == 'Logout' ? (
            loading == true ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  fontSize: RFValue(11),
                  fontFamily: fonts.medium,
                  color:
                    key == 0
                      ? '#333333'
                      : type == 'logout'
                      ? 'white'
                      : '#DC6803',
                }}>
                {item?.action}
              </Text>
            )
          ) : (
            <Text
              style={{
                fontSize: RFValue(11),
                fontFamily: fonts.medium,
                color:
                  key == 0 ? '#333333' : type == 'logout' ? 'white' : '#DC6803',
              }}>
              {item?.action}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};

export default LogoutActions;
