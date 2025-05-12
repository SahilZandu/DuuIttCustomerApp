import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import PickDropComp from './PickDropComp';

const PickDropImageComp = ({item, image}) => {
  return (
    <View style={styles.main}>
      <PickDropComp
        pickUpTextStyle={{color: colors.black, width: wp('68%')}}
        dropTextStyle={{width: wp('68%')}}
        item={item}
        numOfLine={2}
        lineHeight={90}
      />
      <View style={{left: '2%', top: '3%'}}>
        <Image
          resizeMode="contain"
          style={{height: 70, width: 70}}
          source={image}
        />
      </View>
    </View>
  );
};

export default PickDropImageComp;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '3%',
  },
});
