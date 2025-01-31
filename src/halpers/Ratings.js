import React,{memo} from 'react';
import {Text, View, StyleSheet,Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Rating} from 'react-native-rating-element';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme/colors';

const size = Dimensions.get('window').height;

const Ratings = memo(({rateFormat,starHeight,mainStyle,width,height,rateColor}) => {

  let rating = rateFormat

  const renderStar = (index) => {
    const decimalPart = rating - Math.floor(rating);
    let iconName = 'star-border';

    if (index < Math.floor(rating)) {
      iconName = 'star';
    } else if (index === Math.floor(rating) && decimalPart > 0) {
      iconName = 'star-half';
    }

    return (
      <Icon key={index} name={iconName} size={starHeight} color={ rateColor ? rateColor : colors.main} />
    );
  };


  return (
    <View
    
    style={[styles.main(width,height),mainStyle]}
     
     >
          {/* <Rating
        rated={Number(rateFormat)}
        totalCount={5}
        ratingColor="#F9BD00"
        ratingBackgroundColor="#d4d4d4"
        size={size /starHeight}
        readonly
        icon="ios-star"
        direction="row"
      /> */}
      {Array.from({ length: 5 }, (_, index) => renderStar(index))}
      </View>
  );
});

export default Ratings;

const styles = StyleSheet.create({
 main:(width,height)=>({
    backgroundColor:colors.colorF910,
    borderRadius:4,
    borderWidth:0.5,
    borderColor:colors.colorF9,
    width:width ? width:wp('19%'),
    height:height?height:hp('2.4%'),
    justifyContent:'center',
    alignItems:'center',
    flexDirection : 'row'
 }),
});
