import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white,
  },
  middleLineView:{
    height: 1,
    backgroundColor: colors.colorD1,
    marginTop: '4%',
    marginHorizontal: -20,
  },
  autoCompleteSubConatiner: {
    width: wp('100%'),
    paddingHorizontal: hp('2.4%'),
    backgroundColor: 'transparent',
    padding: hp('2%'),
    alignSelf:'center'

  },
  textinputContainer: {
    alignItems: 'center',
    alignSelf:'center',
    backgroundColor: 'white',
    width: wp('90%'),
    // borderWidth: 1,
    // borderColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: hp('2%'),
    height: hp('6%'),
  },
  textInput: {
    fontFamily: fonts.regular,
    color: '#000000',
    backgroundColor: 'white',
    fontSize: RFValue(12),
    marginBottom: 0,
    height: hp('5%'),
  },
  row: {
    // width: wp('100%'),
    height: 50,
  },
  description: {
    color:colors.black,
    fontFamily:fonts.regular,
    fontSize: RFValue(12),
  },
  homeConatiner: {
    backgroundColor: 'white',
    flex: 1,
  },
  homeSubContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowRadius: 1,
    shadowOffset: {height: 2, width: 0},
  },
  mapContainer: {
    alignSelf: 'center',
    height: hp('100%'),
    width: wp('100%'),
    overflow: 'hidden',
  },
  bottomPopUpContainer:{
    position:'absolute', backgroundColor:colors.white,
          borderTopLeftRadius:25,borderTopRightRadius:25,
          bottom:0,alignSelf:'center',height:hp("19%")
  }
 
});
