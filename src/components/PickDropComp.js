import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';


const PickDropComp = ({item,lineHeight,pickUpTextStyle,dropTextStyle}) => {
  return (
    <View style={styles.container}>
      <View
        style={styles.circleViewMain}>
        <View
          style={styles.upperCircle}
        />
        <View
          style={styles.middleLine(lineHeight)}
        />
        <View
          style={styles.bottomCircle}
        />
      </View>
      <View style={styles.textMainView}>
        <Text
          numberOfLines={1}
          style={styles.pickupPointText}>
          Pickup location{' '}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.pickUpText,pickUpTextStyle]}>
          {item?.pickup}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.dropText,dropTextStyle]}>
          {item?.drop}
        </Text>
      </View>
    </View>
  );
};

export default PickDropComp;

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
     marginTop: '4%'
  },
  circleViewMain:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upperCircle:{
    height: 13,
    width: 13,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.main,
  },
  middleLine:(lineHeight)=>({
    marginTop: '-2%',
    height:lineHeight ? lineHeight: 42,
    width: 2.5,
    backgroundColor:colors.main,
  }),
  bottomCircle:{
    height: 13,
    width: 13,
    backgroundColor: colors.main,
    borderRadius: 100,
    borderWidth: 3,
    borderColor:colors.main,
  },
  textMainView:{
    flexDirection: 'column',
     marginLeft: '3%'
  },
  pickupPointText:{
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color:colors.color83,
  },
  pickUpText:{
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color:colors.color83,
    marginTop: '1%',
    width: wp('75%'),
  },
  dropText:{
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color:colors.black,
    width: wp('75%'),
  }

});
