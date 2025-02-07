import React, {useEffect, useState} from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../theme/fonts/fonts';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import TrackingOrderCard from './TrackingOrderCard';
import {currencyFormat} from '../halpers/currencyFormat';
import moment from 'moment';

const DotTextExpireComp = ({item, index, data}) => {
    console.log('item--',item);
const tillFormateDate =(myDate)=>{
    // const myDate = new Date();
   const formattedDate = `Valid till ${moment(myDate).format('Do MMM.')}`;
   return formattedDate
}
const expireFormateDate=(myDate)=>{
// const myDate = new Date(); // Example: Current date
const formateDate = moment(myDate).format('MMMM D, YYYY');
return formateDate
}

  return (
    <View key={index} style={[styles.main(index, data)]}>
      <View style={styles.dotView} />
      {item?.expireDate > 0 ? <>
        <Text style={styles.text}>{item?.title}{' '}{expireFormateDate(item?.expireDate)}</Text>
      </>:
      <>
      {Number(item?.wallet) > 0 ? (
        <Text style={styles.text}>
             <Text
           numberOfLines={2}
            style={{
              color: colors.black,
            }}>
            {currencyFormat(Number(item?.wallet))}
          </Text>
          {' '} {item?.title}
         
        </Text>
      ) : (
        <Text 
        numberOfLines={2}
        style={styles.text}> {item?.coupanCount +' '+ item?.title}{' '}({tillFormateDate(item?.validTill)})</Text>
      )}
      </>
     }
    </View>
  );
};

export default DotTextExpireComp;

const styles = StyleSheet.create({
  main: (index, data) => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: index == 0 ? '4%' : '2%',
    marginHorizontal: '3%',
    marginBottom: index == data?.length - 1 ? '4%' : '2%',
  }),
  dotView: {
    height: 7,
    width: 7,
    borderRadius: 10,
    backgroundColor: colors.color53,
  },
  text: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color53,
    marginLeft: '2%',
  },
});
